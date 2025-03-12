import React from 'react';
import './App.css';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>番茄时钟</h1>
        <PomodoroTimer />
      </header>
    </div>
  );
}

export default App;
