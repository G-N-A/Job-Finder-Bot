import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    keywords = request.args.get('keywords', 'data analyst')
    location = request.args.get('location', 'india')
    try:
        result = subprocess.run(
            ['python', 'scrape_naukri.py', keywords, location],
            capture_output=True, text=True, timeout=60
        )
        print("Subprocess STDOUT:")
        print(result.stdout)
        print("Subprocess STDERR:")
        print(result.stderr)

        jobs = json.loads(result.stdout)
    except Exception as e:
        print("Error loading JSON:", str(e))
        jobs = []

    return jsonify(jobs)


if __name__ == '__main__':
    app.run(debug=True)
