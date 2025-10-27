import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Divider, Row, Col } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' }
    ],
    customer: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Track Order', href: '/track' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Live Chat', href: '/chat' }
    ]
  };

  const socialLinks = [
    { icon: <FacebookOutlined />, href: '#', label: 'Facebook' },
    { icon: <InstagramOutlined />, href: '#', label: 'Instagram' },
    { icon: <TwitterOutlined />, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="w-full bg-black/80 backdrop-blur-md border-t border-red-500/20 shadow-inner mt-20">
      <div className="container mx-auto px-6 py-12">
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} lg={6}>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-[25px] font-serif font-semibold text-[#c41e3a] uppercase tracking-wide transition-colors">
                <span className="text-white">Perfume</span> House
              </h1>
            </div>

            <Text className="text-gray-300 leading-relaxed block mb-6">
              Discover the world's most exquisite fragrances. From timeless classics to modern masterpieces,
              we bring you the finest perfumes from renowned brands.
            </Text>

            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <MailOutlined className="text-red-400" />
                <Text  style={{ color: '#565C67' }}>info@perfumehouse.com</Text>
              </div>
              <div className="flex items-center gap-3">
                <PhoneOutlined className="text-red-400" />
                <Text  style={{ color: '#565C67' }}>+1 (555) 123-4567</Text>
              </div>
              <div className="flex items-center gap-3">
                <EnvironmentOutlined className="text-red-400" />
                <Text  style={{ color: '#565C67' }}>123 Fragrance Street, Perfume City</Text>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title
              level={5}
              style={{ color: '#fff' }}
              className="mb-4 uppercase tracking-wide"
            >Company</Title>
            <div className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="text-gray-400 hover:text-red-400 transition-colors block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Title
              level={5}
              style={{ color: '#fff' }}
              className="mb-4 uppercase tracking-wide"
            >
              Customer Care
            </Title>
            <div className="space-y-3">
              {footerLinks.customer.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="text-gray-400 hover:text-red-400 transition-colors block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Title
              level={5}
              style={{ color: '#fff' }}
              className="mb-4 uppercase tracking-wide"
            >Support</Title>
            <div className="space-y-3">
              {footerLinks.support.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="text-gray-400 hover:text-red-400 transition-colors block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>
        </Row>

        <Divider className="border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
          <Text  style={{ color: '#565C67' }}>© {currentYear} Perfume House - All rights reserved - Founder Thtun.0709 </Text>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-red-400 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-red-400 transition-colors">Cookie Policy</Link>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
