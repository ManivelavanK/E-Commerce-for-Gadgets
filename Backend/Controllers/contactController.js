const Contact = require('../Models/Contact');

const createContact = async (req, res) => {
  try {
    const { name, email, orderId, subject, message } = req.body;

    console.log('📧 CONTACT FORM DATA:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Order ID:', orderId);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toLocaleString());
    console.log('-------------------');

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide name, email, subject, and message' });
    }

    const contact = await Contact.create({
      name,
      email,
      orderId,
      subject,
      message
    });

    console.log('✅ Contact form submitted successfully by:', name);

    res.status(201).json({
      message: 'Contact request submitted successfully',
      contact
    });
  } catch (error) {
    console.error('Contact creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContact, getContacts };