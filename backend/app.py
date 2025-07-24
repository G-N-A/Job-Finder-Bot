import os
from flask import Flask, request, jsonify
import requests as pyrequests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

REED_API_KEY = os.environ.get('REED_API_KEY')
REED_API_BASE = 'https://www.reed.co.uk/api/1.0'

if not REED_API_KEY:
    raise RuntimeError('REED_API_KEY environment variable not set')

def reed_api_get(endpoint, params=None):
    url = f"{REED_API_BASE}{endpoint}"
    resp = pyrequests.get(
        url,
        params=params,
        auth=(REED_API_KEY, ''),
        timeout=10
    )
    resp.raise_for_status()
    return resp.json()

@app.route('/api/jobs', methods=['GET'])
def search_jobs():
    params = {}
    allowed_params = [
        'employerId', 'employerProfileId', 'keywords', 'locationName', 'distanceFromLocation',
        'permanent', 'contract', 'temp', 'partTime', 'fullTime', 'minimumSalary', 'maximumSalary',
        'postedByRecruitmentAgency', 'postedByDirectEmployer', 'graduate', 'resultsToTake', 'resultsToSkip'
    ]
    for p in allowed_params:
        v = request.args.get(p)
        if v is not None:
            params[p] = v
    try:
        data = reed_api_get('/search', params)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<job_id>', methods=['GET'])
def job_details(job_id):
    try:
        data = reed_api_get(f'/jobs/{job_id}')
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 