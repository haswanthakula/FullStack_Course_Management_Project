import axios from 'axios';

const API_URL = 'http://localhost:8080/api/courses';

const courseService = {
	getTopCourses: async () => {
		const response = await axios.get(`${API_URL}/top`);
		return response.data;
	},
	getAllCourses: async () => {
		const response = await axios.get(API_URL);
		return response.data;
	},

	getCoursesPaginated: async (page = 0, size = 10) => {
		const response = await axios.get(`${API_URL}/paginated?page=${page}&size=${size}`);
		return response.data;
	},

	getCourseById: async (id) => {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	},

	getCoursesByCategory: async (category) => {
		const response = await axios.get(`${API_URL}/category/${category}`);
		return response.data;
	},

	getCoursesByLevel: async (level) => {
		const response = await axios.get(`${API_URL}/level/${level}`);
		return response.data;
	},

	getCoursesByLanguage: async (language) => {
		const response = await axios.get(`${API_URL}/language/${language}`);
		return response.data;
	},

	getCoursesByMaxPrice: async (maxPrice) => {
		const response = await axios.get(`${API_URL}/price?maxPrice=${maxPrice}`);
		return response.data;
	}
};

export default courseService;