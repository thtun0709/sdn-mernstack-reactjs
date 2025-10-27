import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Typography, Drawer, message } from 'antd';
import { useAuth } from '../contexts/AuthProvider';
import { App } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export default function Header() {
  const { member, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { message } = App.useApp();


  const handleLogout = async () => {
    try {
      console.log("🔄 Bắt đầu logout process...");
      await logout(); // đợi gọi API /api/auth/logout
      console.log("✅ Logout API thành công");
      message.success("Đăng xuất thành công!");
      navigate('/');
    } catch (err) {
      console.error("❌ Lỗi khi logout:", err);
      // Vẫn navigate về home page ngay cả khi có lỗi
      message.success("Đã đăng xuất!");
      navigate('/');
    } finally {
      setDrawerVisible(false);
    }
  };
  

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile" className="flex items-center gap-2">Profile</Link>,
      icon: <UserOutlined />
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: <span onClick={handleLogout} className="flex items-center gap-2 text-red-400">Logout</span>,
      icon: <LogoutOutlined />
    }
  ];

  const adminMenuItems = [
    {
      key: 'perfumes',
      label: <Link to="/admin/perfumes" className="flex items-center gap-2">Manage Perfumes</Link>,
      icon: <SettingOutlined />
    },
    {
      key: 'users',
      label: <Link to="/admin/users" className="flex items-center gap-2">Manage Users</Link>,
      icon: <UserOutlined />
    }
  ];

  const mobileMenuItems = [
    { key: 'home', label: <Link to="/" className="flex items-center gap-2"><HomeOutlined />Home</Link> },
    ...(member?.role === 'admin' ? adminMenuItems : []),
    ...(member ? userMenuItems : [
      { key: 'login', label: <Link to="/login" className="flex items-center gap-2"><UserOutlined />Login</Link> },
      { key: 'register', label: <Link to="/register" className="flex items-center gap-2"><UserOutlined />Register</Link> }
    ])
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-500/20 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              {/* Logo Text */}
              <div className="leading-tight">
                <h1 className="text-[35px] font-serif font-semibold text-[#c41e3a] uppercase tracking-wide transition-colors">
                  <span className="text-white">Perfume</span> House
                </h1>
              </div>
            </Link>


            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className="text-white hover:text-red-400 transition-colors font-medium flex items-center gap-2"
              >
                <HomeOutlined />
                Home
              </Link>

              {member?.role === 'admin' && (
                <Dropdown
                  menu={{ items: adminMenuItems }}
                  placement="bottomRight"
                  trigger={['hover']}
                >
                  <Button
                    type="text"
                    className="text-white hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <SettingOutlined />
                    Admin
                  </Button>
                </Dropdown>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {member ? (
                <div className="flex items-center gap-3">
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['hover']}
                  >
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-colors">
                      <Avatar
                        size={36}
                        className="bg-gradient-to-r from-red-500 to-pink-500"
                        icon={<UserOutlined />}
                      />
                      <div className="hidden sm:block">
                        <Text className="text-white font-medium">{member.name}</Text>
                        <div className="text-xs text-gray-400">{member.role}</div>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <Button
                    type="text"
                    className="text-white hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    type="primary"
                    className="bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                type="text"
                icon={<MenuOutlined />}
                className="text-white lg:hidden"
                onClick={() => setDrawerVisible(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <Text className="text-white font-bold">Perfume House</Text>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="bg-gray-900"
        styles={{
          body: { background: 'rgba(0,0,0,0.8)', color: 'white' },
          header: { background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid #374151' }
        }}
      >
        <div className="space-y-4">
          {mobileMenuItems.map(item => (
            <div key={item.key} className="py-2">
              {item.label}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
