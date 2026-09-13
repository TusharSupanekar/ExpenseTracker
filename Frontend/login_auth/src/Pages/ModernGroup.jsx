import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Components/Header';
import Sidebar from '../Components/Siderbar';
import api from '../api';
import '../Styles/Dashboard.css';
import '../Styles/Group.css';

function ModernGroup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { groupId, groupName, members = [] } = state || {};
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const userId = Cookies.get('userId');

  useEffect(() => {
    if (!groupId) {
      navigate('/Groups');
      return;
    }

    const loadGroup = async () => {
      try {
        const response = await api.get('/group', { params: { groupId } });
        const data = response.data?.response || {};
        setTransactions(data.groupTransactions || []);
        setCategories(data.categories || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this group.');
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId, navigate, modal]);

  const memberOptions = members.map((member) => ({ value: member._id, label: member.username }));
  const categoryOptions = categories.map((category) => ({ value: category._id, label: category.name }));

  const addTransaction = async (event) => {
    event.preventDefault();
    if (!description.trim() || Number(amount) <= 0 || !selectedMembers.length || !selectedCategory) {
      setError('Add a description, amount, category, and at least one member.');
      return;
    }

    setSaving(true);
    setError('');
    const splitAmount = Math.round((Number(amount) / selectedMembers.length) * 100) / 100;
    const memberAmounts = selectedMembers.reduce((result, memberId) => ({ ...result, [memberId]: splitAmount }), {});

    try {
      await api.post('/add-transaction', { description: description.trim(), category: selectedCategory.value, groupId, members: memberAmounts, amount: Number(amount), userId });
      setDescription('');
      setAmount('');
      setSelectedMembers([]);
      setSelectedCategory(null);
      setModal(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to record this transaction.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <Header OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <main className="main-container dashboard-page collection-page">
        <button className="back-link" onClick={() => navigate('/Groups')}>&lt;- Back to groups</button>
        <section className="page-heading group-heading"><div><p className="eyebrow">GROUP LEDGER</p><h1>{groupName || 'Group'}</h1><p className="page-subtitle">Every shared expense, in one place.</p></div><button className="primary-button" onClick={() => setModal(true)}>Record transaction</button></section>
        {error && <div className="alert error-alert">{error}</div>}
        {loading ? <div className="loading-state">Loading transactions...</div> : transactions.length ? <section className="transaction-list">{transactions.map((transaction) => { const paidBy = transaction.user?.username || 'Someone'; const isMine = transaction.user?._id === userId; return <article className="transaction-card" key={transaction._id}><div><span className="resource-kicker">{transaction.includedMembers?.length || 0} people included</span><h2>{transaction.description}</h2><p>{isMine ? 'You paid' : `${paidBy} paid`} <strong>${Number(transaction.amount || 0).toFixed(2)}</strong></p></div><span className="transaction-category">{transaction.category?.name || 'Shared expense'}</span></article>; })}</section> : <div className="panel empty-collection"><h2>No transactions yet</h2><p>Record the first shared expense for this group.</p><button className="primary-button" onClick={() => setModal(true)}>Record transaction</button></div>}
      </main>
      {modal && <div className="modal-backdrop" role="presentation"><form className="modal-surface transaction-modal" onSubmit={addTransaction}><button type="button" className="modal-close" onClick={() => setModal(false)} aria-label="Close">X</button><p className="eyebrow">NEW ENTRY</p><h2>Record transaction</h2><label htmlFor="description">Description</label><input id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Dinner, rent, tickets..." autoFocus /><label htmlFor="amount">Total amount</label><input id="amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /><label>Split between</label><Select isMulti options={memberOptions} value={memberOptions.filter((option) => selectedMembers.includes(option.value))} onChange={(options) => setSelectedMembers((options || []).map((option) => option.value))} placeholder="Choose members" /><label>Category</label><Select options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} placeholder="Choose a category" /><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save transaction'}</button></form></div>}
    </div>
  );
}

export default ModernGroup;