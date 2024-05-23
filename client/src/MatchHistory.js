import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MatchHistory.css';

function MatchHistory() {
    const navigate = useNavigate();
    const location = useLocation();
    const { matchHistory, platformRegion } = location.state || { matchHistory: [], platformRegion: '' };

    const handleMoreDetails = (matchId) => {
        navigate(`/match-details/${matchId}`, { state: { platformRegion } });
    };

    return (
        <div className="match-history">
            <h2>Match History</h2>
            <ul>
                {matchHistory.map((match, index) => (
                    <li key={index} className="match-item">
                        <div className="match-row">
                            <div className="match-detail"><strong>Champion:</strong> {match.championName}</div>
                            <div className="match-detail"><strong>Kills:</strong> {match.kills}</div>
                            <div className="match-detail"><strong>Deaths:</strong> {match.deaths}</div>
                            <div className="match-detail"><strong>Assists:</strong> {match.assists}</div>
                            <button onClick={() => handleMoreDetails(match.matchId)}>More Details</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MatchHistory;
