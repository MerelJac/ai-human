import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../App"; // Import the AuthContext from App.js
import Chatbox from "../chatbox/Chatbox";

export default function Post({ url }) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [chats, setChats] = useState([]);
  const [chatboxContent, setChatboxContent] = useState(""); // Add this line
  const { loggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn === true) {
        try {
          const response = await axios.get(`${serverUrl}${url}`, {
            withCredentials: true,
          });

          const fetchedData = response.data.chats;
          setChats(fetchedData);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [loggedIn, serverUrl, url]);

  const handleChatClick = (content) => {
    // Update the content in the Chatbox component
    console.log(content)
    setChatboxContent(content);
  };
  
  

  return (
    <div>
      <div>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              className="my-2 bg-gray-500 rounded-lg"
              key={chat._id}
              onClick={() => handleChatClick(chat.chatContent)}
            >
              <h3 className="max-w-full truncate">{chat.chatContent}</h3>
            </div>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </div>

    </div>
  );
}
