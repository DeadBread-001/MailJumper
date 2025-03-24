import React from 'react';
import GameCanvas from './components/GameCanvas';
import Navbar from "./components/Navbar";
import {Route, Routes} from "react-router-dom";
import Rating from "./components/Rating";
import Tasks from "./components/Tasks";
import Shop from "./components/Shop";

const App = () => {
  return (
      <>
      <Navbar/>
      <Routes>
          <Route path="/" element={<GameCanvas />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/shop" element={<Shop />} />
      </Routes>
      </>
  );
};

export default App;
