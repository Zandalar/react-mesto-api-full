import React from 'react';
import useValidator from '../hooks/useValidator';

function Login({ onLogin, isLoading }) {
  const { values, errors, isValid, handleChange, resetForm } = useValidator();
  const focus = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(
      values.email,
      values.password
    )
  }

  React.useEffect(() => {
    resetForm();
    setTimeout(() => {focus.current.focus()}, 0)
  }, []);

  return (
    <div className='login'>
      <h2 className='login__title'>Вход</h2>
      <form className='login__form' onSubmit={handleSubmit}>
        <input
          ref={focus}
          className='login__input'
          id='login__email'
          name='email'
          type='email'
          placeholder='Email'
          onChange={handleChange}
          value={values.email || ''}
          required
        />
        <span
          className='login__error'
          id='email__error'>
          {errors.email || ''}
        </span>
        <input
          className='login__input'
          id='login__password'
          name='password'
          type='password'
          placeholder='Пароль'
          onChange={handleChange}
          value={values.password || ''}
          required
        />
        <span
          className='login__error'
          id='email__error'>
          {errors.password || ''}
        </span>
        <button
          className={`login__button ${!isValid && 'login__button_disabled'}`}
          id='login__submit-button'
          type='submit'>
          {`${isLoading ? 'Войти' : 'Вход...'}`}
        </button>
      </form>
    </div>
  )
}

export default Login;
