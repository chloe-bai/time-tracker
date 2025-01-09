import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Log from './components/Log';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tracker, setTracker] = useState(null);

  return (
      <Router>
          <Routes>
              {/* Route to Login page */}
              <Route 
                  path="/" 
                  element={
                      <Login 
                          setIsAuthenticated={setIsAuthenticated} 
                      />
                  } 
              />
              {/* Route to Log page */}
              <Route
                path="/log"
                element={
                  <Log
                    setTracker={setTracker}
                  />
                }
              />
          </Routes>
      </Router>
  );
}

export default App;
