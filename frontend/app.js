async function sendQuestion() {
  const input = document.getElementById("question");
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  const thinking = addMessage("Thinking...", "bot");

  try {
    const res = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    thinking.remove();

    if (data.chat_response) {
      addMessage(data.chat_response, "bot");
    } else {
      addMessage("Sorry, I can only answer questions about sales data.", "bot");
    }

  } catch (err) {
    thinking.remove();
    addMessage("Something went wrong. Please try again.", "bot");
  }
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");

  msg.className = sender === "user" ? "user-message" : "bot-message";
  msg.innerHTML = text;

  chatBox.appendChild(msg);

  requestAnimationFrame(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  return msg;
}


