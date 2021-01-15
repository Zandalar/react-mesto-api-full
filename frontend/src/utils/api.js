import { BASE_URL, checkResponse } from './utils';

export function getUserInfo(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(checkResponse);
}

export function setUserInfo(data, token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      about: data.about,
    }),
  })
    .then(checkResponse);
}

export function getInitialCards(token) {
  return fetch(`${BASE_URL}/cards`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(checkResponse);
}

export function setNewCard(data, token) {
  return fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      link: data.link,
    }),
  })
    .then(checkResponse);
}

export function changeLikeCardStatus(id, isLiked, token) {
  return fetch(`${BASE_URL}/cards/${id}/likes`, {
    method: `${isLiked ? 'PUT' : 'DELETE'}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(checkResponse);
}

export function deleteCard(id, token) {
  return fetch(`${BASE_URL}/cards/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(checkResponse);
}

export function editAvatar(data, token) {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then(checkResponse);
}
