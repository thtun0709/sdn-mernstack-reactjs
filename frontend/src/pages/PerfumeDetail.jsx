import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { assetUrl } from '../api/axios';
import { Button, Card, Typography, Tag, Rate, Divider, Avatar, Input, message } from 'antd';
import { useAuth } from '../contexts/AuthProvider';
import { ShoppingCartOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function PerfumeDetail() {
  const { id } = useParams();
  const [perfume, setPerfume] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const { member } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/perfumes/${id}`);
        setPerfume(res.data.perfume);
        setComments(res.data.comments || []);
      } catch (err) { 
        console.error(err);
        message.error('Failed to load perfume details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/api/perfumes/${id}/comment`, { content: newComment });
      setNewComment('');
      message.success('Comment added successfully');
      // Reload comments
      const res = await api.get(`/api/perfumes/${id}`);
      setComments(res.data.comments || []);
    } catch (err) {
      message.error('Failed to add comment');
    }
  };

  const handleRating = async (value) => {
    try {
      await api.post(`/api/perfumes/${id}/rate`, { stars: value });
      setRating(value);
      message.success('Rating submitted');
    } catch (err) {
      message.error('Failed to submit rating');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (!perfume) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-xl">Perfume not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <Card 
          className="shadow-2xl border-0 mb-8"
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={assetUrl(perfume.image) || assetUrl('/images/no-image.png')} 
                  alt={perfume.perfumeName || perfume.name}
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
                {perfume.concentration && perfume.concentration.toLowerCase() === 'extrait' && (
                  <Tag 
                    color="red" 
                    className="absolute top-4 right-4 text-sm font-bold px-3 py-1"
                  >
                    Extrait
                  </Tag>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                {member ? (
                  <>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<ShoppingCartOutlined />}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 border-0"
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      size="large" 
                      icon={<HeartOutlined />}
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      Wishlist
                    </Button>
                  </>
                ) : (
                  <Button size="large" className="flex-1">
                    <a href="/login" className="text-white">Login to interact</a>
                  </Button>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <Title level={1} className="text-white mb-2">
                  {perfume.perfumeName || perfume.name}
                </Title>
                <Text className="text-gray-300 text-lg">
                  Brand: {(perfume.brand && (perfume.brand.brandName || perfume.brand.name)) || '—'}
                </Text>
              </div>

              <div className="flex items-center gap-4">
                <Title level={2} className="text-red-400 mb-0">
                  {(perfume.price || 0).toLocaleString()} VND
                </Title>
                <div className="flex items-center gap-2">
                  <Rate disabled value={4.5} />
                  <Text className="text-gray-300">(4.5)</Text>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-gray-400">Target Audience</Text>
                  <div className="text-white font-medium">
                    {perfume.targetAudience || perfume.gender || '—'}
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400">Concentration</Text>
                  <div className="text-white font-medium">
                    {perfume.concentration || '—'}
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400">Volume</Text>
                  <div className="text-white font-medium">
                    {perfume.volume || '—'}
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400">Ingredients</Text>
                  <div className="text-white font-medium">
                    {perfume.ingredients || '—'}
                  </div>
                </div>
              </div>

              <div>
                <Text className="text-gray-400 mb-2 block">Description</Text>
                <Paragraph className="text-gray-200 leading-relaxed">
                  {perfume.description || 'No description available'}
                </Paragraph>
              </div>

              {/* Rating Section */}
              {member && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Text className="text-white mb-2 block">Rate this perfume</Text>
                  <Rate 
                    value={rating} 
                    onChange={handleRating}
                    className="text-yellow-400"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <Card 
          className="shadow-2xl border-0"
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px'
          }}
        >
          <Title level={3} className="text-white mb-6">Comments & Reviews</Title>
          
          {/* Add Comment Form */}
          {member ? (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this perfume..."
                rows={3}
                className="mb-3"
              />
              <Button 
                type="primary" 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
              >
                Add Comment
              </Button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center">
              <Text className="text-gray-300">
                <a href="/login" className="text-red-400 hover:text-red-300">Login</a> to add comments
              </Text>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <Text className="text-gray-400">No comments yet. Be the first to review!</Text>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar 
                      size={40} 
                      className="bg-gradient-to-r from-red-500 to-pink-500"
                    >
                      {comment.userId?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Text className="text-white font-medium">
                          {comment.userId?.name || 'Anonymous'}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                      <Text className="text-gray-200">{comment.content}</Text>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
