import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Card, Typography, Row, Col, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function PerfumeForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await api.get('/api/brands');
        setBrands(res.data.brands || []);
      } catch (err) {
        console.error('Failed to load brands');
      }
    };
    loadBrands();

    if (id) {
      const loadPerfume = async () => {
        try {
          const res = await api.get(`/api/perfumes/${id}`);
          form.setFieldsValue(res.data.perfume);
        } catch (err) {
          message.error('Failed to load perfume details');
        }
      };
      loadPerfume();
    }
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(values).forEach(k => {
        if (k === 'image' && values.image?.file) {
          fd.append('image', values.image.file.originFileObj);
        } else if (values[k] !== undefined && values[k] !== null) {
          fd.append(k, values[k]);
        }
      });

      if (id) {
        await api.post(`/api/perfumes/edit/${id}`, fd);
        message.success('Perfume updated successfully');
      } else {
        await api.post('/api/perfumes/add', fd);
        message.success('Perfume added successfully');
      }

      navigate('/admin/perfumes');
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to save perfume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <Card 
            className="shadow-2xl border-0"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px'
            }}
          >
            <Title level={2} className="text-white mb-6">
              {id ? 'Edit Perfume' : 'Add New Perfume'}
            </Title>
            
            <Form 
              form={form} 
              onFinish={onFinish} 
              layout="vertical" 
              size="large"
              className="max-w-4xl"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="perfumeName" 
                    label={<span className="text-white">Perfume Name</span>} 
                    rules={[{required: true, message: 'Please input perfume name!'}]}
                  >
                    <Input 
                      placeholder="Enter perfume name"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="price" 
                    label={<span className="text-white">Price (VND)</span>} 
                    rules={[{required: true, message: 'Please input price!'}]}
                  >
                    <Input 
                      type="number" 
                      placeholder="Enter price"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item 
                    name="concentration" 
                    label={<span className="text-white">Concentration</span>}
                  >
                    <Select 
                      placeholder="Select concentration"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    >
                      <Option value="EDP">EDP</Option>
                      <Option value="EDT">EDT</Option>
                      <Option value="Extrait">Extrait</Option>
                      <Option value="Parfum">Parfum</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item 
                    name="gender" 
                    label={<span className="text-white">Gender</span>}
                  >
                    <Select 
                      placeholder="Select gender"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    >
                      <Option value="Nam">Male</Option>
                      <Option value="Nữ">Female</Option>
                      <Option value="Unisex">Unisex</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item 
                    name="brand" 
                    label={<span className="text-white">Brand</span>}
                  >
                    <Select 
                      placeholder="Select brand"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    >
                      {brands.map(brand => (
                        <Option key={brand._id} value={brand.name}>
                          {brand.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="volume" 
                    label={<span className="text-white">Volume (ml)</span>}
                  >
                    <Input 
                      type="number" 
                      placeholder="Enter volume"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="targetAudience" 
                    label={<span className="text-white">Target Audience</span>}
                  >
                    <Select 
                      placeholder="Select target audience"
                      className="bg-gray-800 border-gray-600 text-white"
                      style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="unisex">Unisex</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item 
                name="ingredients" 
                label={<span className="text-white">Ingredients</span>}
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Enter ingredients"
                  className="bg-gray-800 border-gray-600 text-white"
                  style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                />
              </Form.Item>

              <Form.Item 
                name="description" 
                label={<span className="text-white">Description</span>}
              >
                <Input.TextArea 
                  rows={4}
                  placeholder="Enter description"
                  className="bg-gray-800 border-gray-600 text-white"
                  style={{ background: 'rgba(0,0,0,0.3)', borderColor: '#4a5568' }}
                />
              </Form.Item>

              <Form.Item 
                name="image" 
                label={<span className="text-white">Perfume Image</span>}
                valuePropName="file"
              >
                <Upload 
                  beforeUpload={() => false} 
                  listType="picture"
                  maxCount={1}
                  className="bg-gray-800"
                >
                  <Button 
                    icon={<UploadOutlined />}
                    className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400"
                  >
                    Choose Image
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex gap-4">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    loading={loading}
                    icon={<SaveOutlined />}
                    className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
                  >
                    {id ? 'Update Perfume' : 'Add Perfume'}
                  </Button>
                  <Button 
                    size="large"
                    onClick={() => navigate('/admin/perfumes')}
                    className="border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
