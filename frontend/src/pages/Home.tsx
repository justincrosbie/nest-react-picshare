import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, message, Spin, Alert } from 'antd';
import PictureCard from '../components/PictureCard';
import ImageModal from '../components/ImageModal';
import { Picture } from '../interfaces/picture';
import { getPictures, getPicturesSecure, toggleFavorite } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { usePictureContext } from '../contexts/PictureContext';

const Home: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2); // Initial load fetches page 1, so start at 2
  const { user } = useAuth();
  const { onPictureAdded } = usePictureContext();

  const fetchPictures = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = user ? await getPicturesSecure(pageNumber) : await getPictures(pageNumber);
      setPictures(prevPictures => [...prevPictures, ...data]); // Append new pictures
    } catch (error) {
      console.error('Failed to fetch Pictures:', error);
      message.error('Failed to load pictures. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setPictures([]); // Clear the pictures
    fetchPictures(1); // Re-fetch pictures when `refreshPictures` changes
  }, [onPictureAdded]);


  const fetchMorePictures = useCallback(async () => {
    fetchPictures(page);
    setPage(prevPage => prevPage + 1);
  }, [fetchPictures, page]);


  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchMorePictures();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMorePictures]);

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

  const alertMessage = (
    <span>
      <Link to="/login">login</Link> to start sharing your favorite pictures with others!
    </span>
  );

  return (
    <div style={{ height: '100vh' }}>
      <Spin spinning={loading && page === 1} tip="Loading pictures..."/>

      {!user &&
        <Alert message={alertMessage} 
        type="info"
        style={{
          backgroundColor: '#f0f0f0', // Light grey background
          border: 'none', // Remove border
          textAlign: 'center', // Center the text
          color: '#595959', // Grey text color
        }}
        />
      }

      <br/>

      <Row gutter={[16, 16]} justify={'center'}>
          {pictures.map(picture => (
            <Col key={picture.id} flex={1} style={{ maxWidth: 300, margin: '0px 12px' }}
            >
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
          title={selectedPicture.title + ' ' + formatDate(selectedPicture.createdAt)}
          onClose={() => setSelectedPicture(null)}
        />
      )}
    </div>
  );
};

export default Home;
