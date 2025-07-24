import React, { useState } from 'react';
import { fetchJobs } from './api'; // Make sure this function exists

function App() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!keywords.trim() || !location.trim()) {
      setError('Please enter both keywords and a location.');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedJob(null);

    try {
      const data = await fetchJobs({ keywords, location });
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-blue-900 to-blue-950 py-10 px-2 md:px-0 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header and search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            Job Finder
          </h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center">
            <input
              type="text"
              placeholder="Keywords (e.g. Data Analyst)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="border border-blue-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 font-sans bg-black/80 text-white placeholder-blue-300 shadow"
            />
            <input
              type="text"
              placeholder="Location (e.g. Mumbai)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-blue-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 font-sans bg-black/80 text-white placeholder-blue-300 shadow"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-2 rounded-lg font-bold hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50 font-sans shadow"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="text-red-400 mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Job List */}
          <div className="col-span-1 rounded-2xl p-6 bg-black/60 backdrop-blur-md border border-blue-900 shadow-xl h-[75vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 font-sans tracking-tight text-blue-200">
              Jobs
            </h2>
            <ul className="space-y-4">
              {jobs.map((job, idx) => (
                <li key={job.link || idx}>
                  <button
                    onClick={() => handleJobClick(job)}
                    className={`w-full text-left p-5 rounded-xl border transition shadow-md focus:outline-none font-sans ${selectedJob === job
                      ? 'bg-gradient-to-r from-blue-800 to-blue-900 border-blue-400 text-blue-100'
                      : 'bg-black/70 border-blue-900 text-white hover:border-blue-400 hover:shadow-xl'}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-blue-300 truncate">{job.title}</span>
                      <span className="text-base font-semibold text-blue-200">{job.company}</span>
                      <span className="text-sm font-medium text-blue-400">{job.location}</span>
                    </div>
                  </button>
                </li>
              ))}
              {jobs.length === 0 && !loading && (
                <li className="text-blue-400">No jobs found. Try searching above.</li>
              )}
            </ul>
          </div>

          {/* Job Details */}
          <div className="col-span-1 md:col-span-2 h-[75vh] overflow-y-auto rounded-2xl p-8 border border-blue-900 shadow-xl bg-black/70 backdrop-blur-md font-sans">
            {selectedJob ? (
              <>
                <h2 className="text-2xl font-bold text-blue-200 mb-2">{selectedJob.title}</h2>
                <div className="mb-2">
                  <span className="font-semibold text-blue-400">Company:</span> {selectedJob.company}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-400">Location:</span> {selectedJob.location}
                </div>
                {selectedJob.description && (
                  <div className="mb-4">
                    <span className="font-semibold text-blue-400">Description:</span>
                    <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-blue-100">
                      {selectedJob.description}
                    </div>
                  </div>
                )}
                <a
                  href={selectedJob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition font-sans font-bold text-lg shadow"
                >
                  View & Apply
                </a>
              </>
            ) : (
              <div className="text-blue-400 text-center mt-10 font-sans">Select a job to see details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
