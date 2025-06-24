import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import AdminTasks from './AdminTasks';
import AdminStats from './AdminStats';
import AdminGifts from "./AdminGifts";

/**
 * Главная панель администратора с вкладками.
 * @returns {JSX.Element}
 */
const AdminPanel = () => {
    /**
     * Индекс текущей активной вкладки.
     */
    const [currentTab, setCurrentTab] = useState(0);

    /**
     * Обрабатывает переключение вкладок.
     * @param {Event} event - Событие изменения
     * @param {number} newValue - Новый индекс вкладки
     */
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="Задачи" />
                    <Tab label="Призы" />
                </Tabs>
            </Box>
            <Box sx={{ mt: 2 }}>
              {currentTab === 0 && <AdminTasks />}
              {currentTab === 1 && <AdminGifts />}
            </Box>
        </Box>
    );
};

export default AdminPanel;
