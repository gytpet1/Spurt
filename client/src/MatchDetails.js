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

    return (
        <div className="match-details-container">
            <button onClick={() => navigate(-1)}>Back</button>
            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            {matchDetails && (
                <div className="match-details">
                    <h3>Match Details for {matchId}</h3>
                    <pre>{JSON.stringify(matchDetails, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default MatchDetails;
