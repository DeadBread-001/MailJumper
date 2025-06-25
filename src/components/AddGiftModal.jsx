import React, { useState, useEffect, useRef } from 'react';
import { saveGift } from '../api/admin';

/**
 * Модальное окно для добавления или редактирования призов.
 * @param {Object} props
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {Object|null} props.giftToEdit - Данные приза для редактирования
 * @param {Function} props.onSaved - Функция, вызываемая после успешного сохранения
 * @returns {JSX.Element|null}
 */
const AddGiftModal = ({ isOpen, onClose, giftToEdit, onSaved }) => {
    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        photo: '',
        count: '',
    });

    const nameRef = useRef(null);

    const resetForm = () => {
        setForm({
            id: '',
            name: '',
            description: '',
            photo: '',
            count: '',
        });
    };

    useEffect(() => {
        if (giftToEdit) {
            setForm({
                id: giftToEdit.id || '',
                name: giftToEdit.name || '',
                description: giftToEdit.description || '',
                photo: giftToEdit.photo || '',
                count: giftToEdit.count || '',
            });
            nameRef.current?.focus();
        } else {
            resetForm();
        }
    }, [isOpen, giftToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.description || !form.photo || !form.count) {
            console.warn('Заполните все поля');
            return;
        }

        const isEdit = !!giftToEdit;

        const dataToSend = {
            id: 0,
            name: form.name,
            description: form.description,
            photo: form.photo,
            count: Number(form.count),
        };

        if (isEdit && form.id) {
            dataToSend.id = form.id;
        }

        try {
            await saveGift(dataToSend, isEdit);
            onClose();
        } catch (err) {
            console.error('Ошибка при сохранении приза:', err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{giftToEdit ? 'Редактировать приз' : 'Добавить приз'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название</label>
                        <input
                            ref={nameRef}
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ссылка на фото</label>
                        <input
                            type="text"
                            name="photo"
                            value={form.photo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Количество</label>
                        <input
                            type="number"
                            name="count"
                            value={form.count}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={
                                !form.name ||
                                !form.description ||
                                !form.photo ||
                                !form.count
                            }
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGiftModal;
