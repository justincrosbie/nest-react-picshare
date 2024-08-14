import axios from 'axios';
import { User } from '../interfaces/user';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the user from localStorage
    const storedUser = localStorage.getItem('picshare_user');

    console.log('storedUser', storedUser);
    
    // If the token exists, add it to the Authorization header
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      config.headers['Authorization'] = `ID ${user.id}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPictures = async (pageNumber: number) => {
  const response = await api.get('/pictures?page=' + pageNumber);
  return response.data[0];
};

export const getPicturesSecure = async (pageNumber: number) => {
  const response = await api.get('/pictures/secure?page=' + pageNumber);
  return response.data[0];
};

export const getFavorites = async () => {
  console.log('getFavorites');
  const response = await api.get('/pictures/favorites');
  return response.data;
};

export const toggleFavorite = async (pictureId: number) => {
  const response = await api.post(`/pictures/${pictureId}/favorite`);
  return response.data;
};

export const addPicture = async (data: { title: string; url: string }) => {
  const response = await api.post('/pictures', data);
  return response.data;
};

export const login = async (username: string) => {
  const response = await api.post('/auth/login', { username });
  // Assuming the server returns a token upon successful login
  const user: User = {
    id: response.data.id,
    username,
  }

  localStorage.setItem('picshare_user', JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem('picshare_user');
};