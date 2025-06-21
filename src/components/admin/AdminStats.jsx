import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
    Assignment as AssignmentIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

/**
 * Компонент для отображения статистики в админ-панели.
 * @returns {JSX.Element}
 */
const AdminStats = () => {
    /**
     * Статистические данные.
     */
    const [stats, setStats] = useState({
        // totalUsers: 0,
        totalTasks: 0,
        totalItems: 0,
    });

    /**
     * Загружает статистические данные при монтировании компонента.
     */
    useEffect(() => {
        // TODO: Загрузка статистики с сервера
        // Пример данных
        setStats({
            // totalUsers: 150,
            totalTasks: 25,
            totalItems: 10,
        });
    }, []);

    /**
     * Компонент карточки статистики.
     * @param {Object} props
     * @param {string} props.title - Заголовок карточки
     * @param {number} props.value - Значение статистики
     * @param {React.Component} props.icon - Иконка для карточки
     * @returns {JSX.Element}
     */
    const StatCard = ({ title, value, icon: Icon }) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4">{value}</Typography>
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
