const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchJobs(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/jobs?${query}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('Invalid response from server');
  }
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}
