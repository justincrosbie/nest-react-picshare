import React from 'react';
import { Card } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { formatDate } from '../utils/formatDate';

interface User {
    id: number;
    username: string;
}

interface PictureCardProps {
  id: number;
  title: string;
  user?: User | undefined;
  createdAt: string;
  url: string;
  isFavorite: boolean;
  isLoggedIn: boolean;
  onFavoriteToggle: (id: number) => void;
  onImageClick: (id: number) => void;
}

const PictureCard: React.FC<PictureCardProps> = ({
  id,
  title,
  url,
  user,
  createdAt,
  isFavorite,
  isLoggedIn,
  onFavoriteToggle,
  onImageClick,
}) => {
  return (
    <Card
      hoverable
      style={{ width: 300, height: 440 }}
      cover={
        <div style={{ padding: '10px' }}>
          <img 
            alt={title} 
            src={url} 
            onClick={() => onImageClick(id)} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '300px', 
              objectFit: 'contain' 
            }} 
          />
        </div>
      }
      actions={[]}
    >
      <Card.Meta
        title={title}
        description={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div>{user?.username}</div>
              <div style={{ fontSize: '12px', color: 'gray' }}>{formatDate(createdAt)}</div>
            </div>
            {isLoggedIn && (
              isFavorite ? (
                <HeartFilled style={{ color: 'red' }} onClick={() => onFavoriteToggle(id)} />
              ) : (
                <HeartOutlined onClick={() => onFavoriteToggle(id)} />
              )
            )}
          </div>
        }
      />
    </Card>
  );
};

export default PictureCard;