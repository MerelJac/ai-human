import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../App"; // Import the AuthContext from App.js
import Sidebar from "../../components/sidebar/Sidebar";
import Chatbox from "../../components/chatbox/Chatbox";

export default function Dashboard() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { user, loggedIn, checkLoginState } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  // pass chats
  const [ chatContent, setChatboxContent ] = useState("")

  useEffect(() => {
    (async () => {
      if (loggedIn === true) {
        try {
          // Get posts from server
          const {
            data: { chats },
          } = await axios.get(`${serverUrl}/api/chats`, {
            withCredentials: true,
          });
          setChats(chats);
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [loggedIn, serverUrl]);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/auth/logout`, { withCredentials: true });
      // Check login state again
      checkLoginState();
    } catch (err) {
      console.error(err);

    }
  };

  const handleChatClick = (content) => {
    // Update the content in the Chatbox component
    console.log(content)
    setChatboxContent(content);
  };

  return (
    <>
      <div className="flex flex-row w-full h-[100vh]">
        <section className="w-1/3 bg-white text-black px-4 relative flex flex-col h-full">
          <Sidebar content={chatContent} handleChatClick={handleChatClick}/>
          <footer className="flex items-center justify-center absolute bottom-0 w-full">
            <img
              className="rounded-full"
              src={user?.picture}
              alt={user?.name}
            />
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </footer>
        </section>
        <section className="w-2/3 relative">
          <Chatbox content={chatContent}  />
        </section>
      </div>
    </>
  );
  
}
