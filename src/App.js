import './App.css';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Act1 from './Activities/Act1';
import Act2 from './Activities/Act2';

function App() {
  return (
    <Router>
    <Routes>
      <Route path='/1' element={<Act1/>}></Route>
      <Route path='/2' element={<Act2/>}></Route>
    </Routes>
  </Router>
  )
}

export default App;
