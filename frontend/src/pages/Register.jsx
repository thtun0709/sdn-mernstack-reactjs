import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Select } from 'antd';
import api from '../api/axios';
import { message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Ensure gender is boolean when sending to backend
      const payload = { ...values, gender: values.gender === 'true' || values.gender === true };
      await api.post('/auth/register', payload);
      message.success('Registered successfully! You are now logged in');
      navigate('/');
    } catch (err) {
      message.error(err?.response?.data?.message || 'Register failed');
    }
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
            <Title level={2} className="text-white mb-2">Create Account</Title>
            <Text className="text-gray-300">Join our perfume community</Text>
          </div>

          <Form onFinish={onFinish} layout="vertical" size="large">
            <Form.Item 
              name="name" 
              rules={[{required: true, message: 'Please input your name!'}]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Full Name"
                className="bg-gray-800 border-gray-600 text-white"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
              />
            </Form.Item>

            <Form.Item 
              name="email" 
              rules={[{required: true, type: 'email', message: 'Please input valid email!'}]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />}
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

            <Form.Item 
              name="YOB" 
              rules={[{required: true, message: 'Please input your year of birth!'}]}
            >
              <Input 
                prefix={<CalendarOutlined className="text-gray-400" />}
                placeholder="Year of Birth"
                type="number"
                min="1900"
                max="2024"
                className="bg-gray-800 border-gray-600 text-white"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
              />
            </Form.Item>

            <Form.Item 
              name="gender" 
              rules={[{required: true, message: 'Please select gender!'}]}
            >
              <Select 
                placeholder="Gender"
                className="bg-gray-800 border-gray-600 text-white"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
              >
                <Option value="true">Male</Option>
                <Option value="false">Female</Option>
              </Select>
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
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider className="border-gray-600" />
          
          <div className="text-center">
            <Text className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
                Sign in here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
