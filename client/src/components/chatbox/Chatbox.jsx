import axios from "axios";
import React, { useState, useEffect } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Chatbox(props) {
  const [chatText, setChatText] = useState("");

  // Update chatText when the content prop changes
  useEffect(() => {
    setChatText(props.content || "");
  }, [props.content]);

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
        {props.content && <h2>{props.content}</h2>}
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
