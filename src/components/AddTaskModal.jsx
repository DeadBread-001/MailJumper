import React, { useState, useEffect, useRef } from 'react';
import { saveTask } from '../api/admin';

const AddTaskModal = ({ isOpen, onClose, taskToEdit }) => {
    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        link: '',
        reward: '',
    });

    const nameRef = useRef(null);

    const resetForm = () => {
        setForm({
            id: '',
            name: '',
            description: '',
            link: '',
            reward: '',
        });
    };

    useEffect(() => {
        if (taskToEdit) {
            setForm({
                id: taskToEdit.id || '',
                name: taskToEdit.name || '',
                description: taskToEdit.description || '',
                link: taskToEdit.link || '',
                reward: taskToEdit.reward || '',
            });
            nameRef.current?.focus();
        } else {
            resetForm();
        }
    }, [isOpen, taskToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.description || !form.reward || !form.link) {
            console.warn('Заполните обязательные поля');
            return;
        }

        const isEdit = !!taskToEdit;

        const dataToSend = {
            name: form.name,
            description: form.description,
            link: form.link,
            reward: Number(form.reward),
        };

        if (isEdit && form.id) {
            dataToSend.id = form.id;
        }

        try {
            await saveTask(dataToSend, isEdit);
            onClose();
            location.reload();
        } catch (err) {
            console.error('Ошибка при сохранении:', err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    {taskToEdit ? 'Редактировать задачу' : 'Добавить задачу'}
                </h2>
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
                        <label>Ссылка на задачу</label>
                        <input
                            type="text"
                            name="link"
                            value={form.link}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Награда</label>
                        <input
                            type="number"
                            name="reward"
                            value={form.reward}
                            onChange={handleChange}
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
                                !form.reward ||
                                !form.link
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

export default AddTaskModal;
