import React from 'react';
import GameCanvas from './components/GameCanvas';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminPanel from './components/admin/AdminPanel';
import { getTasks } from './api/admin';
import { useState, useEffect } from 'react';

const useAdminCheck = () => {
    const [checked, setChecked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let ignore = false;
        getTasks()
            .then(() => {
                if (!ignore) {
                    setIsAdmin(true);
                    setChecked(true);
                }
            })
            .catch((err) => {
                if (!ignore) {
                    setIsAdmin(false);
                    setChecked(true);
                }
            });
        return () => {
            ignore = true;
        };
    }, []);
    return { checked, isAdmin };
};

/**
 * Компонент защищенного маршрута для администраторов.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ children }) => {
    const { checked, isAdmin } = useAdminCheck();
    if (!checked) return <div>Загрузка...</div>;
    if (!isAdmin) return <Navigate to="/" replace />;
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
