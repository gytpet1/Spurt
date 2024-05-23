import React from 'react';
import './MatchHistory.css';

function MatchHistory({ matchHistory }) {
    return (
        <div className="match-history">
            <h2>Match History</h2>
            <ul>
                {matchHistory.map((match, index) => (
                    <li key={index} className="match-item">
                        <div className="champion-name">Champion: {match.championName}</div>
                        <div>Kills: {match.kills}</div>
                        <div>Deaths: {match.deaths}</div>
                        <div>Assists: {match.assists}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MatchHistory;
