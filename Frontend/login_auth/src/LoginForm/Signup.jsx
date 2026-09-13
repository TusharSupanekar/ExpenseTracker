import React from "react";
import '../Styles/LoginSignup.css'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useState } from "react";
import logo from '../images/logo.png'
import password_icon from '../images/password.png'

function Signup(){

  
  const[email,setEmail] = useState()
  const[username,setUsername] = useState()
  const[password,setPassword]=useState()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    //console.log(e.target);
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Validate the form
  const validateForm = () => {
    const validationErrors = {};
    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email is not valid";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const handleSubmit=(e)=>{
    
      e.preventDefault()
      if(validateForm()){
      axios.post('http://localhost:3000/api/users/register',{email, password, username})
      .then(result=>{
        if(result.data["email"]){
          const user = result.data.id;
          axios.post('http://localhost:3000/api/users/profile', {
            params: {
              user
            }
          })
            .then(result=>{console.log(result)}).catch(e=>console.log(e));
        }
      }).catch(err=>console.log(err))
    }
  }

  return(
      <div>
          <div className="navbar">
              <div className="nav-links">
                <a href="">About Us</a>
                <Link to='/Login'>Log In</Link>
              </div>
          </div>
          <div className="container">
              <div className="div1">
                  <img src={logo} alt=""/>
              </div>
              <div className="div2">
                  <div className="login">
                      <h2>Register</h2>
                      <form method='post' onSubmit={handleSubmit}>
                          <input 
                          
                          className="field" 
                          type="text" 
                          name="username" 
                          value = {formData.username}
                          placeholder="Enter your username here" 
                          onChange={(e) =>{
                          setUsername(e.target.value); 
                          handleChange(e);}}/>
                          {errors.username && (
                                <span className="error-message">{errors.username}</span>
                          )}

                          <input 
                          className="field" 
                          type="email" 
                          name="email" 
                          value = {formData.email}
                          placeholder="Enter your email here" 
                          onChange={(e) =>{
                          setEmail(e.target.value);handleChange(e)}}/>
                            {errors.email && (
                                <span className="error-message">{errors.email}</span>
                            )}

                          <input 
                          className="field" 
                          type="password" 
                          name="password" 
                          value = {formData.password}
                          placeholder="Enter your password here" 
                          onChange={(e) =>{
                          setPassword(e.target.value);handleChange(e)}}/>
                            {errors.password && (
                              <span className="error-message">{errors.password}</span>
                          
                          )}
                          <input 
                          className="field" 
                          type="password" 
                          value={formData.confirmPassword}
                          placeholder="Confirm password"
                          onChange={handleChange}/>
                          

                          <input className="button" type="submit" value="Sign Up"/>
                          
                      </form>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Signup