import React from 'react';
import { Route, Link } from 'react-router-dom';
import logo from '../images/header__logo.svg';
import menuImage from '../images/button__menu.svg';
import closeImage from '../images/button__close.svg'

function Header({ userEmail, handleLogout, handleMenuClick, isMenuOpened }) {

  return (
    <header className='header'>
      <img className='header__logo' src={logo} alt='Логотип сайта' />
      <div className='header__user-info'>
        <Route exact path='/signin'>
          <Link to='/signup' className='header__link'>Регистрация</Link>
        </Route>
        <Route exact path='/signup'>
          <Link to='/signin' className='header__link'>Войти</Link>
        </Route>
        <Route exact path='/'>
          <p className='header__email'>{userEmail}</p>
          <button
            onClick={handleLogout}
            className='header__logout'
            type='button'>
            Выйти
          </button>
          <button
            onClick={handleMenuClick}
            className='header__menu'
            type='button'>
            <img
              className='header__image'
              src={isMenuOpened ? closeImage : menuImage}
              alt='Menu'/>
          </button>
        </Route>
      </div>
    </header>
  )
}

export default Header;
