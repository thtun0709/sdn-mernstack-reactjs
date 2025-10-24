import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { Card, Button, Typography, Form, Input, message, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Profile() {
  const { member } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      name: member?.name,
      email: member?.email,
    });
  };

  const handleSave = async (values) => {
    try {
      // API call to update profile
      // await api.post('/api/users/profile/update', values);
      message.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      message.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please login to view profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card 
          className="shadow-2xl border-0"
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px'
          }}
        >
          <div className="text-center mb-8">
            <Avatar 
              size={100} 
              className="bg-gradient-to-r from-red-500 to-pink-500 mb-4"
              icon={<UserOutlined />}
            />
            <Title level={2} className="text-white mb-2">Profile Information</Title>
            <Tag 
              color={member.role === 'admin' ? 'red' : 'blue'} 
              className="text-lg px-4 py-1"
            >
              {member.role?.toUpperCase()}
            </Tag>
          </div>

          {editing ? (
            <Form
              form={form}
              onFinish={handleSave}
              layout="vertical"
              size="large"
              className="max-w-2xl mx-auto"
            >
              <Form.Item
                name="name"
                label={<span className="text-white">Full Name</span>}
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your name"
                  className="bg-gray-800 border-gray-600 text-white"
                  style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-white">Email</span>}
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-600 text-white"
                  style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex gap-4 justify-center">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                    className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    size="large"
                    onClick={handleCancel}
                    className="border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <UserOutlined className="text-2xl text-red-400" />
                    <div>
                      <Text className="text-gray-400 block">Full Name</Text>
                      <Text className="text-white text-lg font-semibold">{member.name}</Text>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <MailOutlined className="text-2xl text-red-400" />
                    <div>
                      <Text className="text-gray-400 block">Email</Text>
                      <Text className="text-white text-lg font-semibold">{member.email}</Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarOutlined className="text-2xl text-red-400" />
                  <div>
                    <Text className="text-gray-400 block">Account Type</Text>
                    <Tag 
                      color={member.role === 'admin' ? 'red' : 'blue'} 
                      className="text-lg px-4 py-1"
                    >
                      {member.role?.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </div>

              <Divider className="border-gray-600" />

              <div className="text-center">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
