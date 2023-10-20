import axios from 'axios';

export const BASE_URL = 'https://planner.rdclr.ru/api/';
export const API_TOKEN = localStorage.getItem('token');

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
	},
});

export const apiToken = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
		Authorization: `Bearer ${API_TOKEN}`,
	},
});

export const apiTokenUploadImage = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${API_TOKEN}`,
	},
});
