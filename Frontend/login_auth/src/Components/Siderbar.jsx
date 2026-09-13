import { useEffect, useState } from 'react'
import { BsGrid1X2Fill, BsMoonStarsFill, BsSunFill, BsXLg } from 'react-icons/bs'
import PropTypes from 'prop-types';

import '../Styles/Sidebar.css'
import { FaUsers } from 'react-icons/fa';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Sidebar({openSidebarToggle, OpenSidebar}) {

    const navigate = useNavigate();
    
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        // Retrieve user session data from cookies
        const storedUsername = Cookies.get('username');
        const storedUserId = Cookies.get('userId');
    
        if (storedUsername && storedUserId) {
                    return;
        } else {
          // If no session data, redirect to login
          navigate('/login');
        }
      }, [navigate]);

        useEffect(() => {
            document.body.dataset.theme = darkMode ? 'dark' : 'light';
            localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        }, [darkMode]);

    const handleLogout=()=>{
        localStorage.removeItem('token');
                Cookies.remove('userId');
                Cookies.remove('username');
        navigate('/Login')
    }

        const closeSidebar = () => {
            if (openSidebarToggle) OpenSidebar();
        };


  return (
    <>
    <div className={openSidebarToggle ? 'sidebar-scrim visible' : 'sidebar-scrim'} onClick={closeSidebar} aria-hidden="true" />
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <span className='brand-mark'>E</span><h2 className='menu'>EXPENSETRACKER</h2>
            </div>
            <button className='sidebar-close' onClick={closeSidebar} aria-label="Close navigation"><BsXLg /></button>
        </div>

        <ul className='sidebar-list'>
            <li className="sidebar-list-item">
                        <Link to='/Home' className='btn' onClick={closeSidebar} >
                            <BsGrid1X2Fill className="icon"/> Dashboard
                        </Link>
                </li>

                <li className="sidebar-list-item">
                    <Link to='/Friends'  className='btn' onClick={closeSidebar}>
                         <FontAwesomeIcon icon={faHandshake} className="icon"/> Your Friends
                    </Link>
                </li>

                <li className="sidebar-list-item">
                    <Link to='/Groups' className='btn' onClick={closeSidebar} >
                         <FaUsers className="icon"/> Your Groups
                    </Link>
                </li>

                <li className="sidebar-list-item">
                    <button onClick={handleLogout} className='btn' >
                         <FaUsers className="icon"/> Logout
                    </button>
                </li>

                <li className="sidebar-list-item theme-item">
                    <button onClick={() => setDarkMode((isDark) => !isDark)} className='btn theme-toggle'>
                         {darkMode ? <BsSunFill className="icon" /> : <BsMoonStarsFill className="icon" />} {darkMode ? 'Light mode' : 'Dark mode'}
                    </button>
                </li>


        </ul>
    </aside>
    </>
  )
}

export default Sidebar

Sidebar.propTypes = {
    openSidebarToggle: PropTypes.bool,
    OpenSidebar: PropTypes.func.isRequired,
};