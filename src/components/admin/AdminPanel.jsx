import { useState } from 'react';

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
                    <Tab label="Магазин" />
                    <Tab label="Статистика" />
                </Tabs>
            </Box>
            <Box sx={{ mt: 2 }}>
                {currentTab === 0 && <AdminTasks />}
                {currentTab === 1 && <AdminShop />}
                {currentTab === 2 && <AdminStats />}
            </Box>
        </Box>
    );
};

export default AdminPanel;
