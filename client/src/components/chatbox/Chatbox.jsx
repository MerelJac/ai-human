import axios from "axios";
import React, { useState } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Chatbox({content}) {
  const [chatText, setChatText] = useState("");

  // Update chatText when the content prop changes

  const handleInputChange = (e) => {
    setChatText(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      // Send the chatText in the request body
      await axios.post(
        `${serverUrl}/api/chats`,
        { chatText },
        { withCredentials: true }
      );
      setChatText("");
    } catch (error) {
      console.log("Error posting the chat", error);
    }
  };

  return (
    <div>
      <section>
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
