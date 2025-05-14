import React from 'react';
import GameCanvas from './components/GameCanvas';
import { Route, Routes, Navigate } from 'react-router-dom';
import Rating from './components/Rating';
import Tasks from './components/Tasks';
import AdminPanel from './components/admin/AdminPanel';

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
            <Routes>
                <Route path="/" element={<GameCanvas />} />
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
