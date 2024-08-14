import React from 'react';
import { Card } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

interface User {
    id: number;
    username: string;
}
  
interface PictureCardProps {
  id: number;
  title: string;
  user?: User;
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

  const subtitle = `${user?.username} ${createdAt}`;

  return (
    <Card
      hoverable
      cover={<img alt={title} src={url} onClick={() => onImageClick(id)} />}
      actions={[
        isFavorite ? (
          isLoggedIn && <HeartFilled style={{color: 'red'}} key="favorite" onClick={() => onFavoriteToggle(id)} />
        ) : (
            isLoggedIn && <HeartOutlined key="favorite" onClick={() => onFavoriteToggle(id)} />
        ),
      ]}
    >
      <Card.Meta title={title} description={subtitle} />
    </Card>
  );
};

export default PictureCard;
