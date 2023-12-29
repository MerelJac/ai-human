import "./App.css";
import NotFound from "./pages/notFound/NotFound";
import Test from "./pages/Test"
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";

import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const serverUrl = process.env.REACT_APP_SERVER_URL;
export { serverUrl }

const AuthContext = createContext();
export { AuthContext };

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user },
      } = await axios.get(`${serverUrl}/auth/logged_in`);
      setLoggedIn(logged_in);
      user && setUser(user);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return (
    <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const Home = () => {
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn === true) return <Dashboard />;
  if (loggedIn === false) return <Login />;
  return <></>;
};

// const Login = () => {
//   const handleLogin = async () => {
//     try {
//       // Gets authentication url from backend server
//       const {
//         data: { url },
//       } = await axios.get(`${serverUrl}/auth/url`);
//       // Navigate to consent screen
//       window.location.assign(url);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   return (
//     <>
//       <img src={logo} className="App-logo" alt="logo" />
//       <h3>Welcome to AI Human</h3>
//       <button className="btn" onClick={handleLogin}>
//         Login
//       </button>
//     </>
//   );
// };

const Callback = () => {
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/callback", // google will redirect here
    element: <Callback />,
  }, {
    path: "/test",
    element: <Test />
  }, {
    path: "*",
    element: <NotFound/>
  }
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </header>
    </div>
  );
}

export default App;
