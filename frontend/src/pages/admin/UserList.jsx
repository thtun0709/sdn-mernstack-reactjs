import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Button, Tag } from 'antd';
import AdminSidebar from '../../components/AdminSidebar';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onToggle = async (id) => {
    await api.get(`/users/toggle/${id}`);
    fetchUsers();
  };

  const onDelete = async (id) => {
    await api.get(`/users/delete/${id}`);
    fetchUsers();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r) => <Tag color={r === 'admin' ? 'red' : 'blue'}>{r}</Tag> },
    { title: 'Status', dataIndex: 'isActive', render: (v) => v ? <Tag color="green">Active</Tag> : <Tag color="default">Locked</Tag> },
    { title: 'Action', render: (_, row) => (
      <div className="flex gap-2">
        <Button onClick={() => onToggle(row._id)}>{row.isActive ? 'Lock' : 'Unlock'}</Button>
        <Button danger onClick={() => onDelete(row._id)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <div className="flex gap-6">
      <AdminSidebar />
      <div className="flex-1">
        <Table rowKey="_id" loading={loading} columns={columns} dataSource={users} />
      </div>
    </div>
  );
}
