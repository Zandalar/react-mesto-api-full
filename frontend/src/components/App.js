import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as api from '../utils/api';
import * as auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletionCardPopup from './DeletionCardPopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import NotFound from './NotFound';
import MenuMobile from './MenuMobile';

function App() {
	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
	const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
	const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
	const [isDeletionCardPopupOpen, setIsDeletionCardPopupOpen] = React.useState(false);
	const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
	const [isMobileMenuOpened, setIsMobileMenuOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
	const [selectedCard, setSelectedCard] = React.useState({});
	const [currentUser, setCurrentUser] = React.useState({});
	const [cards, setCards] = React.useState([]);
	const [loggedIn, setLoggedIn] = React.useState(false);
	const [status, setStatus] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  const [token, setToken] = React.useState('');
  const history = useHistory();

	function handleCardLike(card) {
    const isLiked = card.likes.some(item => item === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
      const newCards = cards.map((data) => data._id === card._id ? newCard : data);
      setCards(newCards);
    })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id, token).then(() => {
      const newCards = cards.filter(item => item !== card);
      setCards(newCards);
    })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleUpdateUser(user) {
	  setIsLoading(true);
    api.setUserInfo(user, token)
      .then((res) => {
        setCurrentUser(res);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleUpdateAvatar(link) {
    setIsLoading(true);
    api.editAvatar(link, token)
      .then((res) => {
        setCurrentUser(res);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api.setNewCard(data, token)
      .then((res) => {
        setCards([res, ...cards]);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleRegister(email, password) {
    setIsLoading(true);
    auth.register(email, password)
      .then((data) => {
        setEmail(data.email)
        setStatus(true);
        setIsLoading(false);
        history.push('/sign-in');
      })
      .catch((err) => {
        setStatus(false);
        if (err.status === 400) {
          setErrorText('Некорректно заполнено одно из полей');
        } else {
          setErrorText(`Ошибка: ${err.status}`);
        }
      })
      .finally(() => {
        setIsInfoTooltipPopupOpen(true);
      })
  }

  function handleLogin(email, password) {
    setIsLoading(true);
    setIsMobileMenuOpened(false);
    auth.authorize(email, password)
      .then(data => {
        localStorage.setItem('jwt', data.token);
        setToken(data.token);
        setLoggedIn(true);
        setStatus(true);
        setIsLoading(false);
        history.push('/');
      })
      .catch((err) => {
        setStatus(false);
        setIsInfoTooltipPopupOpen(true)
        if (err.status === 400) {
          setErrorText('Не передано одно из полей');
        } else if (err.status === 401) {
          setErrorText('Пользователь не найден, либо неверно указаны данные.');
        } else {
          setErrorText(`Ошибка: ${err.status}`);
        }
      })
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    history.push('/sign-in');
    setLoggedIn(false);
  }

  function getToken() {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      setToken(jwt);
      auth.checkToken(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          history.push('/');
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log('Токен не передан или передан не в том формате')
          }
          console.log(new Error(err.status))
        })
    }
  }

	function handleEditProfileClick() {
		setIsEditProfilePopupOpen(true);
	}

	function handleAddPlaceClick() {
		setIsAddPlacePopupOpen(true);
	}

	function handleEditAvatarClick() {
		setIsEditAvatarPopupOpen(true);
	}

	function handleCardClick(data) {
		setSelectedCard(data);
		setIsImagePopupOpen(true);
	}

  function handleDeletionCardClick(data) {
    setSelectedCard(data);
    setIsDeletionCardPopupOpen(true);
  }

  function handleMenuClick() {
	  isMobileMenuOpened
      ? setIsMobileMenuOpened(false)
      : setIsMobileMenuOpened(true);
  }

  function handleEscClick(evt) {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  }

	function closeAllPopups() {
		setIsEditProfilePopupOpen(false);
		setIsAddPlacePopupOpen(false);
		setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeletionCardPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
		setSelectedCard({});
	}

  function isolatePopup(evt) {
    evt.stopPropagation();
  }

  React.useEffect(() => {
    setIsLoading(true);
    if (loggedIn) {
      const promises = [api.getUserInfo(token), api.getInitialCards(token)];
      Promise.all(promises)
        .then((res) => {
          const [userData, cardsList] = res;
          setCurrentUser(userData.data)
          setCards(cardsList);
        })
        .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
        .finally(() => setIsLoading(false))
    }
  }, [loggedIn])

  React.useEffect(() => {
    getToken();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    window.addEventListener('keydown', handleEscClick);
    return () => {
      window.removeEventListener('keydown', handleEscClick);
    }
  })

	return (
	  <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <div className='content'>
          {isMobileMenuOpened && loggedIn && <MenuMobile userEmail={email} handleLogout={handleLogout} />}
          <Header
            userEmail={email}
            handleLogout={handleLogout}
            handleMenuClick={handleMenuClick}
            isMenuOpened={isMobileMenuOpened}
          />
          <Switch>
            <ProtectedRoute
              exact path='/'
              component={Main}
              loggedIn={loggedIn}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleDeletionCardClick}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              isLoading={isLoading}
            />
            <Route exact path='/sign-up'>
              <Register
                onRegister={handleRegister}
                isLoading={isLoading}
              />
            </Route>
            <Route exact path='/sign-in'>
              <Login
                onLogin={handleLogin}
                isLoading={isLoading}
              />
            </Route>
            <Route>
              { loggedIn
                ? <Redirect to='/' />
                : <Redirect to='/sign-in' />}
            </Route>
            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
            isolatePopup={isolatePopup}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
            isolatePopup={isolatePopup}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
            isolatePopup={isolatePopup}
          />
          <ImagePopup
            name='image'
            data={selectedCard}
            onClose={closeAllPopups}
            isOpen={isImagePopupOpen}
            isolatePopup={isolatePopup}
          />
          <DeletionCardPopup
            isOpen={isDeletionCardPopupOpen}
            onClose={closeAllPopups}
            handleSubmit={handleCardDelete}
            card={selectedCard}
            isLoading={isLoading}
            isolatePopup={isolatePopup}
          />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            isolatePopup={isolatePopup}
            status={status}
            errorText={errorText}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
	);
}

export default App;
