const axios = require('axios');
require('dotenv').config(); // Load environment variables

const API_KEY = process.env.RIOT_API_KEY;
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

async function getSummonerIdByPUUID(puuid, platformRegion) {
    const url = `https://${platformRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
    console.log(`Fetching Summoner ID: ${url}`);
    try {
        const response = await axios.get(url);
        return response.data.id; // This is the summoner ID
    } catch (error) {
        console.error('Error fetching Summoner ID:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getActiveGame(summonerPUUID, platformRegion) {
    try {
        const summonerId = await getSummonerIdByPUUID(summonerPUUID, platformRegion);
        const url = `https://${platformRegion}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${summonerPUUID}?api_key=${API_KEY}`;
        console.log(`Fetching Active Game: ${url}`);
        const response = await axios.get(url);
        console.log('Active Game response:', response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Player is not currently in a game
        } else {
            console.error('Error fetching active game:', error);
            throw error;
        }
    }
}


module.exports = { getActiveGame };
