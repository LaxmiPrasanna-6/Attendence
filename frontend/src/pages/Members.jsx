import React, { useEffect, useState, useMemo } from 'react'
import { getMembers, addMember, getStats } from '../api'

export default function Members(){
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sortDir, setSortDir] = useState('asc'); // asc | desc

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{ try{ const res = await getStats(); setMembers(res.members || []); }catch(e){ setErr(e.message)} };

  const submit = async e => { e.preventDefault(); setErr(''); try{ await addMember({ name, domain, email }); setName(''); setDomain(''); setEmail(''); load(); }catch(e){ setErr(e.message)} };

  const sorted = useMemo(() => {
    const copy = [...members];
    copy.sort((a,b) => {
      const da = (a.domain || '').toLowerCase();
      const db = (b.domain || '').toLowerCase();
      if (da === db) return 0;
      return sortDir === 'asc' ? (da < db ? -1 : 1) : (da > db ? -1 : 1);
    });
    return copy;
  }, [members, sortDir]);

  return (
    <section className="members">
      <div className="section-head"><h2>Team Members</h2>
        <div>
          <label style={{marginRight:8}} className="muted">Sort by domain:</label>
          <button className={sortDir === 'asc' ? 'active' : ''} onClick={()=>setSortDir('asc')}>A → Z</button>
          <button className={sortDir === 'desc' ? 'active' : ''} onClick={()=>setSortDir('desc')}>Z → A</button>
        </div>
      </div>
      {err && <div className="error">{err}</div>}

      <div className="panel">
        <h3>Add New Member</h3>
        <form onSubmit={submit} className="member-form">
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="Domain" value={domain} onChange={e=>setDomain(e.target.value)} required />
          <input placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
          <button type="submit" className="primary">Add Member</button>
        </form>
      </div>

      <div className="panel">
        <table className="members-table">
          <thead>
            <tr>
              <th style={{textAlign:'left'}}>Name</th>
              <th style={{textAlign:'left'}}>Domain</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(m => (
              <tr key={m.memberId}>
                <td style={{textAlign:'left'}}>{m.name}</td>
                <td style={{textAlign:'left'}}>{m.domain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
