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
  const [ledger, setLedger] = useState({ totalOwed: 0, totalLent: 0, netBalance: 0, balances: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expenseModal, setExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: '' });
  const [savingExpense, setSavingExpense] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(() => Number(localStorage.getItem('monthlyBudget') || 1000));
  const [budgetInput, setBudgetInput] = useState(() => String(Number(localStorage.getItem('monthlyBudget') || 1000)));
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (!userId) {
      navigate('/Login');
      return;
    }

    const loadProfile = async () => {
      try {
        const [profileResponse, ledgerResponse, categoryResponse] = await Promise.all([
          api.get('/profile', { params: { user: userId } }),
          api.get('/ledger-summary', { params: { user: userId } }),
          api.get('/categories'),
        ]);
        setProfile(profileResponse.data?.response || null);
        setLedger(ledgerResponse.data || { totalOwed: 0, totalLent: 0, netBalance: 0, balances: [] });
        setCategories(categoryResponse.data?.categories || []);
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
  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date());
  const currentSpent = Number(months[currentMonth] || 0);
  const remainingBudget = Math.max(monthlyBudget - currentSpent, 0);
  const budgetPercent = monthlyBudget > 0 ? Math.min((currentSpent / monthlyBudget) * 100, 100) : 0;
  const categoryData = {
    labels: topCategories.map((item) => item.categoryName),
    datasets: [{ data: topCategories.map((item) => item.totalAmount), backgroundColor: chartColors, borderColor: '#ffffff', borderWidth: 4, hoverOffset: 8 }],
  };
  const monthlyData = {
    labels: Object.keys(months),
    datasets: [{ label: 'Spent', data: Object.values(months), backgroundColor: '#0f766e', borderRadius: 6, maxBarThickness: 28 }],
  };
  const budgetData = {
    labels: ['Spent', 'Remaining'],
    datasets: [{ data: [currentSpent, remainingBudget], backgroundColor: ['#f59e0b', '#dcebe7'], borderWidth: 0, hoverOffset: 0 }],
  };
  const moneyFlowData = {
    labels: ['Owed to you', 'You owe'],
    datasets: [{
      label: 'Amount',
      data: [Number(ledger.totalLent || 0), Number(ledger.totalOwed || 0)],
      backgroundColor: ['#0f766e', '#e11d48'],
      borderRadius: 7,
      barThickness: 30,
    }],
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
  const budgetOptions = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: '78%',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` $${Number(context.raw).toFixed(2)}` } } },
  };
  const moneyFlowOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => ` $${Number(context.raw).toFixed(2)}` } },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { callback: (value) => `$${value}` } },
      y: { grid: { display: false } },
    },
  };

  const saveBudget = (event) => {
    event.preventDefault();
    const nextBudget = Number(budgetInput);
    if (nextBudget > 0) {
      setMonthlyBudget(nextBudget);
      localStorage.setItem('monthlyBudget', String(nextBudget));
    }
  };

  const addPersonalExpense = async (event) => {
    event.preventDefault();
    setSavingExpense(true);
    setError('');
    try {
      await api.post('/add-expense', {
        userId: Cookies.get('userId'),
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
      });
      setExpenseForm({ description: '', amount: '', category: '' });
      setExpenseModal(false);
      setError('Personal expense added. Refresh the dashboard to update charts.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to add this personal expense.');
    } finally {
      setSavingExpense(false);
    }
  };

  return (
    <div className="app-shell">
      <Header OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <main className="main-container dashboard-page">
        <section className="page-heading">
          <div><p className="eyebrow">PERSONAL OVERVIEW</p><h1>Dashboard</h1><p className="page-subtitle">A clear view of where your shared expenses are going.</p></div>
          <div className="heading-actions"><button className="secondary-button" onClick={() => setExpenseModal(true)}>Add personal expense</button><button className="primary-button" onClick={() => navigate('/Groups')}>Record in a group</button></div>
        </section>
        {error && <div className="alert error-alert">{error}</div>}
        {loading ? <div className="loading-state">Loading your overview...</div> : (
          <>
            <section className="summary-grid">
              <article className="summary-card accent-card"><span className="summary-label">Tracked categories</span><strong>{topCategories.length}</strong><span className="summary-meta">Top spending categories</span></article>
              <article className="summary-card"><span className="summary-label">Top category spend</span><strong>${totalSpent.toFixed(2)}</strong><span className="summary-meta">Across the categories shown</span></article>
              <article className="summary-card"><span className="summary-label">Remaining this month</span><strong>${remainingBudget.toFixed(2)}</strong><span className="summary-meta">From a ${monthlyBudget.toFixed(2)} budget</span></article>
            </section>
            <section className="ledger-grid">
              <article className="ledger-card owed-card"><span className="summary-label">You owe across groups</span><strong>${Number(ledger.totalOwed || 0).toFixed(2)}</strong><span className="summary-meta">Money you need to settle</span></article>
              <article className="ledger-card lent-card"><span className="summary-label">Owed to you</span><strong>${Number(ledger.totalLent || 0).toFixed(2)}</strong><span className="summary-meta">Money others need to return</span></article>
              <article className="ledger-card"><span className="summary-label">Net group balance</span><strong>{Number(ledger.netBalance || 0) >= 0 ? '+' : '-'}${Math.abs(Number(ledger.netBalance || 0)).toFixed(2)}</strong><span className="summary-meta">Your lending minus what you owe</span></article>
            </section>
            <section className="panel people-panel"><div className="panel-heading"><div><p className="eyebrow">WHO OWES WHO</p><h2>People balances</h2></div></div>{ledger.balances?.length ? <div className="people-list">{ledger.balances.map((balance) => <div className="person-balance" key={balance.user._id}><span className="avatar">{balance.user.username?.slice(0, 1).toUpperCase()}</span><span><strong>{balance.user.username}</strong><small>{balance.direction === 'owed-to-you' ? `owes you $${Number(balance.amount).toFixed(2)}` : `you owe $${Number(balance.amount).toFixed(2)}`}</small></span><span className={balance.direction === 'owed-to-you' ? 'balance' : 'balance negative'}>{balance.direction === 'owed-to-you' ? 'Owed to you' : 'You owe'}</span></div>)}</div> : <p className="empty-inline">No outstanding person-to-person balances.</p>}</section>
            <section className="chart-grid">
              <article className="panel chart-panel budget-panel"><div className="panel-heading"><div><p className="eyebrow">MONTHLY PLAN</p><h2>Budget health</h2></div><form className="budget-form" onSubmit={saveBudget}><span>$</span><input aria-label="Monthly budget" type="number" min="1" step="1" value={budgetInput} onChange={(event) => setBudgetInput(event.target.value)} /><button type="submit">Set</button></form></div><div className="budget-gauge"><Doughnut data={budgetData} options={budgetOptions} /><div className="gauge-label"><strong>${currentSpent.toFixed(0)}</strong><span>of ${monthlyBudget.toFixed(0)} spent</span></div></div><div className="budget-footer"><span><i className="spent-dot" />{budgetPercent.toFixed(0)}% used</span><strong>${remainingBudget.toFixed(2)} left</strong></div></article>
              <article className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">BREAKDOWN</p><h2>Top categories</h2></div></div><div className="chart-wrap doughnut-wrap">{topCategories.length ? <Doughnut data={categoryData} options={chartOptions} /> : <p className="empty-state">Add a group expense to see category data here.</p>}</div></article>
              <article className="panel chart-panel wide-panel"><div className="panel-heading"><div><p className="eyebrow">TREND</p><h2>Monthly spending</h2></div></div><div className="chart-wrap"><Bar data={monthlyData} options={barOptions} /></div></article>
              <article className="panel chart-panel wide-panel"><div className="panel-heading"><div><p className="eyebrow">GROUP POSITION</p><h2>Money flow</h2></div></div><div className="chart-wrap money-flow-wrap"><Bar data={moneyFlowData} options={moneyFlowOptions} /></div></article>
            </section>
          </>
        )}
      </main>
      {expenseModal && <div className="modal-backdrop" role="presentation"><form className="modal-surface" onSubmit={addPersonalExpense}><button type="button" className="modal-close" onClick={() => setExpenseModal(false)} aria-label="Close">X</button><p className="eyebrow">PERSONAL SPENDING</p><h2>Add expense</h2><p className="modal-copy">Track something you paid for yourself, outside a group.</p><label htmlFor="personal-description">Description</label><input id="personal-description" value={expenseForm.description} onChange={(event) => setExpenseForm({ ...expenseForm, description: event.target.value })} placeholder="Coffee, groceries, train..." required autoFocus /><label htmlFor="personal-amount">Amount</label><input id="personal-amount" type="number" min="0.01" step="0.01" value={expenseForm.amount} onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })} placeholder="0.00" required /><label htmlFor="personal-category">Category</label><select id="personal-category" value={expenseForm.category} onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })} required><option value="">Choose a category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select><button className="primary-button" type="submit" disabled={savingExpense}>{savingExpense ? 'Saving...' : 'Save expense'}</button></form></div>}
    </div>
  );
}

export default ModernHome;