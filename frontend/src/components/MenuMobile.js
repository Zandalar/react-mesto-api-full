import React from 'react';

function MenuMobile({ userEmail, handleLogout }) {
  return (
    <div className='menu'>
      <p className='menu__email'>{userEmail}</p>
      <button onClick={handleLogout} className='menu__logout'>Выйти</button>
    </div>
  )
}

export default MenuMobile;
