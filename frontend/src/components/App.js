import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
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
import * as auth from '../utils/Auth';
import NotFound from './notFound';
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
  const history = useHistory();

	function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
      const newCards = cards.map((data) => data._id === card._id ? newCard : data);
      setCards(newCards);
    })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      const newCards = cards.filter(item => item !== card);
      setCards(newCards);
    })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleUpdateUser(user) {
	  setIsLoading(true);
    api.setUserInfo(user)
      .then((res) => {
        setCurrentUser(res);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleUpdateAvatar(link) {
    setIsLoading(true);
    api.editAvatar(link)
      .then((res) => {
        setCurrentUser(res);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api.setNewCard(data)
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
        history.push('/signin');
        setIsLoading(false);
      })
      .catch((err) => {
        setStatus(false);
        if (err.status === 400) {
          setErrorText('Некорректно заполнено одно из полей');
        } else {
          setErrorText(err.status);
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
        localStorage.setItem('jwt', data.token)
        setLoggedIn(true);
        history.push('/');
        setStatus(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setStatus(false);
        setIsInfoTooltipPopupOpen(true)
        if (err.status === 400) {
          setErrorText('Не передано одно из полей');
        } else if (err.status === 401) {
          setErrorText('Пользователь не найден, либо неверно указаны данные.');
        } else {
          setErrorText(err.status);
        }
      })
  }

  function getToken() {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
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

  function handleLogout() {
    localStorage.removeItem('jwt');
    history.push('/signin');
    setLoggedIn(false);
  }

  React.useEffect(() => {
    setIsLoading(true);
    if (loggedIn) {
      const promises = [api.getUserInfo(), api.getInitialCards()];
      Promise.all(promises)
        .then((res) => {
          const [userData, cardsList] = res;
          setCurrentUser(userData)
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
          <Header userEmail={email} handleLogout={handleLogout} handleMenuClick={handleMenuClick}  isMenuOpened={isMobileMenuOpened} />
          <Switch>
            <Route exact path='/'>
              <ProtectedRoute
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
            </Route>
            <Route path='/signup'>
              <Register
                onRegister={handleRegister}
                isLoading={isLoading}
              />
            </Route>
            <Route path='/signin'>
              <Login
                onLogin={handleLogin}
                isLoading={isLoading}
              />
            </Route>
            <Route exact path='/'>
              { loggedIn
                ? <Redirect to='/' />
                : <Redirect to='/signin' />}
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
