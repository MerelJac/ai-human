import React, {useContext} from 'react';
import { AuthContext } from '../../App';
import Dashboard from '../dashboard/Dashboard';
import Login from '../login/Login';


export default function Home() {
    const { loggedIn } = useContext(AuthContext);
    if (loggedIn === true) return <Dashboard />;
    if (loggedIn === false) return <Login />;
    return <></>;
  };
  
