import React from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import logo from '../../robot.png'

export default function Login() {
    const handleLogin = async () => {
      try {
        // Gets authentication url from backend server
        const {
          data: { url },
        } = await axios.get(`${serverUrl}/auth/url`);
        // Navigate to consent screen
        window.location.assign(url);
      } catch (err) {
        console.error(err);
      }
    };
    return (
      <>
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Welcome to AI Human</h3>
        <button className="btn" onClick={handleLogin}>
          Login
        </button>
      </>
    );
  };