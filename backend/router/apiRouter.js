const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Member = require('../models/memberModel');
const Perfume = require('../models/perfumeModel');
const Brand = require('../models/brandModel');
const Comment = require('../models/commentModel');
const commentController = require('../controllers/commentController');

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

function getUserFromReq(req) {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return decoded;
  } catch (_) {
    return null;
  }
}

function requireAuth(req, res, next) {
  // Check JWT token first
  const user = getUserFromReq(req);
  if (user) {
    req.user = user;
    return next();
  }
  
  // Fallback to session
  if (req.session?.member) {
    return next();
  }
  
  return res.status(401).json({ message: 'Unauthorized' });
}

function requireAdmin(req, res, next) {
  const user = getUserFromReq(req);
  if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  req.user = user;
  next();
}

// Auth
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email });
    if (!member) return res.status(400).json({ message: 'Email không tồn tại' });
    if (!member.isActive) return res.status(403).json({ message: 'Tài khoản bị khóa' });
    const ok = await member.matchPassword ? member.matchPassword(password) : bcrypt.compare(password, member.password);
    if (!ok) return res.status(400).json({ message: 'Sai mật khẩu' });
    const token = signToken({ _id: member._id, name: member.name, email: member.email, role: member.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 3600 * 1000 });
    res.json({ user: { _id: member._id, name: member.name, email: member.email, role: member.role } });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Register (JSON API)
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, YOB, gender, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing required fields' });
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const newMember = new Member({
      email,
      password,
      name,
      YOB,
      gender,
      role: role || 'member',
    });

    await newMember.save();

    // Sign token and set cookie similar to login
    const token = signToken({ _id: newMember._id, name: newMember.name, email: newMember.email, role: newMember.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 3600 * 1000 });

    res.status(201).json({ user: { _id: newMember._id, name: newMember.name, email: newMember.email, role: newMember.role } });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Register failed' });
  }
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/auth/me', async (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(200).json({ user: null });
  res.json({ user });
});

// Perfumes list with filters
router.get('/perfumes', async (req, res) => {
  try {
    const { search, brand, gender, sort } = req.query;
    console.log('🔍 Filter params:', { search, brand, gender, sort });
    
    const filter = {};
    let sortOption = { createdAt: -1 };
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { perfumeName: { $regex: search, $options: 'i' } }];
    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (sort === 'asc') sortOption = { price: 1 };
    if (sort === 'desc') sortOption = { price: -1 };
    
    console.log('🔍 MongoDB filter:', filter);
    console.log('🔍 Sort option:', sortOption);
    
    const perfumes = await Perfume.find(filter).sort(sortOption).lean();
    console.log(`✅ Found ${perfumes.length} perfumes`);
    
    // Debug: Log brand của từng perfume
    if (brand) {
      console.log('📊 Brands in result:', perfumes.map(p => `"${p.brand}"`).join(', '));
    }
    
    // Tính avgRating cho mỗi perfume từ comments
    const perfumesWithRating = await Promise.all(
      perfumes.map(async (p) => {
        const comments = await Comment.find({ perfumeId: p._id }).lean();
        let avgRating = 0;
        if (comments.length > 0) {
          const ratings = comments.map(c => c.rating || 0);
          avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        }
        
        return {
          ...p,
          perfumeName: p.perfumeName || p.name,
          avgRating: Number(avgRating.toFixed(1)),
          totalComments: comments.length
        };
      })
    );
    
    res.json({ perfumes: perfumesWithRating });
  } catch (e) {
    console.error('❌ Error loading perfumes:', e);
    res.status(500).json({ message: 'Failed to load perfumes' });
  }
});

router.get('/perfumes/:id', async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id).lean();
    if (!perfume) return res.status(404).json({ message: 'Not found' });
    const comments = await Comment.find({ perfumeId: perfume._id }).populate('userId', 'name').sort({ createdAt: -1 }).lean();
    res.json({ perfume, comments });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load perfume' });
  }
});

// Brands
router.get('/brands', async (_req, res) => {
  try {
    const brandDocs = await Brand.find({}, 'name').sort({ name: 1 }).lean();
    res.json({ brands: brandDocs });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load brands' });
  }
});

// Comments API
router.post('/comments/:id', requireAuth, commentController.addComment);
router.put('/comments/:id', requireAuth, commentController.editComment);
router.delete('/comments/:id', requireAuth, commentController.deleteComment);

// Users (admin)
router.get('/users', requireAdmin, async (_req, res) => {
  const users = await Member.find().lean();
  res.json({ users });
});

router.get('/users/toggle/:id', requireAdmin, async (req, res) => {
  const user = await Member.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ ok: true });
});

router.get('/users/delete/:id', requireAdmin, async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;


