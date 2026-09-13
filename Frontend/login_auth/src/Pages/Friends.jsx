import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Siderbar';
import { useNavigate } from 'react-router-dom';
import '../Styles/PopWindow.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../Styles/Friend_Table.css';

function Friends() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [friend, setFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [UserId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleAddFriend = async () => {
    setMessage('');
    setFriend(null);

    if (!email) {
      setMessage('Please enter an email');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/users/add-friend', {
        Friendemail: email, // Email entered by the user
        UserId: UserId,     // Logged-in user's ID
      });

      if (res.data.success) {
        setFriend(res.data.user);
        setMessage('Friend Added Successfully!');
        setEmail(''); // Clear email input after successful friend addition
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error('Error adding friend:', error.response?.data || error.message);
      setMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserProfileAndFriends = async (userId) => {
      try {
        // Fetch the user profile
        const userProfileResponse = await axios.get('http://localhost:3000/api/users/profile', {
          params: { user: userId },
        });
  
        const userProfileData = userProfileResponse.data?.response?.UserData;
  
        if (!userProfileData) {
          console.error('No valid UserData returned from profile API');
          setUserData(null);
          setFriends([]);
          return;
        }
  
        // Extract populated friends
        const friendsData = userProfileData.friends || [];
  
        console.log('Friends Data:', friendsData); // Check if friends data is populated
  
        setUserData(userProfileData);
        setFriends(friendsData); // Set friends to display
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile or friends:', error);
        setLoading(false);
        setUserData(null);
        setFriends([]);
      }
    };
  
    if (UserId) {
      fetchUserProfileAndFriends(UserId);
    }
  }, [UserId]);                                  
  
  useEffect(() => {
    const storedUsername = Cookies.get('username');
    const storedUserId = Cookies.get('userId');

    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      setUserId(storedUserId);
    } else {
      navigate('/login');
    }
  }, [navigate]);



  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container">
        <div className="main-title">
          <h1 className="h1">Friends</h1>
        </div>

        <div className="main-cards">
          <div className="card-inner">
            <button onClick={toggleModal} className="btn">
              Add New Friend
            </button>
          </div>
        </div>

        {modal && (
          <div className="modal">
            <div className="overlay">
              <div className="modal-content">
                <h2>Enter Your Friend's Email</h2>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Friend's Email"
                />
                <button onClick={handleAddFriend} type="submit" className="friend-btn">
                  Add Friend
                </button>
                <button className="close-modal" onClick={toggleModal}>
                  {' '}
                  X{' '}
                </button>
                {message && <p>{message}</p>} {/* Display the message */}
              </div>
            </div>
          </div>
        )}

        <div className="main-title">
          <h1 className="h1">Friends List</h1>
          <div className="main-cards-1">
          {friends.length > 0 ? (
      <div className="friends-table">
        <div className="friends-header">
          <span className="column-title">Name</span>
          <span className="column-title">Email</span>
        </div>
        {friends.map((friend, index) => (
          <div className="card-row" key={index}>
            <span className="friend-name">{friend.username}</span>
            <span className="friend-email">{friend.email}</span>
          </div>
        ))}
      </div>
    ) : (
      <p>No friends to display</p>
    )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Friends;
