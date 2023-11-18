import './App.css';
import {HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Act1 from './Activities/Act1';
import Act2 from './Activities/Act2';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/1" replace />} />
        <Route path="/1" element={<Act1/>} />
        <Route path="/2" element={<Act2/>} />
      </Routes>
    </Router>
  )
}

export default App;
