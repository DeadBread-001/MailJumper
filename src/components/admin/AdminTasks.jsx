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
import {deleteTask} from "../../api/admin";
import AddTaskModal from "../AddTaskModal";

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    useEffect(() => {
        // TODO: Загрузка задач с сервера
        // Пример данных
        setTasks([
            { id: 1, name: 'Задача 1', link: 'ytfytf', description: 'Описание задачи 1', reward: 100 },
            { id: 2, name: 'Задача 2', link: 'ytfytf', description: 'Описание задачи 2', reward: 200 },
        ]);
    }, []);

    const handleEdit = (taskId) => {
        const task = tasks.find(i => i.id === taskId);
        if (task) {
            setTaskToEdit(task);
            setShowModal(true);
        }
    };

    const handleDelete = (taskId) => {
        const task = tasks.find(i => i.id === taskId);
        const confirmed = window.confirm("Вы уверены, что хотите удалить эту задачу?");
        if (confirmed) {
            deleteTask(taskId, task);
        }
    };

    const handleAdd = () => {
        setTaskToEdit(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTaskToEdit(null);
    }

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
                                <TableCell>{task.name}</TableCell>
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

            <AddTaskModal
                isOpen={showModal}
                onClose={handleCloseModal}
                taskToEdit={taskToEdit}
            />
        </Box>
    );
};

export default AdminTasks;
