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

const AdminShop = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // TODO: Загрузка товаров с сервера
        // Пример данных
        setItems([
            { id: 1, name: 'Скин 1', price: 100, description: 'Описание скина 1' },
            { id: 2, name: 'Скин 2', price: 200, description: 'Описание скина 2' },
        ]);
    }, []);

    const handleEdit = (itemId) => {
        // TODO: Реализация редактирования товара
        console.log('Edit item:', itemId);
    };

    const handleDelete = (itemId) => {
        // TODO: Реализация удаления товара
        console.log('Delete item:', itemId);
    };

    const handleAdd = () => {
        // TODO: Реализация добавления товара
        console.log('Add new item');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    Управление магазином
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Добавить товар
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Цена</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(item.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item.id)}>
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

export default AdminShop; 