// export const BASE_URL = 'http://localhost:3000';
export const BASE_URL = 'https://api.masich.students.nomoredomains.rocks';

export function checkResponse(res) {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(res);
}
