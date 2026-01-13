const API_ROOT = import.meta.env.VITE_API_ROOT || 'https://attendence-7ofm.onrender.com';

const getToken = () => localStorage.getItem('token');

const request = async (path, opts = {}) => {
  const headers = opts.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_ROOT}${path}`, { ...opts, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Request error');
  return json;
};

export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const signup = (name, email, password) => request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
export const getMembers = () => request('/members');
export const addMember = (m) => request('/members', { method: 'POST', body: JSON.stringify(m) });
export const createMeeting = (m) => request('/meetings', { method: 'POST', body: JSON.stringify(m) });
export const getMeetings = () => request('/meetings');
export const markAttendance = (meetingId, memberId, status) => request(`/meetings/${meetingId}/attendance`, { method: 'PUT', body: JSON.stringify({ memberId, status }) });
export const getStats = () => request('/meetings/stats/summary');
export const exportStatsCSV = async () => {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_ROOT}/meetings/export/summary.csv`, { headers });
  const jsonOnError = async () => await res.json().catch(() => ({}));
  if (!res.ok) {
    const j = await jsonOnError();
    throw new Error(j.message || 'Export failed');
  }
  return await res.blob();
};
