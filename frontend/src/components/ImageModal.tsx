import React from 'react';
import { Modal } from 'antd';

interface ImageModalProps {
  visible: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ visible, imageUrl, title, onClose }) => {
  return (
    <Modal
      visible={visible}
      title={title}
      footer={null}
      onCancel={onClose}
      width="80%"
    >
      <img alt={title} src={imageUrl} style={{ width: '100%' }} />
    </Modal>
  );
};

export default ImageModal;
