import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#0f0f0f] p-4 rounded shadow-sm">
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1"><Link to="/admin/perfumes">Manage Perfumes</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/admin/users">Manage Users</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/">Back to Home</Link></Menu.Item>
      </Menu>
    </aside>
  );
}
