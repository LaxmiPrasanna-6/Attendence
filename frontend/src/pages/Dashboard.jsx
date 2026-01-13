import React, { useState, useEffect } from 'react'
import { getStats } from '../api'

const colorFor = (pct) => (pct >= 75 ? '#d4f5dd' : pct >= 50 ? '#fff7d6' : '#fde6e6');
const badgeColor = (pct) => (pct >= 75 ? 'green' : pct >= 50 ? 'goldenrod' : 'crimson');

export default function Dashboard(){
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');
  const [sortField, setSortField] = useState('name'); // name | presents | percentage
  const [sortDir, setSortDir] = useState('desc');

  useEffect(()=>{ load(); }, []);

  const load = async ()=>{
    try{ const res = await getStats(); setStats(res); }catch(e){ setErr(e.message); }
  };

  return (
    <section className="dashboard">
      <div className="section-head">
        <h2>Attendance Stats</h2>
        <div className="muted">Total meetings: {stats ? stats.totalMeetings : 0}</div>
      </div>

      <div className="cta-row">
        <button onClick={() => window.dispatchEvent(new CustomEvent('setTab', { detail: 'members' }))}>Add / View Members</button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('setTab', { detail: 'meetings' }))}>Create / Manage Meetings</button>
      </div>

      {err && <div className="error">{err}</div>}
      {!stats && <div>Loading...</div>}

      {stats && (
        <div className="panel">
          <table className="members-table">
            <thead>
              <tr>
                <th style={{textAlign:'left', cursor:'pointer'}} onClick={() => { setSortField('name'); setSortDir(sortField === 'name' && sortDir === 'asc' ? 'desc' : 'asc'); }}>Name</th>
                <th style={{textAlign:'left'}}>Domain</th>
                <th style={{textAlign:'center', cursor:'pointer'}} onClick={() => { setSortField('presents'); setSortDir(sortField === 'presents' && sortDir === 'asc' ? 'desc' : 'asc'); }}>Present</th>
                <th style={{textAlign:'center'}}>Absent</th>
                <th style={{textAlign:'center', cursor:'pointer'}} onClick={() => { setSortField('percentage'); setSortDir(sortField === 'percentage' && sortDir === 'asc' ? 'desc' : 'asc'); }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stats.members
                .slice()
                .sort((a,b) => {
                  let av = a[sortField];
                  let bv = b[sortField];
                  if (sortField === 'name' || sortField === 'domain') { av = (av || '').toString().toLowerCase(); bv = (bv || '').toString().toLowerCase(); }
                  av = av == null ? -Infinity : av; bv = bv == null ? -Infinity : bv;
                  if (av === bv) return 0;
                  return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
                })
                .map(m => (
                  <tr key={m.memberId}>
                    <td style={{textAlign:'left'}}>{m.name}</td>
                    <td style={{textAlign:'left'}}>{m.domain}</td>
                    <td style={{textAlign:'center'}}>{m.presents}</td>
                    <td style={{textAlign:'center'}}>{m.absents}</td>
                    <td style={{textAlign:'center'}}><span className="badge">{m.percentage}%</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
