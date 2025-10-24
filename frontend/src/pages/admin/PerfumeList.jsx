import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';
import { Table, Button, Card, Typography, Tag, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PerfumeList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/perfumes');
      setData(res.data.perfumes || []);
    } catch (err) {
      message.error('Failed to load perfumes');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.get(`/api/perfumes/delete/${id}`);
      message.success('Perfume deleted successfully');
      fetch();
    } catch (err) {
      message.error('Failed to delete perfume');
    }
  };

  const columns = [
    { 
      title: 'Image', 
      dataIndex: 'image', 
      width: 80,
      render: (img) => (
        <img 
          src={img || '/images/no-image.png'} 
          className="w-16 h-16 object-cover rounded-lg shadow-md" 
          alt="Perfume"
        />
      ) 
    },
    { 
      title: 'Name', 
      dataIndex: 'perfumeName',
      render: (text, record) => (
        <div>
          <div className="font-semibold text-white">{text || record.name}</div>
          {record.concentration && (
            <Tag color="red" size="small">{record.concentration}</Tag>
          )}
        </div>
      )
    },
    { 
      title: 'Brand', 
      dataIndex: 'brand',
      render: (brand) => (
        <Tag color="blue">{brand || '—'}</Tag>
      )
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      render: (v) => (
        <span className="text-red-400 font-semibold">
          {v?.toLocaleString() || 0} VND
        </span>
      ) 
    },
    { 
      title: 'Gender', 
      dataIndex: 'gender',
      render: (gender) => (
        <Tag color={gender === 'Nam' ? 'blue' : gender === 'Nữ' ? 'pink' : 'purple'}>
          {gender || '—'}
        </Tag>
      )
    },
    { 
      title: 'Action', 
      width: 200,
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/perfumes/${row._id}`}>
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              View
            </Button>
          </Link>
          <Link to={`/admin/perfumes/edit/${row._id}`}>
            <Button 
              size="small" 
              icon={<EditOutlined />}
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white"
            >
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Delete perfume"
            description="Are you sure to delete this perfume?"
            onConfirm={() => handleDelete(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

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
            <div className="flex justify-between items-center mb-6">
              <Title level={2} className="text-white mb-0">Perfume Management</Title>
              <Link to="/admin/perfumes/add">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlusOutlined />}
                  className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
                >
                  Add New Perfume
                </Button>
              </Link>
            </div>
            
            <Table 
              rowKey="_id" 
              columns={columns} 
              dataSource={data}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                className: 'text-white'
              }}
              className="bg-transparent"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
