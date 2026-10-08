const orderForm = document.querySelector("#order-form");
const orderMessage = document.querySelector("#order-message");

document.querySelectorAll(".order-product").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#product").value = link.dataset.product;
  });
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  orderMessage.textContent = "Preparing your request...";
  orderMessage.classList.remove("error");
  const submitButton = orderForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  try {
    const formData = new FormData(orderForm);
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        product: formData.get("product"),
        quantity: Number(formData.get("quantity")),
        address: formData.get("address"),
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "We couldn't prepare that request.");
    orderMessage.textContent = result.message;
  } catch (error) {
    orderMessage.textContent = error.message || "Something went wrong. Please try again.";
    orderMessage.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

const chatPanel = document.querySelector("#chat-panel");
const chatLauncher = document.querySelector("#chat-launcher");
const chatInput = document.querySelector("#chat-input");
const chatMessages = document.querySelector("#chat-messages");
const chatForm = document.querySelector("#chat-form");
const chatHistory = [];

function setChatOpen(open) {
  chatPanel.classList.toggle("open", open);
  chatPanel.setAttribute("aria-hidden", String(!open));
  chatLauncher.setAttribute("aria-expanded", String(open));
  if (open) chatInput.focus();
}

function addChatMessage(text, isUser) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${isUser ? "user-bubble" : "bot-bubble"}`;
  bubble.textContent = text;
  chatMessages.append(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

chatLauncher.addEventListener("click", () => setChatOpen(!chatPanel.classList.contains("open")));
document.querySelector("#chat-close").addEventListener("click", () => setChatOpen(false));
document.querySelector("#chat-order-link").addEventListener("click", () => setChatOpen(false));

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage(message, true);
  chatInput.value = "";
  const pendingMessage = addChatMessage("One moment while I check...", false);
  const sendButton = chatForm.querySelector("button");
  sendButton.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: chatHistory.slice(-10) }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "The chat assistant is unavailable.");
    pendingMessage.textContent = result.reply;
    chatHistory.push({ role: "user", content: message });
    chatHistory.push({ role: "assistant", content: result.reply });
  } catch (error) {
    pendingMessage.textContent = error.message || "Something went wrong. Please try again.";
    pendingMessage.classList.add("error");
  } finally {
    sendButton.disabled = false;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.focus();
  }
});
