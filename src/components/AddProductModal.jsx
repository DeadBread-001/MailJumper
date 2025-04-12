import React, { useState, useEffect, useRef } from "react";
import "../styles/addProductModal.scss";
import {saveProduct} from "../api/admin";

const ExtraFields = ({ productType, form, handleChange }) => {
  if (productType === "promocode") {
    return (
      <>
        <div className="form-group">
          <label>Компания</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Код</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Активен до</label>
          <input
            type="date"
            name="active_to"
            value={form.active_to}
            onChange={handleChange}
          />
        </div>
      </>
    );
  }

  return null;
};

const AddProductModal = ({ isOpen, onClose, productToEdit }) => {
  const [productType, setProductType] = useState("basic");
  const [form, setForm] = useState({
    id: "",
    name: "",
    photo_link: "",
    description: "",
    price: "",
    count: "",
    activation_link: "",
    code: "",
    active_to: "",
    company: "",
  });

  const titleRef = useRef(null);

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      photo_link: "",
      description: "",
      price: "",
      count: "",
      activation_link: "",
      code: "",
      active_to: "",
      company: "",
    });
    setProductType("merch");
  };

  useEffect(() => {
    if (productToEdit) {
      setForm({
        id: productToEdit.id || "",
        name: productToEdit.name || "",
        photo_link: productToEdit.photo_link || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        count: productToEdit.count || "",
        activation_link: productToEdit.activation_link || "",
        code: productToEdit.code || "",
        active_to: productToEdit.active_to || "",
        company: productToEdit.company || "",
      });
      setProductType(productToEdit.productType || "merch");
      titleRef.current?.focus();
    } else {
      resetForm();
    }
  }, [isOpen, productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price) {
      console.warn("Заполните обязательные поля");
      return;
    }

    const isEdit = !!productToEdit;

    const dataToSend = {
      name: form.name,
      description: form.description,
      price: form.price,
      count: form.count,
      activation_link: form.activation_link,
      photo_link: form.photo_link,
      productType,
    };

    if (isEdit && form.id) {
      dataToSend.id = form.id;
    }

    if (productType === "promocode") {
      dataToSend.code = form.code;
      dataToSend.active_to = form.active_to;
      dataToSend.company = form.company;
    }

    try {
      await saveProduct(dataToSend, isEdit, productType);
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении:", err.message);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{productToEdit ? "Редактировать товар" : "Добавить товар"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Тип товара</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="merch">Мерч</option>
              <option value="promocode">Промокоды</option>
            </select>
          </div>

          <div className="form-group">
            <label>Название</label>
            <input
              ref={titleRef}
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
              name="photo_link"
              value={form.photo_link}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Количество</label>
            <input
              type="number"
              name="count"
              value={form.count}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Цена</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ссылка на справку</label>
            <input
              type="text"
              name="activation_link"
              value={form.activation_link}
              onChange={handleChange}
            />
          </div>

          <ExtraFields
            productType={productType}
            form={form}
            handleChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={!form.name || !form.description || !form.price}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
