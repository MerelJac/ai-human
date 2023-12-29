import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../App"; // Import the AuthContext from App.js
import Sidebar from "../../components/sidebar/Sidebar";

export default function Dashboard() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { user, loggedIn, checkLoginState } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      if (loggedIn === true) {
        try {
          // Get posts from server
          const {
            data: { posts },
          } = await axios.get(`${serverUrl}/user/posts`, {
            withCredentials: true,
          });
          setPosts(posts);
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

  return (
    <>
      <h3>Dashboard</h3>
    <div className="flex flex-row w-full">
      <section className="w-1/5">
        <Sidebar />
        <footer className="flex static bottom-0 w-full">
          <img className="rounded-full" src={user?.picture} alt={user?.name} />
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </footer>
      </section>
      <section className="w-4/5">
<p>placeholder</p>
      </section>
      </div>
    </>
  );
}
