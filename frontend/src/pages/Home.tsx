import React, { useState } from 'react';
import { Row, Col, message, Spin, Alert } from 'antd';
import PictureCard from '../components/PictureCard';
import ImageModal from '../components/ImageModal';
import { Picture } from '../interfaces/picture';
import { getPictures, getPicturesSecure, toggleFavorite } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatDate } from '../utils/formatDate';

const Home: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const fetchPictures = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = user ? await getPicturesSecure(pageNumber) : await getPictures(pageNumber);
      setPictures(prevPictures => [...prevPictures, ...data]); // Append new pictures
      setPage(pageNumber + 1);
    } catch (error) {
      console.error('Failed to fetch Pictures:', error);
      message.error('Failed to load pictures. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePictures = () => {
      fetchPictures(page);
      setPage(page + 1);
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

  const alertMessage = (
    <span>
      <Link to="/login">login</Link> to start sharing your favorite pictures with others!
    </span>
  );

  return (
    <div style={{ padding: '84px', height: '100vh' }}>
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

      <InfiniteScroll
        dataLength={pictures.length} //This is important field to render the next data
        next={fetchMorePictures}
        hasMore={true}
        loader={<h4>Loading pictures...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={fetchMorePictures}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        <Row gutter={[16, 16]} justify="center">
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
      </InfiniteScroll>

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
