import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { assetUrl } from "../api/axios";
import { Button, Input, Rate, message } from "antd";
import { useAuth } from "../contexts/AuthProvider";

const { TextArea } = Input;

export default function Detail() {
  const { id } = useParams();
  const [perfume, setPerfume] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hasCommented, setHasCommented] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const { member } = useAuth();

  const loadPerfumeData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/perfumes/${id}`);
      setPerfume(res.data.perfume);
      let commentsData = res.data.comments || [];
      
      // Check if current user has already commented
      if (member) {
        const userComment = commentsData.find(c => c.userId?._id === member._id);
        setHasCommented(!!userComment);
        
        // Sort: user's comment first, then others by date
        commentsData = commentsData.sort((a, b) => {
          if (a.userId?._id === member._id) return -1;
          if (b.userId?._id === member._id) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }
      
      setComments(commentsData);
    } catch (err) {
      console.error("❌ Error loading perfume:", err);
      message.error("Failed to load perfume details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerfumeData();
  }, [id, member]);

  const handleAddComment = async () => {
    if (!newComment.trim() || rating === 0) {
      message.warning("Please provide both rating and comment");
      return;
    }
    
    console.log("🚀 Submitting comment:", {
      perfumeId: id,
      content: newComment,
      rating: rating,
      member: member
    });
    
    try {
      const response = await api.post(`/api/comments/${id}`, {
        content: newComment,
        rating: rating
      }, { withCredentials: true });
      
      console.log("✅ Comment response:", response.data);
      
      setNewComment("");
      setRating(0);
      message.success("🎉 Comment added successfully!");
      loadPerfumeData();
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      console.error("❌ Error response:", err.response?.data);
      
      // Show specific error message from backend
      const errorMsg = err.response?.data?.error || "Failed to add comment. Please try again.";
      message.error(`❌ ${errorMsg}`);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }
    try {
      await api.put(`/api/comments/${commentId}`, {
        content: editContent,
        rating: editRating
      }, { withCredentials: true });
      
      message.success("✅ Comment updated successfully!");
      setEditingCommentId(null);
      loadPerfumeData();
    } catch (err) {
      console.error("❌ Error editing comment:", err);
      const errorMsg = err.response?.data?.error || "Failed to update comment. Please try again.";
      message.error(`❌ ${errorMsg}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`, { withCredentials: true });
      message.success("✅ Comment deleted successfully!");
      loadPerfumeData();
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
      const errorMsg = err.response?.data?.error || "Failed to delete comment. Please try again.";
      message.error(`❌ ${errorMsg}`);
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setEditRating(comment.rating);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
    setEditRating(0);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-lg">
        Loading...
      </div>
    );

  if (!perfume)
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-lg">
        Perfume not found
      </div>
    );

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: "#0c0c0c", color: "#fff", fontFamily: "Poppins, sans-serif" }}
    >
      <style>{`
        /* Custom styling for Rate component */
        .ant-rate-star:not(.ant-rate-star-full) {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .ant-rate-star-full {
          color: #fadb14 !important;
        }
        .ant-rate-star:hover {
          transform: scale(1.1);
          transition: all 0.3s;
        }
      `}</style>
      <div className="max-w-5xl mx-auto px-4">
        {/* Perfume Detail */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          <img
            src={assetUrl(perfume.image)}
            alt={perfume.perfumeName || perfume.name}
            className="w-full lg:w-[450px] h-auto rounded-lg shadow-lg border border-[#2a2a2a]"
          />
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-semibold">{perfume.perfumeName || perfume.name}</h1>
            <p>
              <b>Brand:</b>{" "}
              {typeof perfume.brand === "object"
                ? perfume.brand.brandName || perfume.brand.name
                : perfume.brand || "—"}
            </p>
            <p>
              <b>Concentration:</b> {perfume.concentration || "—"}
            </p>
            <p>
              <b>Volume:</b> {perfume.volume ? perfume.volume + " ml" : "—"}
            </p>
            <p>
              <b>Target:</b> {perfume.targetAudience || perfume.gender || "—"}
            </p>
            {perfume.ingredients && (
              <p>
                <b>Ingredients:</b> {perfume.ingredients}
              </p>
            )}
            <p className="text-xl font-semibold text-[#c41e3a] mt-4">
              <b>Price:</b> {(perfume.price || 0).toLocaleString()} VND
            </p>
            
            {/* Description Section */}
            <div className="mt-5 pt-4 border-t border-[#2a2a2a]">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {perfume.description || "No description available for this product."}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Display */}
        <div className="text-yellow-400 text-xl mb-10">
          {comments.length > 0 ? (
            <>
              ⭐ Average Rating: {(comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length).toFixed(1)}/3
              {" "}({comments.length} review{comments.length > 1 ? 's' : ''})
            </>
          ) : (
            "⭐ No ratings yet"
          )}
        </div>

        {/* Comment Section */}
        <div id="comments" className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-[#c41e3a] pl-3">
            Comments & Reviews
          </h2>

          {/* Comment Form - Only show if user hasn't commented */}
          {member && !hasCommented ? (
            <div className="bg-[#151515] border border-[#222] p-6 rounded-lg">
              <label className="block mb-3 font-medium text-lg">Leave Your Review</label>
              
              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-300">
                  Rating <span className="text-[#c41e3a]">*</span>
                </label>
                <Rate
                  value={rating}
                  onChange={setRating}
                  count={3}
                  className="text-2xl"
                  style={{ 
                    fontSize: '28px',
                    color: '#fff'
                  }}
                />
                {rating > 0 && (
                  <span className="ml-3 text-gray-400">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Good"}
                    {rating === 3 && "Excellent"}
                  </span>
                )}
              </div>

              {/* Comment Textarea */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-300">
                  Your Review <span className="text-[#c41e3a]">*</span>
                </label>
                <TextArea
                  rows={5}
                  placeholder="Share your experience with this perfume..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-[#111] text-white border border-[#333] rounded-md"
                  style={{
                    backgroundColor: '#111',
                    color: '#fff',
                    borderColor: '#333'
                  }}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || rating === 0}
                size="large"
                style={{
                  backgroundColor: (!newComment.trim() || rating === 0) ? '#700' : '#c41e3a',
                  borderColor: (!newComment.trim() || rating === 0) ? '#700' : '#c41e3a',
                  color: '#fff',
                  fontWeight: '600',
                  height: '44px',
                  cursor: (!newComment.trim() || rating === 0) ? 'not-allowed' : 'pointer'
                }}
                className="hover:brightness-110 transition-all"
              >
                Submit Review
              </Button>
            </div>
          ) : member && hasCommented ? (
            <div className="bg-[#151515] border border-[#222] p-4 rounded-lg text-center">
              <p className="text-gray-300">✓ You have already reviewed this product</p>
            </div>
          ) : (
            <div className="bg-[#151515] border border-[#222] p-4 rounded-lg text-center">
              <p className="text-gray-400">
                <Link to={`/login?redirect=/perfumes/${id}#comments`} className="text-[#c41e3a] hover:text-[#a0142e]">
                  Login
                </Link>{" "}
                to leave a review
              </p>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => {
                const isOwner = member && c.userId?._id === member._id;
                const isEditing = editingCommentId === c._id;

                return (
                  <div
                    key={c._id}
                    className={`bg-[#151515] border p-4 rounded-lg ${
                      isOwner ? 'border-[#c41e3a]' : 'border-[#222]'
                    }`}
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div>
                        <label className="block mb-2 font-medium">Edit Rating:</label>
                        <Rate
                          value={editRating}
                          onChange={setEditRating}
                          count={3}
                          className="text-yellow-400 mb-3"
                        />
                        <TextArea
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="bg-[#111] text-white border border-[#333] rounded-md mb-3"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditComment(c._id)}
                            className="bg-[#1a5f7a] border-none text-white hover:bg-[#207398]"
                            size="small"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            size="small"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#c41e3a] flex items-center justify-center text-white font-bold">
                              {c.userId?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {c.userId?.name || 'Anonymous'}
                                {isOwner && <span className="ml-2 text-xs text-[#c41e3a]">(You)</span>}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Rate disabled value={c.rating} count={3} className="text-yellow-400 text-xs" />
                                <span>• {new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Edit/Delete buttons - only for owner */}
                          {isOwner && (
                            <div className="flex gap-2">
                              <Button
                                size="small"
                                onClick={() => startEdit(c)}
                                className="text-[#1a5f7a] border-[#1a5f7a]"
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                danger
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this comment?")) {
                                    handleDeleteComment(c._id);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-200 mt-3 pl-13">{c.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#151515] border border-[#222] p-8 rounded-lg text-center">
              <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
