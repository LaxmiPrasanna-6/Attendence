import React, { useState } from 'react'
import { login, signup } from '../api'

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (isSignup) {
        const res = await signup(name, email, password);
        onLogin(res.user, res.token);
      } else {
        const res = await login(email, password);
        onLogin(res.user, res.token);
      }
    } catch (err) { setErr(err.message || 'Request failed'); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <h2>{isSignup ? 'Create manager account' : 'Welcome back'}</h2>
          <p className="muted">Sign in to manage meetings and members.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          {isSignup && (
            <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          <div className="form-actions">
            <button type="submit" className="primary">{isSignup ? 'Create account' : 'Login'}</button>
            <button type="button" className="ghost" onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Have an account? Login' : 'Create manager account'}</button>
          </div>

          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
