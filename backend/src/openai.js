export async function createEmbedding({ apiKey, model, input }) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, input })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${message}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function createChatAnswer({ apiKey, model, messages }) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Chat request failed: ${response.status} ${message}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
