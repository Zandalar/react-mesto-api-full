export const BASE_URL = 'https://api.zandalar.students.nomoreparties.xyz';

export function checkResponse(res) {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(res);
}
