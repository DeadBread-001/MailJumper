import React from 'react';
import GameCanvas from './components/GameCanvas';
import Navbar from "./components/Navbar";
import {Route, Routes, Navigate} from "react-router-dom";
import Rating from "./components/Rating";
import Tasks from "./components/Tasks";
import Shop from "./components/Shop";
import AdminPanel from "./components/AdminPanel";

// Временная функция для проверки прав доступа
const isAdmin = () => {
    // TODO: Реализовать реальную проверку прав доступа
    return true;
};

const ProtectedRoute = ({ children }) => {
    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const App = () => {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<GameCanvas />} />
                <Route path="/rating" element={<Rating />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/shop" element={<Shop />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
