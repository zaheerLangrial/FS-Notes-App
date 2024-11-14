import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:8005/api/token', {
        username: values.username,
        password: values.password,
      });

      // Assuming the response contains `access` and `refresh` tokens
      const { access, refresh } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      message.success('Login successful!');
      navigate('/')
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form
        name="login"
        layout="vertical"
        style={{ width: 300 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
        
        <Form.Item
          label="Email or Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Enter email or username" />
        </Form.Item>
        
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
