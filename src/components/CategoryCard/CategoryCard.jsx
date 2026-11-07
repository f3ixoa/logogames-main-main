import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
  return (
    <button
      className="category-card"
      onClick={() => onClick(category)}
    >
      <div className="category-card__icon-wrapper">
        <div className="category-card__icon">{category.icon}</div>
      </div>
      <div className="category-card__title">{category.title}</div>
    </button>
  );
};

export default CategoryCard;
