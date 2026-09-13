import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Components/Header';
import Sidebar from '../Components/Siderbar';
import api from '../api';
import '../Styles/Dashboard.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const chartColors = ['#0f766e', '#f59e0b', '#2563eb', '#e11d48', '#7c3aed', '#0891b2'];
const emptyMonths = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };

function ModernHome() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (!userId) {
      navigate('/Login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await api.get('/profile', { params: { user: userId } });
        setProfile(response.data?.response || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load your spending overview.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const topCategories = profile?.TopCategories || [];
  const months = { ...emptyMonths, ...(profile?.MonthwiseTransactions || {}) };
  const totalSpent = topCategories.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const activeMonths = Object.values(months).filter((amount) => Number(amount) > 0).length;
  const categoryData = {
    labels: topCategories.map((item) => item.categoryName),
    datasets: [{ data: topCategories.map((item) => item.totalAmount), backgroundColor: chartColors, borderColor: '#ffffff', borderWidth: 4, hoverOffset: 8 }],
  };
  const monthlyData = {
    labels: Object.keys(months),
    datasets: [{ label: 'Spent', data: Object.values(months), backgroundColor: '#0f766e', borderRadius: 6, maxBarThickness: 28 }],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } },
      tooltip: { callbacks: { label: (context) => ` $${Number(context.raw).toFixed(2)}` } },
    },
  };
  const barOptions = {
    ...chartOptions,
    plugins: { legend: { display: false }, tooltip: chartOptions.plugins.tooltip },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { callback: (value) => `$${value}` } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="app-shell">
      <Header OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <main className="main-container dashboard-page">
        <section className="page-heading">
          <div><p className="eyebrow">PERSONAL OVERVIEW</p><h1>Dashboard</h1><p className="page-subtitle">A clear view of where your shared expenses are going.</p></div>
          <button className="primary-button" onClick={() => navigate('/Groups')}>Record in a group</button>
        </section>
        {error && <div className="alert error-alert">{error}</div>}
        {loading ? <div className="loading-state">Loading your overview...</div> : (
          <>
            <section className="summary-grid">
              <article className="summary-card accent-card"><span className="summary-label">Tracked categories</span><strong>{topCategories.length}</strong><span className="summary-meta">Top spending categories</span></article>
              <article className="summary-card"><span className="summary-label">Top category spend</span><strong>${totalSpent.toFixed(2)}</strong><span className="summary-meta">Across the categories shown</span></article>
              <article className="summary-card"><span className="summary-label">Active months</span><strong>{activeMonths}</strong><span className="summary-meta">Months with recorded activity</span></article>
            </section>
            <section className="chart-grid">
              <article className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">BREAKDOWN</p><h2>Top categories</h2></div></div><div className="chart-wrap doughnut-wrap">{topCategories.length ? <Doughnut data={categoryData} options={chartOptions} /> : <p className="empty-state">Add a group expense to see category data here.</p>}</div></article>
              <article className="panel chart-panel wide-panel"><div className="panel-heading"><div><p className="eyebrow">TREND</p><h2>Monthly spending</h2></div></div><div className="chart-wrap"><Bar data={monthlyData} options={barOptions} /></div></article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ModernHome;