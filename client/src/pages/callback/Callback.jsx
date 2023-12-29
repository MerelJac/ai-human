import React, { useRef, useContext, useEffect} from 'react'
import { AuthContext, serverUrl } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Callback() {
    const called = useRef(false);
    const { checkLoginState, loggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
      (async () => {
        if (loggedIn === false) {
          try {
            if (called.current) return; // prevent rerender caused by StrictMode
            called.current = true;
            const res = await axios.get(
              `${serverUrl}/auth/token${window.location.search}`
            );
            console.log("response: ", res);
            checkLoginState();
            navigate("/");
          } catch (err) {
            console.error(err);
            navigate("/");
          }
        } else if (loggedIn === true) {
          navigate("/");
        }
      })();
    }, [checkLoginState, loggedIn, navigate]);
    return <></>;
  };
