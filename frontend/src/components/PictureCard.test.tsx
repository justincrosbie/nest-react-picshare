import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PictureCard from '../components/PictureCard';

describe('PictureCard Component', () => {
  const mockProps = {
    id: 1,
    title: 'Test Picture',
    url: 'https://example.com/test.jpg',
    user: { id: 1, username: 'testuser' },
    createdAt: '2024-08-15T12:00:00Z',
    isFavorite: false,
    isLoggedIn: true,
    onFavoriteToggle: jest.fn(),
    onImageClick: jest.fn(),
  };

  it('renders correctly with given props', () => {
    render(<PictureCard {...mockProps} />);
    
    expect(screen.getByText('Test Picture')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('15/08/2024')).toBeInTheDocument();
    expect(screen.getByAltText('Test Picture')).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  it('displays HeartOutlined icon when isFavorite is false', () => {
    render(<PictureCard {...mockProps} />);
    const heartOutlined = screen.getByLabelText('heart'); // Assuming the icon has the aria-label of 'heart'
    expect(heartOutlined).toBeInTheDocument();
  });

  it('displays HeartFilled icon when isFavorite is true', () => {
    render(<PictureCard {...mockProps} isFavorite={true} />);
    const heartFilled = screen.getByLabelText('heart');
    expect(heartFilled).toBeInTheDocument();
    expect(heartFilled).toHaveStyle('color: red');
  });

  it('calls onFavoriteToggle when the heart icon is clicked', () => {
    render(<PictureCard {...mockProps} />);
    const heartIcon = screen.getByLabelText('heart');
    fireEvent.click(heartIcon);
    expect(mockProps.onFavoriteToggle).toHaveBeenCalledWith(mockProps.id);
  });

  it('does not display heart icon when not logged in', () => {
    render(<PictureCard {...mockProps} isLoggedIn={false} />);
    expect(screen.queryByLabelText('heart')).not.toBeInTheDocument();
  });
});
