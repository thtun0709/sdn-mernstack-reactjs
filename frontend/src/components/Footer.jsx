import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Row, Col, Divider } from 'antd';
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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-red-500/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} lg={6}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <Title level={4} className="text-white mb-0">Perfume House</Title>
              </div>
              <Text className="text-gray-300 leading-relaxed">
                Discover the world's most exquisite fragrances. From timeless classics to modern masterpieces, 
                we bring you the finest perfumes from renowned brands.
              </Text>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MailOutlined className="text-red-400" />
                <Text className="text-gray-300">info@perfumehouse.com</Text>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <PhoneOutlined className="text-red-400" />
                <Text className="text-gray-300">+1 (555) 123-4567</Text>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <EnvironmentOutlined className="text-red-400" />
                <Text className="text-gray-300">123 Fragrance Street, Perfume City</Text>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">Company</Title>
            <div className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <div key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-red-400 transition-colors block"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">Customer Care</Title>
            <div className="space-y-3">
              {footerLinks.customer.map((link, index) => (
                <div key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-red-400 transition-colors block"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">Support</Title>
            <div className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <div key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-red-400 transition-colors block"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Divider className="border-gray-600 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Text className="text-gray-400">
              © {currentYear} Perfume House. All rights reserved.
            </Text>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-red-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-red-400 transition-colors">
              Cookie Policy
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <Text className="text-gray-500 text-sm">
            Made with <HeartOutlined className="text-red-400" /> by the Perfume House Team
          </Text>
        </div>
      </div>
    </footer>
  );
}
  