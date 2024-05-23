import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KDAForm from './KDAForm';
import MatchHistory from './MatchHistory';
import MatchDetails from './MatchDetails';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<KDAForm />} />
                    <Route path="/match-history" element={<MatchHistory />} />
                    <Route path="/match-details/:matchId" element={<MatchDetails />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
