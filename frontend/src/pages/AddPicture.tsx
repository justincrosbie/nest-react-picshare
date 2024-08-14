import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addPicture } from '../services/api';

interface AddPictureForm {
  title: string;
  url: string;
}

const AddPicture: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: AddPictureForm) => {
    try {
      await addPicture(values);
      message.success('Picture shared successfully!');
      navigate('/'); // Redirect to home page after successful submission
    } catch (error) {
      console.error('Failed to share picture:', error);
      message.error('Failed to share picture. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 20px' }}>
      <h2>Share a New Picture</h2>
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
    </div>
  );
};

export default AddPicture;