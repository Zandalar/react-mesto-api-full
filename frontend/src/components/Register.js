import React from 'react';
import { Link } from 'react-router-dom';
import useValidator from '../hooks/useValidator';

function Register({ onRegister, isLoading }) {
  const { values, errors, isValid, handleChange, resetForm } = useValidator();
  const focus = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(
      values.email,
      values.password
    )
  }

  React.useEffect(() => {
    resetForm();
    setTimeout(() => {focus.current.focus()}, 0)
  }, []);

  return (
    <div className='register'>
      <h2 className='register__title'>Регистрация</h2>
      <form className='register__form' onSubmit={ handleSubmit }>
        <input
          ref={focus}
          className='register__input'
          id='register__email'
          name='email'
          type='email'
          placeholder='Email'
          onChange={handleChange}
          value={values.email || ''}
          required
        />
        <span
          className='register__error'
          id='email__error'>
          {errors.email || ''}
        </span>
        <input
          className='register__input'
          id='register__password'
          name='password'
          type='password'
          placeholder='Пароль'
          minLength='3'
          maxLength='20'
          onChange={handleChange}
          value={values.password || ''}
          required
        />
        <span
          className='register__error'
          id='password__error'>
          {errors.password || ''}
        </span>
        <button
          className={`register__button ${!isValid && 'register__button_disabled'}`}
          id='login__submit-button'
          type='submit'>
          {`${isLoading ? 'Зарегистрироваться' : 'Регистрация...'}`}
        </button>
      </form>
      <p className='register__subtitle'>
        Уже зарегистрированы?&ensp;
        <Link to='/sign-in' className='register__link'>Войти</Link>
      </p>
    </div>
  )
}

export default Register;
