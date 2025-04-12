import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

const AdminStats = () => {
    const [stats, setStats] = useState({
        // totalUsers: 0,
        totalTasks: 0,
        totalItems: 0,
    });

    useEffect(() => {
        // TODO: Загрузка статистики с сервера
        // Пример данных
        setStats({
            // totalUsers: 150,
            totalTasks: 25,
            totalItems: 10,
        });
    }, []);

    const StatCard = ({ title, value, icon: Icon }) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Статистика
            </Typography>
            <Grid container spacing={3}>
                {/*<Grid>*/}
                {/*    <StatCard*/}
                {/*        title="Всего пользователей"*/}
                {/*        value={stats.totalUsers}*/}
                {/*        icon={PeopleIcon}*/}
                {/*    />*/}
                {/*</Grid>*/}
                <Grid>
                    <StatCard
                        title="Всего задач"
                        value={stats.totalTasks}
                        icon={AssignmentIcon}
                    />
                </Grid>
                <Grid>
                    <StatCard
                        title="Товаров в магазине"
                        value={stats.totalItems}
                        icon={ShoppingCartIcon}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminStats;
