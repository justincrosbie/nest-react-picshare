import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type TextAlign = 'left' | 'right' | 'center' | 'justify';

const logoStyle: React.CSSProperties = {
    width: '134px',
    height: '35px',    
    fontFamily: 'Roboto Serif',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '30px',
    lineHeight: '35px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center' as TextAlign,
    color: '#000000',
};


const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string }) => {
    try {
      await login(values.username);
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      message.error('Login failed');
    }
  };

  return (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100vh', // Full viewport height
        }}
    >
        <div style={{ maxWidth: 300, margin: '100px auto', textAlign: 'center' }}>
            <div className="logo" style={logoStyle}>
                PicShare
            </div>
            <p>Login to start sharing</p>
            <Form onFinish={onFinish}>
                <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input placeholder="Username" />
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit">
                    Log in
                </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default Login;