import React, { useEffect, useContext, useState} from 'react';
import axios from 'axios';
import { AuthContext } from '../../App'; // Import the AuthContext from App.js


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
            } = await axios.get(`${serverUrl}/user/posts`, { withCredentials: true });
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
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
        <h4>{user?.name}</h4>
        <br />
        <p>{user?.email}</p>
        <br />
        <img src={user?.picture} alt={user?.name} />
        <br />
        <div>
          {posts.map((post, idx) => (
            <div>
              <h5>{post?.title}</h5>
              <p>{post?.body}</p>
            </div>
          ))}
        </div>
      </>
    );
}
