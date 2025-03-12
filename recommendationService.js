// recommendationService.js

const { exec } = require('child_process');
const path = require('path');

// Function to get anime recommendations by calling the Python script
const getAnimeRecommendations = (userId) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'anime_recommendation.py');
    exec(`python3 ${scriptPath} ${userId}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing script: ${stderr}`);
      } else {
        let result;
        try {
          result = JSON.parse(stdout);
        } catch (e) {
          return reject(`Error parsing JSON: ${e}`);
        }
        resolve(result);
      }
    });
  });
};

// Function to get user recommendations by calling the Python script
const getUserRecommendations = (userId) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'user_recommendation.py');
    exec(`python3 ${scriptPath} ${userId}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing script: ${stderr}`);
      } else {
        let result;
        try {
          result = JSON.parse(stdout);
        } catch (e) {
          return reject(`Error parsing JSON: ${e}`);
        }
        resolve(result);
      }
    });
  });
};

module.exports = { getAnimeRecommendations, getUserRecommendations };
