const Newsletter = require('../Models/Newsletter');
// const { sendNewsletter } = require('../utils/emailService');

// Temporary placeholder for email service
const sendNewsletter = async (user, subject, content) => {
  console.log(`📧 Newsletter email would be sent to ${user.email}: ${subject}`);
  return Promise.resolve();
};

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email, name, source } = req.body;
    
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = undefined;
        if (name) existing.name = name;
        await existing.save();
        return res.json({ message: 'Successfully resubscribed to newsletter!' });
      }
    }
    
    // Create new subscription
    const subscription = new Newsletter({
      email,
      name: name || '',
      source: source || 'website'
    });
    
    await subscription.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscription = await Newsletter.findOne({ email });
    if (!subscription) {
      return res.status(404).json({ message: 'Email not found in newsletter' });
    }
    
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();
    
    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subscribers (admin only)
const getSubscribers = async (req, res) => {
  try {
    const { active = 'true', page = 1, limit = 50 } = req.query;
    
    const filter = active === 'true' ? { isActive: true } : {};
    
    const subscribers = await Newsletter.find(filter)
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Newsletter.countDocuments(filter);
    
    res.json({
      subscribers,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send newsletter to all subscribers (admin only)
const sendNewsletterToAll = async (req, res) => {
  try {
    const { subject, content } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }
    
    const subscribers = await Newsletter.find({ isActive: true });
    
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }
    
    let successCount = 0;
    let failureCount = 0;
    
    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        try {
          const user = { name: subscriber.name || 'Valued Customer', email: subscriber.email };
          await sendNewsletter(user, subject, content);
          successCount++;
        } catch (error) {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
          failureCount++;
        }
      });
      
      await Promise.all(promises);
      
      // Add delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    res.json({
      message: 'Newsletter sending completed',
      totalSubscribers: subscribers.length,
      successCount,
      failureCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get newsletter statistics (admin only)
const getStats = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
    const inactiveSubscribers = await Newsletter.countDocuments({ isActive: false });
    
    // Get subscription trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubscriptions = await Newsletter.countDocuments({
      subscribedAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      totalSubscribers,
      activeSubscribers,
      inactiveSubscribers,
      recentSubscriptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
  sendNewsletterToAll,
  getStats
};