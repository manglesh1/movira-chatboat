function requestSignal(signal) {
  const timeout = AbortSignal.timeout(20000);
  return signal && typeof AbortSignal.any === "function" ? AbortSignal.any([signal, timeout]) : signal || timeout;
}

function safe(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,120}$/.test(value) ? value : null;
}

async function providerRequest(url, options, signal, stage, validate) {
  const combinedSignal = requestSignal(signal);
  try {
    const response = await fetch(url, { ...options, signal: combinedSignal });
    let data;
    try { data = await response.json(); }
    catch (error) {
      if (combinedSignal.aborted) throw error;
      data = null;
    }
    if (!response.ok || !data || !validate(data)) {
      // Never place upstream bodies, prompts, API keys or provider messages in errors.
      const error = new Error("The AI provider request failed.");
      const retry = response.headers.get("retry-after");
      let retryAfterMs = retry ? Number(retry) * 1000 : 0;
      if (retry && !Number.isFinite(retryAfterMs)) retryAfterMs = Date.parse(retry) - Date.now();
      error.provider = { status: response.status, code: safe(data?.error?.code) || (response.ok || !data ? "malformed_response" : null),
        type: safe(data?.error?.type), requestId: safe(response.headers.get("x-request-id")), stage,
        retryAfterMs: Math.min(60000, Math.max(0, Number(retryAfterMs) || 0)) };
      throw error;
    }
    return data;
  } catch (error) {
    if (signal?.aborted || error.provider) throw error;
    const failure = new Error("The AI provider request did not complete.");
    failure.provider = { status: null, code: combinedSignal.aborted ? "provider_timeout" : "network_error", stage };
    throw failure;
  }
}

export async function createEmbeddings({ apiKey, model, input, signal }) {
  const inputs = Array.isArray(input) ? input : [input];
  const data = await providerRequest("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, input: inputs })
  }, signal, "embedding", (value) => Array.isArray(value.data) && value.data.length === inputs.length
    && value.data.every((item) => Array.isArray(item?.embedding) && item.embedding.length > 0
      && item.embedding.every(Number.isFinite)));
  return [...data.data].sort((a, b) => Number(a.index || 0) - Number(b.index || 0)).map((item) => item.embedding);
}

export async function createEmbedding(options) {
  return (await createEmbeddings(options))[0];
}

export async function createChatAnswer({ apiKey, model, messages, signal, maxCompletionTokens = 650 }) {
  const gpt5 = /^gpt-5(?:[.-]|$)/i.test(model || "");
  const data = await providerRequest("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      ...(gpt5 ? { max_completion_tokens: maxCompletionTokens } : { temperature: 0.2, max_tokens: maxCompletionTokens }),
      messages
    })
  }, signal, "help_answer", (value) => typeof value.choices?.[0]?.message?.content === "string"
    && Boolean(value.choices[0].message.content.trim()));
  return data.choices[0].message.content;
}
