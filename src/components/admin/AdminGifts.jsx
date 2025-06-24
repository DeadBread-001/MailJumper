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
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { getGifts, deleteGift } from '../../api/admin';
import AddGiftModal from '../AddGiftModal';

/**
 * Компонент для управления призами в админ-панели.
 * @returns {JSX.Element}
 */
const AdminGifts = () => {
  const [gifts, setGifts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const giftsData = await getGifts();
        setGifts(giftsData);
      } catch (err) {
        console.error('Ошибка при получении призов:', err);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (giftId) => {
    const gift = gifts.find((i) => i.id === giftId);
    if (gift) {
      setGiftToEdit(gift);
      setShowModal(true);
    }
  };

  const handleDelete = async (giftId) => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить этот приз?'
    );
    if (confirmed) {
      try {
        await deleteGift(giftId);
        setGifts(gifts.filter((g) => g.id !== giftId));
      } catch (err) {
        console.error('Ошибка при удалении приза:', err);
      }
    }
  };

  const handleAdd = () => {
    setGiftToEdit(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGiftToEdit(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">Управление призами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Добавить приз
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Фото</TableCell>
              <TableCell>Кол-во</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gifts.map((gift) => (
              <TableRow key={gift.id}>
                <TableCell>{gift.id}</TableCell>
                <TableCell>{gift.name}</TableCell>
                <TableCell>{gift.description}</TableCell>
                <TableCell>
                  {gift.photo ? (
                    <img
                      src={gift.photo}
                      alt={gift.name}
                      width="50"
                    />
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{gift.count}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(gift.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(gift.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddGiftModal
        isOpen={showModal}
        onClose={handleCloseModal}
        giftToEdit={giftToEdit}
      />
    </Box>
  );
};

export default AdminGifts;
