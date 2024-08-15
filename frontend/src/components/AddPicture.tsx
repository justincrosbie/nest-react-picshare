import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { addPicture } from '../services/api';

interface AddPictureForm {
  title: string;
  url: string;
}

interface AddPictureProps {
  onClose: () => void;
  onPictureAdded: () => void; // Add a callback prop to refresh the picture list
}

const AddPicture: React.FC<AddPictureProps> = ({ onClose, onPictureAdded }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: AddPictureForm) => {
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
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the picture title!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="url"
        label="Image URL"
        rules={[
          { required: true, message: 'Please input the image URL!' },
          { type: 'url', message: 'Please enter a valid URL!' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Share Picture
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPicture;
