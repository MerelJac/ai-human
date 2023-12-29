import axios from "axios";
import React, { useState } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Chatbox() {
  const [chatText, setChatText] = useState("");

  const handleInputChange = (e) => {
    setChatText(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      // Send the chatText in the request body
      await axios.post(`${serverUrl}/api/chats`, { chatText }, { withCredentials: true });
      setChatText("");
    } catch (error) {
      console.log("Error posting the chat", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between absolute bottom-0 ">
        <input
          className="text-black p-2"
          type="text"
          name="chat-text"
          id="chat-text"
          value={chatText}
          onChange={handleInputChange}
        />
        <button className="btn" onClick={handleButtonClick}>
          Go
        </button>
      </div>
    </div>
  );
}
