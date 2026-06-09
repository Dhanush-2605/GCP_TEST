const express = require('express');
const os = require('os');
const app = express();
const port =  8080;

app.get('/', (req, res) => {
  const podName = os.hostname();
  
  const htmlResponse = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GCP CI/CD Demo</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              /* A nice dark blue cloud-like gradient background */
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              color: #333;
          }
          .card {
              background-color: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 450px;
          }
          h1 {
              color: #4285F4; /* GCP Blue */
              margin-top: 0;
          }
          p {
              font-size: 1.1em;
              line-height: 1.6;
              color: #5f6368;
          }
          .pod-info {
              margin-top: 25px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
              border-left: 6px solid #34A853; /* GCP Green */
              font-family: 'Courier New', Courier, monospace;
              font-size: 1.2em;
              color: #202124;
          }
          .badge {
              display: inline-block;
              background-color: #fbbc05; /* GCP Yellow */
              color: #000;
              padding: 5px 10px;
              border-radius: 20px;
              font-size: 0.8em;
              font-weight: bold;
              margin-bottom: 15px;
          }
      </style>
  </head>
  <body>
      <div class="card">
          <div class="badge">V1.0 Live</div>
          <h1>🚀 Pipeline Success!</h1>
          <p>Hey bro, your automated CI/CD pipeline pushed this code from GitHub directly to Google Kubernetes Engine.</p>
          <div class="pod-info">
              <span style="font-size: 0.8em; color: #5f6368;">Served from Kubernetes Pod:</span><br>
              <strong>${podName}</strong>
          </div>
      </div>
  </body>
  </html>
  `;

  res.send(htmlResponse);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});