import React, { useState } from 'react';
import { searchJobs, getJobDetails } from './api';

function App() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelectedJob(null);
    setJobDetails(null);
    try {
      const data = await searchJobs({ keywords, locationName: location });
      setJobs(data?.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (job) => {
    setSelectedJob(job.jobId);
    setJobDetails(null);
    setLoading(true);
    setError('');
    try {
      const details = await getJobDetails(job.jobId);
      setJobDetails(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={
      `${darkMode ? 'bg-black' : 'bg-white'} min-h-screen py-8 px-2 md:px-0 transition-colors duration-300`
    }>
      <div className={`max-w-5xl mx-auto rounded-lg shadow-lg p-6 ${darkMode ? 'bg-dark text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-0 font-sans">Job Finder</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded font-semibold border transition-colors duration-200 ${darkMode ? 'bg-white text-black border-gray-300 hover:bg-primary hover:text-white' : 'bg-black text-white border-gray-800 hover:bg-primary hover:text-white'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className={`border rounded px-4 py-2 focus:outline-none focus:ring-2 w-full md:w-1/3 font-sans ${darkMode ? 'bg-black text-white border-gray-700 focus:ring-primary' : 'bg-white text-black border-gray-300 focus:ring-primary'}`}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className={`border rounded px-4 py-2 focus:outline-none focus:ring-2 w-full md:w-1/3 font-sans ${darkMode ? 'bg-black text-white border-gray-700 focus:ring-primary' : 'bg-white text-black border-gray-300 focus:ring-primary'}`}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition disabled:opacity-50 font-sans"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <div className="text-primary mb-4 text-center">{error}</div>}
        <div className="flex flex-col md:flex-row gap-8">
          <div className={`md:w-1/2 rounded-lg p-4 ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-gray-100 border border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 font-sans ${darkMode ? 'text-white' : 'text-black'}`}>Jobs</h2>
            <ul className="space-y-3">
              {jobs.map(job => (
                <li key={job.jobId}>
                  <button
                    onClick={() => handleJobClick(job)}
                    className={`w-full text-left p-4 rounded border transition shadow-sm hover:shadow-md focus:outline-none focus:ring-2 font-sans ${selectedJob === job.jobId
                      ? 'bg-primary/10 border-primary text-primary'
                      : darkMode
                        ? 'bg-zinc-900 border-zinc-700 text-white hover:border-primary'
                        : 'bg-white border-gray-200 text-black hover:border-primary'}`}
                  >
                    <div className="font-bold text-primary">{job.jobTitle}</div>
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{job.employerName} - {job.locationName}</div>
                  </button>
                </li>
              ))}
              {jobs.length === 0 && !loading && (
                <li className="text-gray-400">No jobs found. Try searching above.</li>
              )}
            </ul>
          </div>
          <div className="md:w-1/2">
            {jobDetails && (
              <div className={`rounded-lg p-6 border shadow font-sans ${darkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'}`}>
                <h2 className="text-2xl font-bold text-primary mb-2 font-sans">{jobDetails.jobTitle}</h2>
                <p className="mb-1"><span className="font-semibold text-primary">Employer:</span> {jobDetails.employerName}</p>
                <p className="mb-1"><span className="font-semibold text-primary">Location:</span> {jobDetails.locationName}</p>
                <p className="mb-1"><span className="font-semibold text-primary">Salary:</span> {jobDetails.minimumSalary} - {jobDetails.maximumSalary} {jobDetails.currency} ({jobDetails.salaryType})</p>
                <p className="mb-1"><span className="font-semibold text-primary">Type:</span> {jobDetails.contractType} / {jobDetails.jobType}</p>
                <div className="my-4">
                  <span className="font-semibold text-primary">Description:</span>
                  <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''} font-sans`} dangerouslySetInnerHTML={{ __html: jobDetails.jobDescription }} />
                </div>
                <a
                  href={jobDetails.externalUrl || jobDetails.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition font-sans"
                >
                  Apply / View on Reed
                </a>
              </div>
            )}
            {!jobDetails && (
              <div className="text-gray-400 text-center mt-10 font-sans">Select a job to see details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
