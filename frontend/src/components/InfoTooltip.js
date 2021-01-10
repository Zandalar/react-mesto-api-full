import React from 'react';
import okLogo from '../images/reg_ok.svg';
import errorLogo from '../images/reg_error.svg';

function InfoTooltip({ isOpen, onClose, isolatePopup, status, errorText }) {
  return (
    <div className={`popup popup_type_info ${isOpen && 'popup_opened'}`} id='popup__info' onClick={onClose}>
      <div className='popup__container' onClick={isolatePopup}>
        <button className='popup__button-close' id='info__button-close' type='button' onClick={onClose} />
          {status
            ? <img src={okLogo} alt='Успешно' className='popup__status' />
            : <img src={errorLogo} alt='Ошибка' className='popup__status' />
          }
        <h2 className='popup__status-title'>
          {status
            ? 'Вы успешно зарегистрировались!'
            : errorText
          }
        </h2>
      </div>
    </div>
  )
}

export default InfoTooltip;
