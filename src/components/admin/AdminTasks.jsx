import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Box,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // TODO: Загрузка задач с сервера
        // Пример данных
        setTasks([
            { id: 1, title: 'Задача 1', description: 'Описание задачи 1', reward: 100 },
            { id: 2, title: 'Задача 2', description: 'Описание задачи 2', reward: 200 },
        ]);
    }, []);

    const handleEdit = (taskId) => {
        // TODO: Реализация редактирования задачи
        console.log('Edit task:', taskId);
    };

    const handleDelete = (taskId) => {
        // TODO: Реализация удаления задачи
        console.log('Delete task:', taskId);
    };

    const handleAdd = () => {
        // TODO: Реализация добавления задачи
        console.log('Add new task');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    Управление задачами
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Добавить задачу
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Награда</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.reward}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(task.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(task.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminTasks; 