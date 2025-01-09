import './Log.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Log = ({ setTracker }) => {
    const [event, setEvent] = useState('');
    const [time, setTime] = useState('');
    const [sport, setSport] = useState('');
    const [date, setDate] = useState('');
    const [logs, setLogs] = useState([]);
    const [filterType, setFilterType] = useState('none');
    const [filterValue, setFilterValue] = useState('');
    const loggedInUser = localStorage.getItem('loggedInUser');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/logs');
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, []);

    const handleTracking = async (e) => {
        e.preventDefault();

        if (!loggedInUser) {
            alert('No user logged in. Please log in to track your times.');
            return;
        }

        const newLog = { 
            user: loggedInUser, 
            sport, 
            event, 
            time, 
            date
        };

        try {
            await axios.post('http://localhost:5000/api/logs', newLog);

            setLogs((prevLogs) => [...prevLogs, newLog]);

            alert('Time tracked successfully!');
            setSport('');
            setEvent('');
            setTime('');
            setDate('');
            setTracker(true);
        } catch (error) {
            console.error('Error adding log:', error);
            alert('Failed to track time. Please try again.');
        }
    };

    const getUserLogs = () => {
        return logs
            .filter((log) => log.user === loggedInUser)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const getFilteredLogs = () => {
        const userLogs = getUserLogs();

        if (filterType === 'sport' && filterValue) {
            return userLogs.filter((log) =>
                log.sport.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (filterType === 'event' && filterValue) {
            return userLogs.filter((log) =>
                log.event.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return userLogs;
    };

    const currentLogs = getFilteredLogs();

    return (
        <><div className="current-user">
            {loggedInUser && <small>{loggedInUser}</small>}
        </div><div className="screen">
                <div className="center">
                    <header className="header"></header>
                    <header className='header'></header>
                    <p className="subtitle">Fill out the input boxes below to update your times.</p>
                </div>
                <div className="center">
                    <div className="form-container">
                        <h2 className="form-title"></h2>
                        <form onSubmit={handleTracking} className="form">
                            <input
                                type="text"
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                placeholder="Sport (ex: Swimming)"
                                required
                                className="input" />
                            <input
                                type="text"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                placeholder="Event (ex: 200 BR)"
                                required
                                className="input" />
                            <input
                                type="text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="Time (ex: 12:34.56)"
                                required
                                className="input" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Date"
                                required
                                className="input" />
                            <button type="submit" className="button">Submit</button>
                        </form>
                    </div>

                    <div className="form-container">
                        <h2 className='form-title'></h2>

                        <div className="filter-container">
                            <div className="filter-section">
                                <label>
                                    <input
                                        type="radio"
                                        name="filterType"
                                        value="none"
                                        checked={filterType === 'none'}
                                        onChange={() => setFilterType('none')}
                                    /> All Times
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="filterType"
                                        value="sport"
                                        checked={filterType === 'sport'}
                                        onChange={() => setFilterType('sport')}
                                    /> Filter by Sport
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="filterType"
                                        value="event"
                                        checked={filterType === 'event'}
                                        onChange={() => setFilterType('event')}
                                    /> Filter by Event
                                </label>
                                {filterType !== 'none' && (
                                    <input
                                        type="text"
                                        value={filterValue}
                                        onChange={(e) => setFilterValue(e.target.value)}
                                        placeholder={`Filter by ${filterType}`}
                                        className="filter-input"
                                    />
                                )}
                            </div>
                        </div>

                        <h2 className="form-title">Your Times</h2>

                        <div className="logs-container">
                            {currentLogs.map((log, index) => (
                                <div key={index} className="log-entry">
                                    <p><strong>Sport:</strong> {log.sport}</p>
                                    <p><strong>Event:</strong> {log.event}</p>
                                    <p><strong>Time:</strong> {log.time}</p>
                                    <hr />
                                </div>
                            ))}
                            {currentLogs.length === 0 && <p>No logs available for the current user.</p>}
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="button">Get progress graph</button>
                    </div>

                </div>
            </div></>
    );
};

export default Log;
