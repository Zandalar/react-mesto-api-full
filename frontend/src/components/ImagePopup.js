import React from 'react';

function ImagePopup({ name, data, onClose, isOpen, isolatePopup }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen && 'popup_opened'}`} id='popup__image' onClick={onClose}>
      <div className='popup__container_image' onClick={isolatePopup}>
        <img className='popup__image' src={data.link} alt={data.name} />
        <h2 className='popup__title_image'>{data.name}</h2>
        <button className='popup__button-close' id='image__button-close' type='button' onClick={onClose} />
      </div>
    </div>
  )
}

export default ImagePopup;
