import React from 'react';
import GameCanvas from './components/GameCanvas';
import Navbar from "./components/Navbar";

const App = () => {
  return (
      <><Navbar />
      <div>
        <GameCanvas />
      </div></>
  );
};

export default App;
