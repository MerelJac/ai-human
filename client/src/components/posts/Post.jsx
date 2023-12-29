import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../App"; // Import the AuthContext from App.js

export default function Post() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [chats, setChats] = useState([]);
  const { loggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn === true) {
        try {
          // Get chats from server
          const response = await axios.get(`${serverUrl}/api/chats`, {
            withCredentials: true,
          });

          // Adjust the destructuring based on your server response
          const fetchedChats = response.data.chats; // or response.data.chats if necessary

          console.log(fetchedChats);
          setChats(fetchedChats);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [loggedIn, serverUrl]);

  return (
    <div>
      <div>
      {chats.map((chat) => (
          <div key={chat._id}>
            <h3 className="max-w-full truncate">{chat.chatContent}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
