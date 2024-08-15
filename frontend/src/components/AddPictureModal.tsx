import React from 'react';
import { Modal } from 'antd';
import AddPicture from './AddPicture';

interface AddPictureModalProps {
  visible: boolean;
  onClose: () => void;
  onPictureAdded: () => void; // Add a callback prop
}

const AddPictureModal: React.FC<AddPictureModalProps> = ({ visible, onClose, onPictureAdded }) => {
  return (
    <Modal
      title="Share a New Picture"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <AddPicture onClose={onClose} onPictureAdded={onPictureAdded} /> {/* Pass the onPictureAdded prop */}
    </Modal>
  );
};

export default AddPictureModal;