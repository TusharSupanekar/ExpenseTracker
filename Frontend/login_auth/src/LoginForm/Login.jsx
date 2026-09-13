import React from "react";
import '../Styles/LoginSignup.css'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useState } from "react";
import logo from '../images/logo.png'
import Cookies from 'js-cookie';


function Login(){

  const[action,setAction]=useState("Login");
  const[email,setEmail] = useState()
  const[username,setUsername] = useState()
  const[password,setPassword]=useState()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})



  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Send login request with email and password
    axios
      .post('http://localhost:3000/api/users/login', { email, password })
      .then((result) => {
        if (result.data['email']) {
          const userId = result.data.id;
          const username = result.data.username;
  
          // Store user session data in cookies
          Cookies.set('userId', userId, { expires: 7 });  // Cookie expires in 7 days
          Cookies.set('username', username, { expires: 7 });
  
          // Send another request to fetch the user's profile using userId
          return axios.get('http://localhost:3000/api/users/profile', {
            params: { user: userId }, // Pass userId as a param
          });
        } else {
          throw new Error('Invalid Credentials');
        }
      })
      .then((profileResult) => {
        // Log profile data
        console.log(profileResult);
        
        // After successful login and profile fetch, navigate to the dashboard
        navigate('/home');
      })
      .catch((err) => {
        console.log('Error:', err.message);
      });
  };

  return(
      <div>
          <div className="navbar">
            <div className="nav-links">
              <a href="">About Us</a>
              <Link to='/register'>Sign Up</Link>
            </div>    
          </div>
          <div className="container">
              <div className="div1">
                  <img src={logo} alt=""/>
              </div>
              <div className="div2">
                  <div className="login">
                      <h2>{action}</h2>
                      <form onSubmit={handleSubmit}>
                          <input className="field" 
                                 type="email" 
                                 name="email" 
                                 placeholder="Enter your email here" 
                                 onChange={(e) =>setEmail(e.target.value)}/>
                          <input 
                                className="field" 
                                type="password" 
                                name="password" 
                                placeholder="Enter your password here" 
                                onChange={(e) =>setPassword(e.target.value)}/>
                          <input 
                                className="button" 
                                type="submit" 
                                value="Login"/>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Login