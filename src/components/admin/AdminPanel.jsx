import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import AdminTasks from './AdminTasks';
import AdminStats from './AdminStats';

const AdminPanel = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="Задачи" />
                    <Tab label="Статистика" />
                </Tabs>
            </Box>
            <Box sx={{ mt: 2 }}>
                {currentTab === 0 && <AdminTasks />}
                {currentTab === 2 && <AdminStats />}
            </Box>
        </Box>
    );
};

export default AdminPanel;
