const messages = document.querySelector("#messages");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const statusText = document.querySelector("#statusText");
const newChatButton = document.querySelector("#newChatButton");
const conversationList = document.querySelector("#conversationList");
const historySearch = document.querySelector("#historySearch");

let conversations = [
  {
    id: crypto.randomUUID(),
    title: "New chat",
    subtitle: "Start a Movira question",
    messages: []
  }
];

let activeConversationId = conversations[0].id;

function getActiveConversation() {
  return conversations.find((conversation) => conversation.id === activeConversationId);
}

function setHasChatState() {
  const activeConversation = getActiveConversation();
  document.body.classList.toggle("has-chat", Boolean(activeConversation?.messages.length));
}

function renderConversationList() {
  const query = historySearch.value.trim().toLowerCase();
  conversationList.innerHTML = "";

  const filteredConversations = conversations.filter((conversation) => {
    return conversation.title.toLowerCase().includes(query);
  });

  for (const conversation of filteredConversations) {
    const button = document.createElement("button");
    button.className = `conversation-item ${conversation.id === activeConversationId ? "active" : ""}`;
    button.type = "button";

    const title = document.createElement("span");
    title.textContent = conversation.title;

    const subtitle = document.createElement("small");
    subtitle.textContent = conversation.subtitle;

    button.append(title, subtitle);
    button.addEventListener("click", () => {
      activeConversationId = conversation.id;
      renderMessages();
      renderConversationList();
    });
    conversationList.appendChild(button);
  }
}

function createTypingElement() {
  const article = document.createElement("article");
  article.className = "message assistant typing-message";
  article.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  return article;
}

function appendInlineText(parent, text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      parent.appendChild(strong);
    } else {
      parent.appendChild(document.createTextNode(part));
    }
  }
}

function createRichAssistantContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className = "assistant-content";

  let activeList = null;
  let advancedDetails = null;
  let advancedBody = null;

  function appendParagraph(line) {
    const paragraph = document.createElement("p");
    appendInlineText(paragraph, line);
    (advancedBody || wrapper).appendChild(paragraph);
  }

  function appendListItem(line, ordered) {
    const target = advancedBody || wrapper;
    const listTag = ordered ? "ol" : "ul";

    if (!activeList || activeList.tagName.toLowerCase() !== listTag || activeList.parentElement !== target) {
      activeList = document.createElement(listTag);
      target.appendChild(activeList);
    }

    const item = document.createElement("li");
    appendInlineText(item, line);
    activeList.appendChild(item);
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (/^\**advanced checks\**:?$/i.test(line)) {
      advancedDetails = document.createElement("details");
      advancedDetails.className = "advanced-section";
      advancedDetails.open = false;

      const summary = document.createElement("summary");
      summary.textContent = "Advanced checks";
      advancedBody = document.createElement("div");
      advancedBody.className = "advanced-body";

      advancedDetails.append(summary, advancedBody);
      wrapper.appendChild(advancedDetails);
      activeList = null;
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      appendListItem(orderedMatch[1], true);
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      appendListItem(bulletMatch[1], false);
      continue;
    }

    activeList = null;
    appendParagraph(line);
  }

  if (!advancedDetails || advancedBody.childElementCount) {
    return wrapper;
  }

  advancedDetails.remove();
  return wrapper;
}

function createSourceList(sources = []) {
  const uniqueSources = [];
  const seen = new Set();

  for (const source of sources) {
    const key = `${source.file}:${source.heading}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueSources.push(source);
  }

  if (!uniqueSources.length) return null;

  const details = document.createElement("details");
  details.className = "source-section";

  const summary = document.createElement("summary");
  summary.textContent = `Sources (${uniqueSources.length})`;

  const list = document.createElement("ul");
  list.className = "source-list";

  for (const source of uniqueSources) {
    const item = document.createElement("li");

    const title = document.createElement("span");
    title.textContent = source.heading
      ? `${source.title} - ${source.heading}`
      : source.title;

    const file = document.createElement("small");
    file.textContent = source.file;

    item.append(title, file);
    list.appendChild(item);
  }

  details.append(summary, list);
  return details;
}

function createMessageElement(role, content, sources = []) {
  if (role === "typing") {
    return createTypingElement();
  }

  const article = document.createElement("article");
  article.className = `message ${role}`;

  if (role === "assistant") {
    article.appendChild(createRichAssistantContent(content));
    const sourceList = createSourceList(sources);
    if (sourceList) {
      article.appendChild(sourceList);
    }
  } else {
    article.textContent = content;
  }

  return article;
}

function renderMessages() {
  const activeConversation = getActiveConversation();
  messages.innerHTML = "";

  for (const message of activeConversation.messages) {
    messages.appendChild(createMessageElement(message.role, message.content, message.sources));
  }

  setHasChatState();
  messages.scrollTop = messages.scrollHeight;
}

function addMessage(role, content = "") {
  const activeConversation = getActiveConversation();
  activeConversation.messages.push({ role, content });

  if (role === "user" && activeConversation.title === "New chat") {
    activeConversation.title = content.length > 38 ? `${content.slice(0, 38)}...` : content;
    activeConversation.subtitle = "Just now";
  }

  messages.appendChild(createMessageElement(role, content));
  setHasChatState();
  renderConversationList();
  messages.scrollTop = messages.scrollHeight;
}

async function checkHealth() {
  const response = await fetch("/api/health");
  const health = await response.json();

  if (!health.hasApiKey) {
    statusText.textContent = "Add your API key to enable answers.";
    return;
  }

  if (!health.hasVectorIndex) {
    statusText.textContent = "Knowledge is not ready yet. Build the index once from VS Code.";
    return;
  }

  if (!health.isVectorIndexCurrent) {
    statusText.textContent = "Knowledge changed. Rebuild the index before asking questions.";
    return;
  }

  statusText.textContent = "Ready to answer from the Movira knowledge base.";
}

async function askAssistant(message) {
  let response;

  try {
    response = await fetch("/api/staff-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
  } catch {
    throw new Error("Movira AI is not connected right now. Please make sure the local app is running, then try again.");
  }

  if (!response.ok) {
    const error = await response.json();
    const message =
      error.error === "fetch failed"
        ? "Movira AI could not reach the AI service right now. Please try again after checking your internet/API connection."
        : error.error || "The assistant could not answer.";
    throw new Error(message);
  }

  return response.json();
}

async function submitMessage(message) {
  const cleanMessage = message.trim();
  if (!cleanMessage) return;

  input.value = "";
  input.style.height = "auto";
  addMessage("user", cleanMessage);
  addMessage("typing");

  const activeConversation = getActiveConversation();
  const loadingMessageIndex = activeConversation.messages.length - 1;

  try {
    const result = await askAssistant(cleanMessage);
    activeConversation.messages.splice(loadingMessageIndex, 1, {
      role: "assistant",
      content: result.answer,
      sources: result.sources || []
    });
    renderMessages();
  } catch (error) {
    activeConversation.messages.splice(loadingMessageIndex, 1, {
      role: "assistant",
      content: error.message
    });
    renderMessages();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitMessage(input.value);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitMessage(input.value);
  }
});

newChatButton.addEventListener("click", () => {
  const conversation = {
    id: crypto.randomUUID(),
    title: "New chat",
    subtitle: "Start a Movira question",
    messages: []
  };

  conversations = [conversation, ...conversations];
  activeConversationId = conversation.id;
  renderMessages();
  renderConversationList();
  input.focus();
});

historySearch.addEventListener("input", renderConversationList);

renderConversationList();
renderMessages();
checkHealth();
