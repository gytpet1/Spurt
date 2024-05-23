import React, { useState } from 'react';
import axios from 'axios';
import MatchHistory from './MatchHistory';
import './KDAForm.css';

const platformRegions = [
    { name: 'Europe West', value: 'euw1' },
    { name: 'Europe Nordic & East', value: 'eun1' },
    { name: 'North America', value: 'na1' },
    { name: 'Korea', value: 'kr' },
    { name: 'Brazil', value: 'br1' },
    { name: 'Latin America North', value: 'la1' },
    { name: 'Latin America South', value: 'la2' },
    { name: 'Oceania', value: 'oc1' },
    { name: 'Russia', value: 'ru' },
    { name: 'Turkey', value: 'tr1' },
    { name: 'Japan', value: 'jp1' }
];

function KDAForm() {
    const [summonerName, setSummonerName] = useState('');
    const [platformRegion, setPlatformRegion] = useState('');
    const [matchHistory, setMatchHistory] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMatchHistory([]);
        try {
            const response = await axios.get(`http://localhost:5000/get-match-history?summonerName=${summonerName}&platformRegion=${platformRegion}`);
            console.log(`Request: http://localhost:5000/get-match-history?summonerName=${summonerName}&platformRegion=${platformRegion}`);
            setMatchHistory(response.data.matchHistory);
        } catch (error) {
            console.error('Error fetching match history:', error);
            setError('An error occurred while fetching the match history. Please try again.');
        }
    };

    return (
        <div className="kda-form">
            <h1>Enter your Summoner Name and Select Platform Region</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={summonerName}
                    onChange={(e) => setSummonerName(e.target.value)}
                    placeholder="Summoner Name"
                />
                <div>
                    <h3>Select Platform Region</h3>
                    {platformRegions.map((region) => (
                        <button
                            type="button"
                            key={region.value}
                            onClick={() => setPlatformRegion(region.value)}
                            className={`region-button ${platformRegion === region.value ? 'selected' : ''}`}
                        >
                            {region.name}
                        </button>
                    ))}
                </div>
                <button type="submit">Get Match History</button>
            </form>
            {error && <div className="error">{error}</div>}
            {matchHistory.length > 0 && <MatchHistory matchHistory={matchHistory} />}
        </div>
    );
}

export default KDAForm;
