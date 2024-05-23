import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './MatchDetails.css';

function MatchDetails() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { platformRegion } = location.state; // Get platformRegion from location state
    const [matchDetails, setMatchDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMatchDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/get-match-details?matchId=${matchId}&platformRegion=${platformRegion}`);
                setMatchDetails(response.data);
            } catch (err) {
                setError('Error fetching match details');
            } finally {
                setLoading(false);
            }
        };
        fetchMatchDetails();
    }, [matchId, platformRegion]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const team1 = matchDetails?.info?.participants.slice(0, 5) || [];
    const team2 = matchDetails?.info?.participants.slice(5, 10) || [];

    return (
        <div className="match-details-container">
            <button onClick={() => navigate(-1)}>Back</button>
            {matchDetails && (
                <div className="match-details">
                    <h3>Match Details for {matchId}</h3>
                    <div className="teams-container">
                        <div className="team">
                            <h4>Team 1</h4>
                            {team1.map((player, index) => (
                                <div key={index} className="player-details">
                                    <div><strong>Champion:</strong> {player.championName}</div>
                                    <div><strong>Kills:</strong> {player.kills}</div>
                                    <div><strong>Deaths:</strong> {player.deaths}</div>
                                    <div><strong>Assists:</strong> {player.assists}</div>
                                </div>
                            ))}
                        </div>
                        <div className="team">
                            <h4>Team 2</h4>
                            {team2.map((player, index) => (
                                <div key={index} className="player-details">
                                    <div><strong>Champion:</strong> {player.championName}</div>
                                    <div><strong>Kills:</strong> {player.kills}</div>
                                    <div><strong>Deaths:</strong> {player.deaths}</div>
                                    <div><strong>Assists:</strong> {player.assists}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchDetails;
