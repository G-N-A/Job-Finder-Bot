import sys
import subprocess
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def normalize_job_data(jobs_raw):
    cleaned_jobs = []
    for job in jobs_raw:
        title = job.get('title') or 'N/A'
        company = job.get('company') or 'N/A'
        location = job.get('location') or 'N/A'
        description = job.get('description') or 'No description provided.'
        link = job.get('link') or '#'

        # Optional: skip entries with no company and link
        if company == 'N/A' and link == '#':
            continue

        cleaned_jobs.append({
            'title': title.strip(),
            'company': company.strip(),
            'location': location.strip(),
            'description': description.strip(),
            'link': link.strip()
        })
    return cleaned_jobs

@app.route('/api/jobs', methods=['GET'])
def combined_jobs():
    keywords = request.args.get('keywords', 'data-analyst')
    location = request.args.get('location', 'india')
    print("Flask is calling scraper with:", keywords, location)

    result = subprocess.run(
        [sys.executable, 'scrape_naukri.py', keywords, location],
        capture_output=True, text=True
    )

    print("STDOUT:", result.stdout[:500])  # Trimmed preview
    print("STDERR:", result.stderr)

    try:
        stdout_clean = result.stdout.strip()
        jobs_raw = json.loads(stdout_clean)
        jobs = normalize_job_data(jobs_raw)
    except Exception as e:
        print("Error parsing or normalizing jobs:", e)
        jobs = []

    return jsonify(jobs)

if __name__ == '__main__':
    app.run(debug=True)