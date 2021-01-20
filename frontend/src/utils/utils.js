export const BASE_URL = 'https://auth.nomoreparties.co';
// export const BASE_URL = 'https://api.fernandes.students.nomoredomains.rocks';

export function checkResponse(res) {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(res);
}
