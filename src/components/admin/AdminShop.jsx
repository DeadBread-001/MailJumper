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
import AddProductModal from "../AddProductModal";
import {deleteProduct} from "../../api/admin";
import {getProducts, getPromocodes} from "../../api/shop";

const AdminShop = () => {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, promocodesData] = await Promise.all([
                    getProducts(),
                    getPromocodes()
                ]);
                setItems([...productsData, ...promocodesData]);
            } catch (err) {
                console.error("Ошибка при получении данных:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (itemId) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            setProductToEdit(item);
            setShowModal(true);
        }
    };

    const handleDelete = (itemId) => {
        const item = items.find(i => i.id === itemId);
        const confirmed = window.confirm("Вы уверены, что хотите удалить этот товар?");
        if (confirmed) {
            deleteProduct(itemId, item);
        }
    };

    const handleAdd = () => {
        setProductToEdit(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProductToEdit(null);
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

          <AddProductModal
            isOpen={showModal}
            onClose={handleCloseModal}
            productToEdit={productToEdit}
          />
      </Box>
    );
};

export default AdminShop;
