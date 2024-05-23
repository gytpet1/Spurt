import React from 'react';
import './MatchHistory.css';

function MatchHistory({ matchHistory }) {
    return (
        <div className="match-history">
            <h2>Match History</h2>
            <ul>
                {matchHistory.map((match, index) => (
                    <li key={index} className="match-item">
                        <div className="match-row">
                            <div className="match-detail"><strong> {match.championName}</strong></div>
                            <div className="match-detail"><strong>Kills:</strong> {match.kills}</div>
                            <div className="match-detail"><strong>Deaths:</strong> {match.deaths}</div>
                            <div className="match-detail"><strong>Assists:</strong> {match.assists}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MatchHistory;
