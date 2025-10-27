const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

// Helper function to get user from request
function getUserFromRequest(req) {
  // Try JWT token first (from AuthProvider)
  if (req.user && req.user._id) {
    return req.user;
  }
  // Fallback to session
  if (req.session && req.session.member) {
    return req.session.member;
  }
  return null;
}

// ➤ Add comment with rating (API for React)
exports.addComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const perfumeId = req.params.id;
    const user = getUserFromRequest(req);
    
    console.log("🔍 Add comment debug:", {
      perfumeId,
      user,
      hasSession: !!req.session?.member,
      hasJWT: !!req.user,
      content,
      rating
    });

    if (!user || !user._id) {
      return res.status(401).json({ error: "You need to login to comment" });
    }

    const userId = user._id;

    // Only allow 1 comment per user per product
    const existing = await Comment.findOne({ perfumeId, userId });
    if (existing) {
      return res.status(400).json({ error: "You have already commented on this product" });
    }

    if (!content || !rating) {
      return res.status(400).json({ error: "Content and rating are required" });
    }

    if (rating < 1 || rating > 3) {
      return res.status(400).json({ error: "Rating must be between 1 and 3" });
    }

    const newComment = new Comment({ 
      perfumeId, 
      userId, 
      content: content.trim(), 
      rating: Number(rating) 
    });
    await newComment.save();

    console.log("✅ Comment created:", newComment);

    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    console.error("❌ Error stack:", err.stack);
    console.error("❌ Error name:", err.name);
    console.error("❌ Error message:", err.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// ➤ Edit comment (API for React)
exports.editComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const commentId = req.params.id;
    const user = getUserFromRequest(req);

    if (!user || !user._id) {
      return res.status(401).json({ error: "You need to login" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only owner or admin can edit
    if (comment.userId.toString() !== user._id.toString() && user.role !== "admin") {
      return res.status(403).json({ error: "You don't have permission to edit this comment" });
    }

    if (content) comment.content = content.trim();
    if (rating) comment.rating = Number(rating);
    
    await comment.save();

    res.json({ message: "Comment updated successfully", comment });
  } catch (err) {
    console.error("❌ Error editing comment:", err);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

// ➤ Delete comment (API for React)
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const user = getUserFromRequest(req);

    if (!user || !user._id) {
      return res.status(401).json({ error: "You need to login" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only owner or admin can delete
    const isOwner = comment.userId.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "You don't have permission to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
