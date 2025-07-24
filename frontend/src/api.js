const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function searchJobs(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/jobs?${query}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function getJobDetails(jobId) {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch job details');
  return res.json();
} 