import React, { useState } from 'react';
import api from "../api/axios";
import { useAuth } from '../contexts/AuthProvider';
import { App, Modal, Card, Button, Typography, Form, Input, message, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Profile() {
  const { member, updateMember } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();


  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      name: member?.name,
      email: member?.email,
    });
  };

  const handleSave = async (values) => {
    try {
      const res = await api.post('/api/users/profile/update', { name: values.name });
  
      if (res.data?.user) {
        updateMember(res.data.user);
      }
  
      modal.success({
        title: 'Update succesful',
        content: `Your information has updated.`,
        okText: 'Đóng',
        centered: true,
      });
  
      setEditing(false);
    } catch (err) {
      modal.error({
        title: '❌ Cập nhật thất bại!',
        content: 'Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại.',
        centered: true,
      });
    }
  };
  

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
    message.warning({
      content: '⚠️ Đã hủy chỉnh sửa',
      duration: 2,
      style: {
        marginTop: '20vh',
      },
    });
  };

  if (!member) {
    return (
      <div className="flex items-center justify-center ">
        <div className="text-white text-xl">Please login to view profile</div>
      </div>
    );
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <Card
          className="shadow-2xl border border-gray-700/30"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '16px',
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          <div className="text-center mb-8">
            <Avatar
              size={100}
              className="bg-gradient-to-r from-red-500 to-pink-500 mb-4"
              icon={<UserOutlined />}
            />
            <Title level={2} className="mb-2" style={{ color: '#565C67' }}>
              Profile Information
            </Title>
          </div>

          {editing ? (
            <Form
              form={form}
              onFinish={handleSave}
              layout="vertical"
              size="large"
              className="max-w-2xl mx-auto"
            >
              {/* Ô name (cho phép sửa) */}
              <Form.Item
                name="name"
                label={<span className="text-white">Full Name</span>}
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your name"
                  className="text-white"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid #444',
                    color: '#fff',
                  }}
                />
              </Form.Item>

              {/* Email hiển thị dạng text, không cho chỉnh */}
              <div className="mb-6">
                <label className="text-white block mb-1">Email</label>
                <div
                  className="text-gray-400 bg-black/30 border border-gray-700 rounded-md px-3 py-2"
                  style={{ userSelect: 'none' }}
                >
                  <MailOutlined className="mr-2 text-gray-500" />
                  {member.email}
                </div>
              </div>

              <Form.Item className="mb-0">
                <div className="flex gap-4 justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                    className="bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600"
                  >
                    Save Changes
                  </Button>
                  <Button
                    size="large"
                    onClick={handleCancel}
                    className="bg-black border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <UserOutlined className="text-2xl text-red-400" />
                    <div>
                      <Text className="text-gray-400 block">Full Name</Text>
                      <Text className="text-white text-lg font-semibold">
                        {member.name}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <MailOutlined className="text-2xl text-red-400" />
                    <div>
                      <Text className="text-gray-400 block">Email</Text>
                      <Text className="text-white text-lg font-semibold">
                        {member.email}
                      </Text>
                    </div>
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
                  className="bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600"
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
