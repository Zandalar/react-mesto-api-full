import React from 'react';
import Preloader from './Preloader';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ cards, onCardLike, onCardDelete, onCardClick, onEditAvatar, onEditProfile, onAddPlace, isLoading }) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className='main'>
      <section className='profile'>
        <div className='profile__avatar-container'>
          <button className='profile__button-avatar' id='avatar__button-edit' type='button' onClick={onEditAvatar} />
          <img className='profile__avatar' id='avatar' src={currentUser.avatar} alt='Фото профиля' />
        </div>
        <div className='profile__info'>
          <h1 className='profile__info_name'>{currentUser.name}</h1>
          <button className='profile__info_button-edit' id='button-edit' name='button-edit' type='button' onClick={onEditProfile} />
          <h2 className='profile__info_about'>{currentUser.about}</h2>
        </div>
        <button className='profile__button-add' id='button-add' name='button-add' type='button' onClick={onAddPlace} />
      </section>

      <section className='elements'>
        <ul className='element__table'>
          {isLoading
            ? <Preloader />
            : cards.map(data => {
              return (
                <Card key={data._id} data={data} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>
              )
            })
          }
        </ul>
      </section>
    </main>
  )
}

export default Main;
