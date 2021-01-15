import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ data, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = data.owner === currentUser._id;
  const cardDeleteButtonClassName = (`element__button-delete ${isOwn ? 'element__button-delete_active' : ''}`);
  const isLiked = data.likes.some(item => item === currentUser._id);
  const cardLikeButtonClassName = 'element__button-like_active';

  function handleCardClick() {
		onCardClick(data);
	}

	function handleLikeClick() {
    onCardLike(data);
  }

  function handleDeleteClick() {
    onCardDelete(data);
  }

	return (
		<li className='element' id={data._id}>
			<button className={cardDeleteButtonClassName} type='button' onClick={handleDeleteClick}>
				<div className='element__button-delete_top' />
				<div className='element__button-delete_bottom' />
			</button>
			<img className='element__photo' src={data.link} alt={data.name} onClick={handleCardClick} />
				<div className='element__description'>
					<h2 className='element__title'>{data.name}</h2>
					<div className='element__like-container'>
						<button className={`element__button-like ${isLiked && cardLikeButtonClassName}`} type='button' onClick={handleLikeClick} />
						<div className='element__like-count'>{data.likes.length}</div>
					</div>
				</div>
		</li>
	)
}

export default Card;
