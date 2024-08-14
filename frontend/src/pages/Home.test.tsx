import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { useAuth } from '../contexts/AuthContext';
import { getPictures, getPicturesSecure, toggleFavorite } from '../services/api';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the necessary functions and modules
jest.mock('../contexts/AuthContext');
jest.mock('../services/api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetPictures = getPictures as jest.Mock;
const mockGetPicturesSecure = getPicturesSecure as jest.Mock;
const mockToggleFavorite = toggleFavorite as jest.Mock;

describe('Home Component', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null });
    mockGetPictures.mockResolvedValue([]);
    mockGetPicturesSecure.mockResolvedValue([]);
    mockToggleFavorite.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the alert message when user is not logged in', () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByText(/login to start sharing your favorite pictures with others/i)).toBeInTheDocument();
  });

  it('renders pictures and handles infinite scroll', async () => {
    const mockPictures = [
      { id: 1, title: 'Picture 1', url: 'https://example.com/pic1.jpg', isFavorite: false, createdAt: '2024-08-15T12:00:00Z', user: { id: 1, username: 'user1' } },
      { id: 2, title: 'Picture 2', url: 'https://example.com/pic2.jpg', isFavorite: false, createdAt: '2024-08-15T12:00:00Z', user: { id: 2, username: 'user2' } },
    ];

    mockGetPictures.mockResolvedValue(mockPictures);

    render(
      <Router>
        <Home />
      </Router>
    );

    // Wait for pictures to load
    await screen.findByText('Picture 1');
    expect(screen.getByText('Picture 2')).toBeInTheDocument();

    // Simulate infinite scroll by calling the next function
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    await waitFor(() => expect(mockGetPictures).toHaveBeenCalledTimes(1));
  });

  it('toggles favorite on click', async () => {
    const mockPictures = [
      { id: 1, title: 'Picture 1', url: 'https://example.com/pic1.jpg', isFavorite: false, createdAt: '2024-08-15T12:00:00Z', user: { id: 1, username: 'user1' } },
    ];

    mockGetPictures.mockResolvedValue(mockPictures);

    render(
      <Router>
        <Home />
      </Router>
    );

    // Wait for picture to load
    await screen.findByText('Picture 1');

    // Simulate favorite toggle
    fireEvent.click(screen.getByLabelText('heart'));

    await waitFor(() => expect(mockToggleFavorite).toHaveBeenCalledWith(1));
  });

  it('shows the ImageModal when a picture is clicked', async () => {
    const mockPictures = [
      { id: 1, title: 'Picture 1', url: 'https://example.com/pic1.jpg', isFavorite: false, createdAt: '2024-08-15T12:00:00Z', user: { id: 1, username: 'user1' } },
    ];

    mockGetPictures.mockResolvedValue(mockPictures);

    render(
      <Router>
        <Home />
      </Router>
    );

    // Wait for picture to load
    await screen.findByText('Picture 1');

    // Simulate picture click
    fireEvent.click(screen.getByAltText('Picture 1'));

    expect(screen.getByText('Picture 1')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
