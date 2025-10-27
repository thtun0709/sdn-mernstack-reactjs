import { Card, Button, Tag, Rate } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import { assetUrl } from '../api/axios';

export default function PerfumeCard({ perfume }) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/perfumes/${perfume._id}`);
  };

  // Convert Vietnamese gender to English
  const getGenderDisplay = (gender) => {
    const genderMap = {
      'Nam': 'Male',
      'Nữ': 'Female',
      'Unisex': 'Unisex'
    };
    return genderMap[gender] || gender;
  };

  // Get gender color
  const getGenderColor = (gender) => {
    if (gender === 'Nam' || gender === 'Male') return 'blue';
    if (gender === 'Nữ' || gender === 'Female') return 'pink';
    return 'purple';
  };

  return (
    <Card
      hoverable
      className="group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      cover={
        <div className="relative overflow-hidden">
          <img
            alt={perfume.perfumeName || perfume.name}
            src={perfume.image ? assetUrl(perfume.image) : assetUrl('/images/default_perfume.jpg')}
            className="object-cover w-full h-[280px] md:h-[320px] transition-transform duration-300 group-hover:scale-110"
            onError={(e) => e.target.src = assetUrl('/images/default_perfume.jpg')}
          />
          {perfume.concentration && perfume.concentration.toLowerCase().includes('extrait') && (
            <Tag
              color="red"
              className="absolute top-3 right-3 font-bold shadow-lg text-xs px-2 py-1"
            >
              EXTRAIT
            </Tag>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                size="large"
                onClick={handleViewDetail}
                className="bg-red-500 border-red-500 hover:bg-red-600 shadow-xl"
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
            {typeof perfume.brand === 'object' ? (perfume.brand.brandName || perfume.brand.name) : perfume.brand || '—'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rate 
              disabled 
              count={3}
              value={perfume.avgRating || 0} 
              allowHalf
              className="text-yellow-400 text-sm"
            />
            <span className="text-gray-400 text-sm">
              ({perfume.avgRating ? perfume.avgRating.toFixed(1) : '0.0'})
            </span>
          </div>
          {perfume.gender && (
            <Tag 
              color={getGenderColor(perfume.gender)}
              size="small"
            >
              {getGenderDisplay(perfume.gender)}
            </Tag>
          )}
        </div>        <div className="flex items-center justify-between">
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
