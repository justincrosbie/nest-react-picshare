import React, { useEffect } from 'react';
import { Form, Input, Button, message, Modal, Divider } from 'antd';
import { addPicture } from '../services/api';

interface AddPictureModalProps {
  visible: boolean;
  onClose: () => void;
  onPictureAdded: () => void;
}

const AddPictureModal: React.FC<AddPictureModalProps> = ({ visible, onClose, onPictureAdded }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: { title: string; url: string }) => {
    try {
      await addPicture(values);
      message.success('Picture shared successfully!');
      form.resetFields(); // Reset the form fields after successful submission
      onClose(); // Close the modal after successful submission
      onPictureAdded(); // Trigger the callback to refresh pictures
    } catch (error) {
      console.error('Failed to share picture:', error);
      message.error('Failed to share picture. Please try again.');
    }
  };

  useEffect(() => {
    form.resetFields(); // Reset the form when the component mounts or modal is shown
  }, [form]);

  return (
    <Modal
      title="Share a New Picture"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Share
        </Button>,
      ]}
    >
    <Divider />
    <Form 
        form={form} 
        layout="vertical"
         onFinish={onFinish}
         style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }} // Center the form fields horizontally
           >
        <Form.Item
          name="url"
          rules={[
            { required: true, message: 'Please input the image URL!' },
            { type: 'url', message: 'Please enter a valid URL!' }
          ]}
          style={{ maxWidth: '300px', width: '100%' }} // Add maxWidth to squash horizontally
        >
          <Input placeholder='New picture URL'/>
        </Form.Item>
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input the picture title!' }]}
          style={{ maxWidth: '300px', width: '100%' }} // Add maxWidth to squash horizontally
        >
          <Input placeholder='Title'/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPictureModal;