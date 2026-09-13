import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css';
import { Pie, Bar } from 'react-chartjs-2';
import Header from '../Components/Header';
import Sidebar from '../Components/Siderbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ResponsiveContainer } from 'recharts';

function Home() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [chartData, setChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [modal, setModal] = useState(false);
  const [category, setCategory] = useState('Food');
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Register ChartJS components
  ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get('http://localhost:3000/api/users/profile', {
        params: { user: userId },
      });

      console.log('Full API Response:', response);

      const { response: resData } = response.data;

      if (resData && resData.UserData && resData.UserData._id) {
        const { TopCategories, MonthwiseTransactions } = resData;

        // Handle Pie Chart Data (Top Categories)
        if (Array.isArray(TopCategories) && TopCategories.length > 0) {
          const labels = TopCategories.map((category) => category.categoryName);
          const values = TopCategories.map((category) => category.totalAmount);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Expenses by Top Categories',
                data: values,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
          });
        } else {
          console.warn('No TopCategories data found');
        }

        // Handle Bar Chart Data (Monthly Transactions)
        if (MonthwiseTransactions) {
          const barLabels = Object.keys(MonthwiseTransactions); // ['Jan', 'Feb', 'Mar', ...]
          const barValues = Object.values(MonthwiseTransactions); // [100, 200, 150, ...]

          setBarChartData({
            labels: barLabels,
            datasets: [
              {
                label: 'Monthly Transactions',
                data: barValues,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
      } else {
        console.error('No valid user data returned from the API');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    const storedUserId = Cookies.get('userId');
    console.log(storedUserId);

    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      fetchUserProfile(storedUserId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Transactions Overview' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
    },
  };

  // Chart options for responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container">
        <div className="main-title">
          <h1 className="h1">DASHBOARD</h1>
        </div>
        <div className="main-cards">
          <div className="card-inner">
            <button onClick={toggleModal} className="btn">
              + Add Expense
            </button>
          </div>
        </div>

        {modal && (
          <div className="overlay">
            <div className="modal">
              <div className="modal-content">
                <button className="close-modal" onClick={toggleModal}>
                  X
                </button>
                <h2>New Expense</h2>
                <select
                  className="category-dropdown"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Rent">Rent</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
                <input
                  className="input"
                  type="number"
                  placeholder="Enter Amount"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="friend-btn">
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="card">
          <div className="card-inner">
            <h3>Monthly Budget</h3>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Total Expense</h3>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Total Savings</h3>
          </div>
        </div>

        <div className="main-title">
          <h1 className="h1">Graphical Insights</h1>
        </div>

        <div className="charts">
          <ResponsiveContainer width="80%" height={400}>
            <h3 className='h3'>Expenses by Category</h3>
            {chartData.labels && chartData.datasets ? (
              <Pie
                data={chartData}
                options={chartOptions}
              />
            ) : (
              <p>Loading...</p>
            )}
          </ResponsiveContainer>
          <ResponsiveContainer width="80%" height={450}>
          <h3 className='h3'>Monthly Transactions Overview</h3>

            {barChartData.labels && barChartData.datasets ? (
              <Bar
                data={barChartData}
                options={barChartOptions}
              />
            ) : (
              <p>Loading...</p>
            )}
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
}

export default Home;
