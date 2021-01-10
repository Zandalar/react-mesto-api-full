import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';
import useValidator from '../hooks/useValidator';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading, isolatePopup }) {
  const { values, errors, isValid, handleChange } = useValidator();
  const currentUser = React.useContext(CurrentUserContext);
  const focus = React.useRef();

  React.useEffect(() => {
    setTimeout(() => { focus.current.focus() }, 100)
  }, [isOpen]);

  React.useEffect(() => {
    values.name = currentUser.name;
    values.about = currentUser.about;
  }, [currentUser]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name: values.name,
      about: values.about,
    });
  }

  return (
    <PopupWithForm
      name='profile'
      title='Редактировать профиль'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isolatePopup={isolatePopup}
    >
      <input
        ref={focus}
        className='popup__field'
        id='profile__name'
        name='name'
        type='text'
        value={values.name || ''}
        minLength='2'
        maxLength='40'
        onChange={handleChange}
        required
      />
      <span
        className='popup__field-error'
        id='profile__name-error'>
        {errors.name || ''}
      </span>
      <input
        className='popup__field'
        id='profile__description'
        name='about'
        type='text'
        value={values.about || ''}
        minLength='2'
        maxLength='200'
        onChange={handleChange}
        required
      />
      <span
        className='popup__field-error'
        id='profile__description-error'>
        {errors.about || ''}
      </span>
      <button
        className={`popup__button-save ${!isValid && 'popup__button-save_disabled'}`}
        id='profile__button-save'
        type='submit'>
        {`${isLoading ? 'Сохранение...' : 'Сохранить'}`}
      </button>
    </PopupWithForm>
  )
}

export default EditProfilePopup;
