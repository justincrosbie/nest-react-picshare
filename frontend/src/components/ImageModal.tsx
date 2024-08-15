import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './ImageModal.css';

interface ImageModalProps {
  visible: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ visible, imageUrl, title, onClose }) => {
  return (
    <Modal
      open={visible}
      title={<span style={{ color: '#fff' }}>{title}</span>} // Title with white text color
      footer={null}
      onCancel={onClose}
      width="80%"
      bodyStyle={{ backgroundColor: '#000' }} // Set the background color of the modal content to black
      style={{
        top: 20,
        backgroundColor: '#000',
        color: '#fff',
        border: 'none', // Remove the border from the modal itself
        boxShadow: 'none', // Remove any shadow if present
      }}
      className='custom-modal' // Add a custom class to the modal
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />} // Set the close icon color to white
    >
      <div style={{ textAlign: 'center' }}>
        <img alt={title} src={imageUrl} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
      </div>
    </Modal>
  );
};

export default ImageModal;