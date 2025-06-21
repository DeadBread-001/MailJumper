import React from 'react';
import GameCanvas from './components/GameCanvas';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminPanel from './components/admin/AdminPanel';

/**
 * Временная функция для проверки прав доступа администратора.
 * @returns {boolean} true если пользователь является администратором
 */
const isAdmin = () => {
    // TODO: Реализовать реальную проверку прав доступа
    return true;
};

/**
 * Компонент защищенного маршрута для администраторов.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ children }) => {
    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

/**
 * Главный компонент приложения с маршрутизацией.
 * @returns {JSX.Element}
 */
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
