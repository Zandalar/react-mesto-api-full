import React from 'react';
import PopupWithForm from './PopupWithForm';
import useValidator from '../hooks/useValidator';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading, isolatePopup }) {
  const { values, errors, isValid, handleChange, resetForm } = useValidator();
  const focus = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({
      name: values.name,
      link: values.link
    });
  }

  React.useEffect(() => {
    resetForm();
    setTimeout(() => { focus.current.focus() }, 100)
  }, [isOpen]);

  return (
    <PopupWithForm
      name='place'
      title='Новое место'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isolatePopup={isolatePopup}
    >
    <input
      ref={focus}
      className='popup__field'
      id='place__name'
      name='name'
      type='text'
      placeholder='Название'
      minLength='2'
      maxLength='30'
      value={values.name || ''}
      onChange={handleChange}
      required
    />
    <span
      className='popup__field-error'
      id='place__name-error'>
      {errors.name || ''}
    </span>
    <input
      className='popup__field'
      id='place__link'
      name='link'
      type='url'
      placeholder='Ссылка на картинку'
      value={values.link || ''}
      onChange={handleChange}
      required
    />
    <span
      className='popup__field-error'
      id='place__link-error'>
      {errors.link || ''}
    </span>
    <button
      className={`popup__button-save ${!isValid && 'popup__button-save_disabled'}`}
      id='place__button-save'
      type='submit'
      disabled={!isValid}>
      {`${isLoading ? 'Загрузка...' : 'Создать'}`}
    </button>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
