import React from 'react';
import PopupWithForm from './PopupWithForm';

function DeletionCardPopup({ isOpen, onClose, handleSubmit, card, isLoading, isolatePopup }) {

  function submitDeletion(evt) {
    evt.preventDefault();
    handleSubmit(card);
    onClose();
  }

  return (
    <PopupWithForm
      name='delete'
      title='Вы уверены?'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitDeletion}
      isolatePopup={isolatePopup}>
      <button
        className='popup__button-save'
        id='deletion__button-save'
        type='submit'>
        {`${isLoading ? 'Удаление...' : 'Да'}`}
      </button>
    </PopupWithForm>

  )
}

export default DeletionCardPopup;
