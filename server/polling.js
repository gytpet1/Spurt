const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.RIOT_API_KEY;
const SUMMONER_ID = process.env.SUMMONER_ID; // This should be the encrypted summoner ID

const region = 'na1'; // Adjust based on the player's region

const getActiveGame = async (summonerId) => {
    const url = `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Player is not currently in a game
        } else {
            console.error('Error fetching active game:', error);
            throw error;
        }
    }
};

const pollForActiveGame = async () => {
    try {
        const gameData = await getActiveGame(SUMMONER_ID);
        if (gameData) {
            console.log('Player is in a game:', gameData);
            // Here you can trigger your logic for when a player joins a game
        } else {
            console.log('Player is not in a game.');
        }
    } catch (error) {
        console.error('Error during polling:', error);
    }
};

// Poll every 30 seconds
setInterval(pollForActiveGame, 30000);
