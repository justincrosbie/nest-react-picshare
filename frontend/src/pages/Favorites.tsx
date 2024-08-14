import React, { useState, useEffect } from 'react';
import { Row, Col, message, Spin } from 'antd';
import PictureCard from '../components/PictureCard';
import ImageModal from '../components/ImageModal';
import { Picture } from '../interfaces/picture';
import { getFavorites, toggleFavorite } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Picture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      message.error('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (id: number) => {
    try {
      await toggleFavorite(id);
      setFavorites(favorites.filter(pic => pic.id !== id));
      message.success('Favorite removed successfully');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error('Failed to update favorite. Please try again.');
    }
  };

  return (
    <div style={{ padding: '24px', height: '100vh' }}>

      <Spin spinning={loading} tip="Loading pictures..."/>

      <h2>Your saved pictures</h2>
      <Row gutter={[16, 16]}>
        {favorites.map(picture => (
          <Col xs={24} sm={12} md={8} lg={6} key={picture.id}>
            <PictureCard
              {...picture}
              user={user ? user : undefined}
              isFavorite={true}
              isLoggedIn={!!user}
              onFavoriteToggle={handleFavoriteToggle}
              onImageClick={() => setSelectedPicture(picture)}
            />
          </Col>
        ))}
      </Row>
      {selectedPicture && (
        <ImageModal
          visible={!!selectedPicture}
          imageUrl={selectedPicture.url}
          title={selectedPicture.title}
          onClose={() => setSelectedPicture(null)}
        />
      )}
    </div>
  );
};

export default Favorites;
