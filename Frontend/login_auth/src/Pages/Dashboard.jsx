
import '../Styles/Dashboard.css'
import { Link } from "react-router-dom";
import axios from 'axios'
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


function Dashboard(){

    const [username, setUsername] = useState(''); // Initialize username state
    const navigate = useNavigate();
    useEffect(() => {
        // Retrieve user session data from cookies
        const storedUsername = Cookies.get('username');
        const storedUserId = Cookies.get('userId');
    
        if (storedUsername && storedUserId) {
          // If data is found in cookies, use it
          setUsername(storedUsername);
        } else {
          // If no session data, redirect to login
          navigate('/login');
        }
      }, [navigate]);
      
    return(
        <div>
            <h1>Welcome to your Dashboard</h1>    
        </div>
    )
}

export default Dashboard