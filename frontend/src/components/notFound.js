import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return(
    <>
      <div className='error'>
        <p className='error__text'>E<span>r</span>ror</p>
        <p className='error__number'>4<span>0</span><span>4</span></p>
      </div>
      <p className='error__message'>Такая страница не найдена или никогда не существовала</p>
      <Link className='error__link' to='/'>&#8920; Вернуться</Link>
    </>
  )
}

export default NotFound;
