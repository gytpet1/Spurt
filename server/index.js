const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Add this line to load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.RIOT_API_KEY; // Use the environment variable

app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

const regionMap = {
    'euw1': 'europe',
    'eun1': 'europe',
    'tr1': 'europe',
    'ru': 'europe',
    'na1': 'americas',
    'br1': 'americas',
    'la1': 'americas',
    'la2': 'americas',
    'oc1': 'americas',
    'kr': 'asia',
    'jp1': 'asia'
};

let championData = {};
async function fetchChampionData() {
    try {
        const response = await axios.get('http://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json');
        championData = response.data.data;
    } catch (error) {
        console.error('Error fetching champion data:', error.message);
    }
}
fetchChampionData();

async function getPUUID(summonerName, platformRegion) {
    const region = regionMap[platformRegion];
    const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${platformRegion}?api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data.puuid;
    } catch (error) {
        console.error('Error fetching PUUID:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getMatchList(puuid, platformRegion) {
    const region = regionMap[platformRegion];
    const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching match list:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getMatchDetails(matchId, platformRegion) {
    const region = regionMap[platformRegion];
    const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        const matchDetails = response.data;

        // Add champion names to participants
        matchDetails.info.participants.forEach(participant => {
            const champion = championData[participant.championName];
            participant.championName = champion ? champion.name : 'Unknown';
        });

        return matchDetails;
    } catch (error) {
        console.error('Error fetching match details:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getMatchHistory(summonerName, platformRegion) {
    try {
        const puuid = await getPUUID(summonerName, platformRegion);
        const matchList = await getMatchList(puuid, platformRegion);

        const matchHistory = [];
        for (let matchId of matchList) {
            const matchDetails = await getMatchDetails(matchId, platformRegion);
            const player = matchDetails.info.participants.find(p => p.puuid === puuid);

            matchHistory.push({
                matchId: matchId,
                championName: player.championName,
                kills: player.kills,
                deaths: player.deaths,
                assists: player.assists
            });
        }

        return matchHistory;
    } catch (error) {
        console.error('Error fetching match history:', error.message);
        throw error;
    }
}

app.get('/get-match-history', async (req, res) => {
    const { summonerName, platformRegion } = req.query;
    try {
        const matchHistory = await getMatchHistory(summonerName, platformRegion);
        res.json({ matchHistory });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', message: error.message });
    }
});

app.get('/get-match-details', async (req, res) => {
    const { matchId, platformRegion } = req.query;
    try {
        const matchDetails = await getMatchDetails(matchId, platformRegion);
        res.json(matchDetails);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', message: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
