const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) { // 1. Make the function async
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage); // Append user message
  input.value = '';

  // 2. Show a thinking message immediately
  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

  try {
    // 3. Use fetch to send data to the backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure body matches backend expectation { message: { userMessage: "..." } }
      body: JSON.stringify({ message: { userMessage: userMessage } }),
    });

    // 4. Remove the "thinking" message
    if (thinkingMessage && chatBox.contains(thinkingMessage)) {
      chatBox.removeChild(thinkingMessage);
    }

    if (!response.ok) {
      // Handle HTTP errors like 400 or 500
      const errorData = await response.json().catch(() => ({ reply: 'Failed to get a valid error response from the server.' }));
      appendMessage('bot', `Error: ${errorData.reply || errorData.error || `Server responded with status ${response.status}`}`);
      return;
    }

    const data = await response.json();
    appendMessage('bot', data.reply); // Display bot's actual response
  } catch (error) {
    // Handle network errors or other issues with the fetch call
    if (thinkingMessage && chatBox.contains(thinkingMessage)) {
        chatBox.removeChild(thinkingMessage);
    }
    console.error('Error sending message:', error);
    appendMessage('bot', 'Sorry, something went wrong while connecting to the bot.');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // 5. Return the message element so we can remove it later
}
