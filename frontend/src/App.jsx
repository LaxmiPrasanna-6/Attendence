import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Meetings from './pages/Meetings'

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) setUser(JSON.parse(raw));
    const onSetTab = (e) => { if (e && e.detail) setTab(e.detail); };
    window.addEventListener('setTab', onSetTab);
    return () => window.removeEventListener('setTab', onSetTab);
  }, []);

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };

  if (!user) return <Login onLogin={(u, token) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(u)); setUser(u); }} />;

  return (
    <div className="app">
      <header>
        <div className="brand">
          <h1>Attendance</h1>
          <small>Manager Console</small>
        </div>
        <div className="user">
          <strong>{user.name}</strong>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>Stats</button>
        <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>Members</button>
        <button className={tab === 'meetings' ? 'active' : ''} onClick={() => setTab('meetings')}>Meetings</button>
      </nav>

      <main>
        {tab === 'stats' && <Dashboard />}
        {tab === 'members' && <Members />}
        {tab === 'meetings' && <Meetings />}
      </main>
    </div>
  );
}
