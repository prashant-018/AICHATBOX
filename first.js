document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            sendMessage();
        }
    });

    async function sendMessage() {
        let message = userInput.value.trim();
        if (!message) return;

        addMessage("You", message);
        userInput.value = "";

        try {
            let botReply = await getAIResponse(message);
            addMessage("Bot", botReply);
        } catch (error) {
            addMessage("Bot", "⚠️ Unable to connect to AI.");
        }
    }

    function addMessage(sender, text) {
        let messageElement = document.createElement("div");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
        messageElement.style.margin = "5px 0";
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function getAIResponse(userMessage) {
        try {
            let response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error("Server error");

            let data = await response.json();
            return data.reply || "⚠️ AI couldn't generate a response.";
        } catch (error) {
            console.error("❌ Error fetching AI response:", error);
            return "⚠️ Error connecting to AI. Please try again later.";
        }
    }
});
