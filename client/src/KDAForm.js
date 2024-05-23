import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    const [kda, setKda] = useState(null);
    const [program, setProgram] = useState('');
    const [error, setError] = useState('');
    const [matchHistory, setMatchHistory] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setKda(null);
        setProgram('');
        setMatchHistory([]);
        try {
            const response = await axios.get(`http://localhost:5000/get-kda?summonerName=${summonerName}&platformRegion=${platformRegion}`);
            const kdaValue = response.data.kda;
            setKda(kdaValue);
            if (kdaValue >= 3) {
                setProgram('Intensive workout program');
            } else if (kdaValue >= 1.5) {
                setProgram('Moderate workout program');
            } else {
                setProgram('Light workout program');
            }

            const matchHistoryResponse = await axios.get(`http://localhost:5000/get-match-history?summonerName=${summonerName}&platformRegion=${platformRegion}`);
            setMatchHistory(matchHistoryResponse.data.matchHistory);
            navigate('/match-history', {
                state: { matchHistory: matchHistoryResponse.data.matchHistory, platformRegion }
            });
        } catch (error) {
            console.error('Error fetching KDA:', error);
            setError('An error occurred while fetching the KDA. Please try again.');
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
                    <select
                        value={platformRegion}
                        onChange={(e) => setPlatformRegion(e.target.value)}
                    >
                        <option value="">Select Region</option>
                        {platformRegions.map((region) => (
                            <option key={region.value} value={region.value}>
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Get Match History</button>
            </form>
            {error && <div className="error">{error}</div>}
            {kda && (
                <div className="kda-display">
                    <h2>KDA: {kda}</h2>
                    <h2>{program}</h2>
                </div>
            )}
        </div>
    );
}

export default KDAForm;
