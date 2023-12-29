import axios from "axios";
import React, { useState } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Chatbox({ content, chatId, user }) {
  const [chatText, setChatText] = useState("");
  const [newChatId, setNewChatId] =useState(chatId)


  // Update chatText when the content prop changes

  const handleInputChange = (e) => {
    setChatText(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      if (!chatId) {
        // If there is no chatId, it means it's a new chat, so make a POST request
        console.log("hit me")
        const response = await axios.post(
          `${serverUrl}/api/chats`,
          { chatText },
          { withCredentials: true }
        );
        // Assuming the server returns the created chatId in the response
        const chatIdNew = response.data.chat._id; // Adjust this based on your server response
        console.log(chatIdNew)
        setNewChatId(chatIdNew);
        setChatText("");
      } else {
        console.log("hit me")
        // If there is a chatId, it means it's an existing chat, so make a PUT request
        await axios.put(
          `${serverUrl}/api/chats/${chatId}`, // Include the chatId in the URL
          { chatText },
          { withCredentials: true },
          {headers: {
            'Content-Type': 'application/json',
          },}
        );
        setChatText("");
      }
    } catch (error) {
      console.log("Error posting or updating the chat", error);
    }
  };
  
  

  return (
    <div>
      <section key={newChatId || chatId}>
        {/* Render the content prop here or use it as needed */}
        {content}
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
