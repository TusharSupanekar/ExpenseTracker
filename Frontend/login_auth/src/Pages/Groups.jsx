import React from "react";
import Header from '../Components/Header'
import Sidebar from '../Components/Siderbar'
import GroupCard from "../Components/GroupCards";
import { useState,useEffect } from 'react'
import '../Styles/Dashboard.css'
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


 function Groups(){
        const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

        const OpenSidebar = () => {
            setOpenSidebarToggle(!openSidebarToggle)
        }

        const [modal, setModal] = useState(false);
        const toggleModal=()=>{
            setModal(!modal) 
        }



    const [username, setUsername] = useState(''); // Initialize username state
    const [userId, setUserId] = useState('');
    const [groups, setGroups] = useState([]);
    const [groupwiseAmounts, setGroupwiseAmounts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // Retrieve user session data from cookies
        const storedUsername = Cookies.get('username');
        const storedUserId = Cookies.get('userId');
        console.log("storedUserId:" + storedUserId)
        if (storedUsername && storedUserId) {
          // If data is found in cookies, use it
          setUsername(storedUsername);
          setUserId(storedUserId);

          const fetchGroups = async () => {
            try{
                console.log("Hello: " + userId);
                const response = await axios.post("http://localhost:3000/api/users/display-groups", {user: storedUserId});
                setGroups(response.data.response.UserGroups);
                console.log("response.data.groupwiseAmounts: " + JSON.stringify(response.data));
                setGroupwiseAmounts(response.data.response.groupwiseAmounts);
            }catch(e){
                console.log(e);
            }
          }
          fetchGroups();
          //console.log("UserGroups: " + JSON.stringify(groups));
        } else {
          // If no session data, redirect to login
          navigate('/login');
        }
      }, []);
    return(
            <div className="grid-container">
                <Header OpenSidebar={OpenSidebar}/>
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
                <main className='main-container'>
                
                    <div className='main-title'>
                        <h1 className="h1">Your Groups</h1>
                    </div>
                    <div className='main-cards'>
                        <div className='card-inner'>
                        <button 
                            onClick={toggleModal}
                            className='btn'>Create New Group</button>
                        </div>
                    </div>

                    {modal && (
                    <div className="modal">
                        <div className="overlay">
                            <div className="modal-content">
                                <h2>New Group</h2>
                                <input 
                                    className='input'
                                    type="text"
                                    placeholder="Enter Group Name"
                                />
                                <h4>Add Friends</h4>
                                <button 
                                    className='close-modal'
                                    onClick={toggleModal}> X </button>
                            </div> 
                        </div>
                    </div>
                    )}
                    <div className='main-title'>
                        <h1 className="h1">All Groups</h1>
                    </div>
                    <div className="cards-container">
                        {groups.map((group) => (
                            <GroupCard key={group._id} groupId={group._id} groupName={group.groupName} members={group.members} admin={group.admin} totalAmount={100 } groupwiseAmounts={groupwiseAmounts}/>
                        ))}
                    </div>
                </main>
            </div>
    )
 }

 export default Groups