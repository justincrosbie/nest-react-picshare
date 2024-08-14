import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  it('renders the Home page by default', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login to start sharing/i)).toBeInTheDocument(); // Assuming this text is in the Home component
  });

  it('renders the Login page when navigating to /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login to start sharing/i)).toBeInTheDocument(); // Assuming this text is in the Login component
  });

  it('renders the Favorites page when navigating to /favorites', () => {
    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/favorites/i)).toBeInTheDocument(); // Assuming this text is in the Favorites component
  });

  it('renders the AddPicture page when navigating to /add-picture', () => {
    render(
      <MemoryRouter initialEntries={['/add-picture']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/add a new picture/i)).toBeInTheDocument(); // Assuming this text is in the AddPicture component
  });
});