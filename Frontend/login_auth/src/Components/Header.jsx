import React from 'react'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'
import '../Styles/Header.css'
import axios from 'axios'
import { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

function Header({OpenSidebar}) {

  /*const [users, setUsers] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:3000/api/register')
    .then(users=>setUsers(users.data))
    .catch(err=>console.log(err))
  },[])*/


  

   /* const [username, setUsername] = useState("");
  
    // Corrected getData function
    const getData = async (username) => {
      try {
        const result = await axios.get("http://localhost:3000/api/users/profile", {
          params: { username },
        });
        console.log(result.data);
        return result.data; // Make sure to return the data
      } catch (err) {
        console.error(err);
        return null;
      }
    };
  
    useEffect(() => {
      const fetchUsername = async () => {
        const data = await getData({username});
        if (data && data.username) {
          setUsername(data.username);
        }
      };
      fetchUsername();
    }, []);
  
  */
  
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
  
  

  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            <h1>Hello, {username}</h1>
        </div>
        <div className='header-right'>
           
        </div>
    </header>
  )
}

export default Header

