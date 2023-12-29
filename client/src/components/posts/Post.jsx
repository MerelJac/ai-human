import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../App"; // Import the AuthContext from App.js

export default function Post({ url }) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [chats, setChats] = useState([]);
  const { loggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn === true) {
        try {
          // Get data from the provided URL
          const response = await axios.get(`${serverUrl}${url}`, {
            withCredentials: true,
          });

          // Adjust the destructuring based on your server response
          const fetchedData = response.data.chats; // or response.data.chats if necessary

          console.log(fetchedData);
          setChats(fetchedData);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [loggedIn, serverUrl, url]);

  return (
    <div>
      <div>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div className="bg-gray-500 rounded-lg" key={chat._id}>
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
