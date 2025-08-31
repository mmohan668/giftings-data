// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import serverless from "serverless-http";

const app = express();
const DRIVE_URL = `https://drive.google.com/uc?export=download&id=1xOc5eudRVQgjXE85cAS_4voYqtcw_E8H`;

let cachedData = null; // cache storage
let lastFetched = null; // timestamp
const CACHE_TTL = 60 * 60 * 24 * 1000; // cache time (1 day)

app.use(
  cors({
    origin: "*", // Angular dev server
  })
);

app.get("/api/data", async (req, res) => {
  try {
    // Check cache
    if (cachedData && Date.now() - lastFetched < CACHE_TTL) {
      return res.json(cachedData);
    }
    // Fetch from Google Drive
    const response = await fetch(DRIVE_URL);
    const data = await response.json();
    // Save to cache
    cachedData = data;
    lastFetched = Date.now();
    res.json(data); // send JSON to frontend
  } catch (err) {
    console.error("Error fetching JSON:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export const handler = serverless(app);
