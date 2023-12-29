import axios from "axios";
import React, { useEffect, useState } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Chatbox({ content, chatId, setChatboxContent, setChatId }) {
  const [chatText, setChatText] = useState("");
  const [newChatId, setNewChatId] = useState(chatId);

  // Update chatText when the content prop changes

  const handleInputChange = (e) => {
    setChatText(e.target.value);
  };

  const createRandomText = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
  }

  const handleButtonClick = async () => {
    const chatPlusRandomString = [chatText, createRandomText(200)]
    try {
      if (!chatId) {
        // If there is no chatId, it means it's a new chat, so make a POST request
        const response = await axios.post(
          `${serverUrl}/api/chats`,
          { chatPlusRandomString },
          { withCredentials: true }
        );
        // Assuming the server returns the created chatId in the response
        const chatIdNew = response.data.chat._id; // Adjust this based on your server response
        setChatboxContent(response.data.chat.chatContent)
        setNewChatId(chatIdNew);
        setChatId(chatIdNew)
        setChatText("");
      } else {
        // If there is a chatId, it means it's an existing chat, so make a PUT request
        const response = await axios.put(
          `${serverUrl}/api/chats/${chatId}`, // Include the chatId in the URL
          { chatPlusRandomString },
          { withCredentials: true },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setChatboxContent(response.data.chat.chatContent)
        setChatText("");
      }
    } catch (error) {
      console.log("Error posting or updating the chat", error);
    }
  };

  return (
    <div>
      <section key={newChatId}>
        {/* Render the content prop here or use it as needed */}
        {chatId ? content.map((c, index) => <p key={index}>{c}</p>) : null}
      </section>
      <div className="flex justify-between absolute bottom-0 p-2 w-full">
        <textarea
          className="text-black p-2 rounded-lg w-[80%]"
          name="chat-text"
          id="chat-text"
          value={chatText}
          onChange={handleInputChange}
          rows="3"
          style={{ resize: "none" }}
        />
        <button className="btn" onClick={handleButtonClick}>
          Go
        </button>
      </div>
    </div>
  );
}
