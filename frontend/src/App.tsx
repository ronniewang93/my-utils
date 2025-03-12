import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PomodoroTimer from './pomodoro-timer';
import KanbanBoard from './kanban';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <nav className="menu-bar">
          <ul>
            <li>
              <Link to="/pomodoro">番茄时钟</Link>
            </li>
            <li>
              <Link to="/kanban">看板</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<PomodoroTimer />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="/kanban" element={<KanbanBoard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
