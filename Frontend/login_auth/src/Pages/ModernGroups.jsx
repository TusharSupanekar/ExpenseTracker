import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Components/Header';
import Sidebar from '../Components/Siderbar';
import api from '../api';
import '../Styles/Dashboard.css';

function ModernGroups() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState({});
  const [groupName, setGroupName] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    const loadGroups = async () => {
      if (!userId) {
        navigate('/Login');
        return;
      }
      try {
        const response = await api.post('/display-groups', { user: userId });
        const data = response.data?.response || {};
        setGroups(data.UserGroups || []);
        setBalances(data.groupwiseAmounts || {});
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load your groups.');
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, [navigate, userId]);

  const createGroup = async (event) => {
    event.preventDefault();
    if (!groupName.trim()) return;

    setSaving(true);
    setError('');
    try {
      await api.post('/create-group', { userId, groupName: groupName.trim() });
      setGroupName('');
      setModal(false);
      const response = await api.post('/display-groups', { user: userId });
      const data = response.data?.response || {};
      setGroups(data.UserGroups || []);
      setBalances(data.groupwiseAmounts || {});
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create this group.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <Header OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <main className="main-container dashboard-page collection-page">
        <section className="page-heading">
          <div><p className="eyebrow">SHARED SPENDING</p><h1>Your groups</h1><p className="page-subtitle">Keep shared expenses, people, and balances together.</p></div>
          <button className="primary-button" onClick={() => setModal(true)}>Create a group</button>
        </section>
        {error && <div className="alert error-alert">{error}</div>}
        {loading ? <div className="loading-state">Loading your groups...</div> : groups.length ? (
          <section className="collection-grid">
            {groups.map((group) => {
              const balance = Number(balances[group._id] || 0);
              return (
                <button className="resource-card" key={group._id} onClick={() => navigate('/Group', { state: { groupId: group._id, groupName: group.groupName, members: group.members } })}>
                  <span className="resource-kicker">{group.members?.length || 0} members</span>
                  <strong>{group.groupName}</strong>
                  <span className={balance < 0 ? 'balance negative' : 'balance'}>{balance < 0 ? `You owe $${Math.abs(balance).toFixed(2)}` : `You are owed $${balance.toFixed(2)}`}</span>
                  <span className="resource-link">Open group <span aria-hidden="true">-&gt;</span></span>
                </button>
              );
            })}
          </section>
        ) : <div className="panel empty-collection"><h2>No groups yet</h2><p>Create your first group to start tracking shared expenses.</p><button className="primary-button" onClick={() => setModal(true)}>Create a group</button></div>}
      </main>

      {modal && <div className="modal-backdrop" role="presentation"><form className="modal-surface" onSubmit={createGroup}><button type="button" className="modal-close" onClick={() => setModal(false)} aria-label="Close">X</button><p className="eyebrow">NEW SPACE</p><h2>Create a group</h2><p className="modal-copy">Start a shared ledger for a trip, home, or project.</p><label htmlFor="group-name">Group name</label><input id="group-name" value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="e.g. Lisbon weekend" autoFocus /><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create group'}</button></form></div>}
    </div>
  );
}

export default ModernGroups;