import { Card, Button, Tag, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { assetUrl } from '../api/axios';

export default function PerfumeCard({ perfume }) {
  return (
    <Card
      hoverable
      className="group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      cover={
        <div className="relative overflow-hidden">
          <img 
            alt={perfume.perfumeName || perfume.name} 
            src={assetUrl(perfume.image) || assetUrl('/images/no-image.png')} 
            className="object-cover h-64 w-full transition-transform duration-300 group-hover:scale-110" 
          />
          {perfume.concentration && perfume.concentration.toLowerCase() === 'extrait' && (
            <Tag 
              color="red" 
              className="absolute top-3 right-3 font-bold shadow-lg"
            >
              Extrait
            </Tag>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<EyeOutlined />}
                className="bg-red-500 border-red-500 hover:bg-red-600"
              />
              <Button 
                shape="circle" 
                icon={<HeartOutlined />}
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              />
              <Button 
                shape="circle" 
                icon={<ShoppingCartOutlined />}
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
              />
            </div>
          </div>
        </div>
      }
      bodyStyle={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: 'none'
      }}
      style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg text-white font-bold mb-1 line-clamp-2">
            {perfume.perfumeName || perfume.name}
          </h3>
          <p className="text-sm text-gray-400">
            {(perfume.brand && (perfume.brand.brandName || perfume.brand.name)) || '—'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rate 
              disabled 
              value={4.5} 
              className="text-yellow-400 text-sm"
            />
            <span className="text-gray-400 text-sm">(4.5)</span>
          </div>
          {perfume.gender && (
            <Tag 
              color={perfume.gender === 'Nam' ? 'blue' : perfume.gender === 'Nữ' ? 'pink' : 'purple'}
              size="small"
            >
              {perfume.gender}
            </Tag>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-red-400 font-bold text-lg">
            {(perfume.price || 0).toLocaleString()} VND
          </span>
          {perfume.concentration && (
            <Tag color="orange" size="small">
              {perfume.concentration}
            </Tag>
          )}
        </div>

        <Link to={`/perfumes/${perfume._id}`} className="block">
          <Button 
            block 
            type="primary"
            size="large"
            icon={<EyeOutlined />}
            className="bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600 font-semibold"
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
