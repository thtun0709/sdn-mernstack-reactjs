import React from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const onFinish = async (values) => {
    try {
      await login(values);
      navigate(redirect);
    } catch (err) { /* handled in context */ }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card 
          className="shadow-2xl border-0"
          bodyStyle={{ padding: '2rem' }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px'
          }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="text-white mb-2">Welcome Back</Title>
            <Text className="text-gray-300">Sign in to your account</Text>
          </div>

          <Form onFinish={onFinish} layout="vertical" size="large">
            <Form.Item 
              name="email" 
              rules={[{required: true, message: 'Please input your email!'}]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
                className="bg-gray-800 border-gray-600 text-white"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
              />
            </Form.Item>
            
            <Form.Item 
              name="password" 
              rules={[{required: true, message: 'Please input your password!'}]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="bg-gray-800 border-gray-600 text-white"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
              />
            </Form.Item>
            
            <Form.Item className="mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                className="bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600"
                style={{ height: '48px', fontSize: '16px' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider className="border-gray-600" />
          
          <div className="text-center">
            <Text className="text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-400 hover:text-red-300 font-medium">
                Sign up here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
