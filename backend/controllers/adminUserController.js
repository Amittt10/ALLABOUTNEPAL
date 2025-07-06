import User from '../models/User.js';

export const getUsersPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      // current page
    const limit = parseInt(req.query.limit) || 20;   // users per page

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('fullname username email role verified createdAt'); // fields to return

    res.json({
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    console.error('Paginated users fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
