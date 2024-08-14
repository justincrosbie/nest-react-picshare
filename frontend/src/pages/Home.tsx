import React, { useState, useEffect } from 'react';
import { Row, Col, message, Spin } from 'antd';
import PictureCard from '../components/PictureCard';
import ImageModal from '../components/ImageModal';
import { Picture } from '../interfaces/picture';
import { getPictures, getPicturesSecure, toggleFavorite } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPictures();
  }, [user]);

  const fetchPictures = async () => {
    console.log('fetchPictures, user is:', user);

    setLoading(true);
    try {
      const data = user ? await getPicturesSecure() : await getPictures();
      setPictures(data);
    } catch (error) {
      console.error('Failed to fetch Pictures:', error);
      message.error('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (id: number) => {
    try {
      await toggleFavorite(id);
      const updatedPictures = pictures.map(picture => 
        picture.id === id ? { ...picture, isFavorite: !picture.isFavorite } : picture
      );
      setPictures(updatedPictures);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error('Failed to update favorite. Please try again.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>

      <Spin spinning={loading} tip="Loading pictures..."/>

      <Row gutter={[16, 16]}>
        {pictures.map(picture => (
          <Col xs={24} sm={12} md={8} lg={6} key={picture.id}>
            <PictureCard
              {...picture}
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

export default Home;
