import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Components/Header';
import Sidebar from '../Components/Siderbar';
import api from '../api';
import '../Styles/Dashboard.css';

function ModernFriends() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        navigate('/Login');
        return;
      }
      try {
        const response = await api.get('/profile', { params: { user: userId } });
        setProfile(response.data?.response?.UserData || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load your friends.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate, userId]);

  const addFriend = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await api.post('/add-friend', { Friendemail: email.trim(), UserId: userId, UserName: profile.username, Email: profile.email });
      if (!response.data.success) throw new Error(response.data.message || 'Unable to add friend.');
      setMessage('Friend added successfully.');
      setEmail('');
      setModal(false);
      const profileResponse = await api.get('/profile', { params: { user: userId } });
      setProfile(profileResponse.data?.response?.UserData || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Unable to add friend.');
    } finally {
      setSaving(false);
    }
  };

  const friends = profile?.friends || [];

  return (
    <div className="app-shell">
      <Header OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle((isOpen) => !isOpen)} />
      <main className="main-container dashboard-page collection-page">
        <section className="page-heading"><div><p className="eyebrow">YOUR NETWORK</p><h1>Friends</h1><p className="page-subtitle">People you split plans and expenses with.</p></div><button className="primary-button" onClick={() => setModal(true)}>Add a friend</button></section>
        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert error-alert">{error}</div>}
        {loading ? <div className="loading-state">Loading your friends...</div> : friends.length ? <section className="friends-list">{friends.map((friend, index) => <article className="friend-row" key={friend._id || index}><span className="avatar">{friend.friend?.username?.slice(0, 1).toUpperCase() || '?'}</span><span><strong>{friend.friend?.username || friend.username || 'Friend'}</strong><small>{friend.friend?.email || friend.email || ''}</small></span></article>)}</section> : <div className="panel empty-collection"><h2>Your circle is empty</h2><p>Add a friend by email to start sharing expenses.</p><button className="primary-button" onClick={() => setModal(true)}>Add a friend</button></div>}
      </main>
      {modal && <div className="modal-backdrop" role="presentation"><form className="modal-surface" onSubmit={addFriend}><button type="button" className="modal-close" onClick={() => setModal(false)} aria-label="Close">X</button><p className="eyebrow">NEW CONNECTION</p><h2>Add a friend</h2><p className="modal-copy">Use the email address connected to their ExpenseTracker account.</p><label htmlFor="friend-email">Email address</label><input id="friend-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="friend@example.com" required autoFocus /><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add friend'}</button></form></div>}
    </div>
  );
}

export default ModernFriends;