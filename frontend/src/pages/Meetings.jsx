import React, { useEffect, useState } from 'react'
import { createMeeting, getMeetings, markAttendance, exportStatsCSV } from '../api'

export default function Meetings(){
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [err, setErr] = useState('');

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{ try{ setMeetings(await getMeetings()); }catch(e){ setErr(e.message) } };

  const submit = async (e)=>{ e.preventDefault(); setErr(''); try{ await createMeeting({ title, venue, date }); setTitle(''); setVenue(''); setDate(''); load(); }catch(e){ setErr(e.message) } };

  const toggle = async (meetingId, memberId, current) => {
    try{ await markAttendance(meetingId, memberId, current === 'present' ? 'absent' : 'present'); load(); }catch(e){ setErr(e.message) }
  };

  const downloadSummary = async () => {
    setErr('');
    try {
      const blob = await exportStatsCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-summary-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e.message) }
  };

  return (
    <section className="meetings">
      <div className="section-head"><h2>Meetings</h2></div>
      <div className="section-actions"><button onClick={downloadSummary} className="secondary">Download Summary (Excel)</button></div>
      {err && <div className="error">{err}</div>}

      <div className="panel">
        <h3>Create New Meeting</h3>
        <form onSubmit={submit} className="meeting-form">
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <input placeholder="Venue" value={venue} onChange={e=>setVenue(e.target.value)} />
          <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required />
          <button type="submit" className="primary">Create Meeting</button>
        </form>
      </div>

      <div className="meet-list">
        {meetings.length === 0 && <div className="muted">No meetings yet. Create one above.</div>}
        {meetings.map(meet => (
          <div key={meet._id} className="meeting-card">
            <div className="card-head">
              <h3>{meet.title}</h3>
              <div className="muted">{new Date(meet.date).toLocaleString()}</div>
            </div>
            <div className="venue">Venue: {meet.venue}</div>
            <table>
              <thead><tr><th>Name</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {(meet.attendees || []).map((a, idx) => {
                  const member = a && a.member;
                  const memberId = member && (member._id || member) ? (member._id || member) : `unknown-${idx}`;
                  const memberName = member && member.name ? member.name : (typeof member === 'string' ? member : 'Unknown');
                  return (
                    <tr key={memberId}>
                      <td>{memberName}</td>
                      <td>{a.status}</td>
                      <td><button onClick={()=>toggle(meet._id, memberId, a.status)} className="small">Mark {a.status === 'present' ? 'Absent' : 'Present'}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
