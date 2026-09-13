import '../Styles/LoginSignup.css'
import { Link, useNavigate } from "react-router-dom";
import api from '../api';
import { useState } from "react";
import logo from '../images/logo.png'
import Cookies from 'js-cookie';


function Login(){

  const[email,setEmail] = useState()
  const[password,setPassword]=useState()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')



  const handleSubmit = (e) => {
    e.preventDefault();

    setLoginError('');

    api
      .post('/login', { email, password })
      .then((result) => {
        if (result.data['email']) {
          const userId = result.data.id;
          const username = result.data.username;

          Cookies.set('userId', userId, { expires: 7 });
          Cookies.set('username', username, { expires: 7 });

          navigate('/home');
        } else {
          throw new Error('Invalid Credentials');
        }
      })
      .catch((err) => {
        setLoginError(err.response?.data?.message || 'Invalid email or password.');
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
                      <h2>Login</h2>
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
                          {loginError && (
                            <span className="error-message">{loginError}</span>
                          )}
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