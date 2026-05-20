const express = require("express");
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');

const xmlData = fs.readFileSync('./story.xml', 'utf-8');

const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: "@_",
                              isArray: (tagName) => ['episode', 'answer'].includes(tagName)});

const result = parser.parse(xmlData);
const textHistory = result.textHistory;

function getRequestEpisode(request, response)
{
  const episodeId = request.query.id;
  const episode = textHistory.episode.find(ep => ep["@_id"] === episodeId);
  response.json(episode);
}

const app = express();
app.use(express.json());
app.get("/episode", getRequestEpisode);
app.use(express.static("frontend/assets")); 
app.use(express.static("frontend")); 
app.listen(3000);