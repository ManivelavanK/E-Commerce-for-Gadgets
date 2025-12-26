const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Email templates
const emailTemplates = {
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mani's Gadgets</h1>
          <p style="color: white; margin: 10px 0 0 0;">Order Confirmation</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Hi ${user.name},</h2>
          <p style="color: #666; font-size: 16px;">Thank you for your order! We've received your order and are preparing it for shipment.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Items Ordered</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p style="margin: 0; font-weight: bold;">${item.name}</p>
                <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × ₹${item.price.toLocaleString()}</p>
              </div>
            `).join('')}
          </div>
          
          ${order.shippingAddress ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
              <p style="margin: 0; color: #666;">
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                ${order.shippingAddress.zipCode}
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">We'll send you another email when your order ships!</p>
            <p style="color: #666;">Questions? Contact us at support@manisgadgets.com</p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 Mani's Gadgets. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  orderStatusUpdate: (order, user, newStatus) => ({
    subject: `Order Update - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mani's Gadgets</h1>
          <p style="color: white; margin: 10px 0 0 0;">Order Status Update</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Hi ${user.name},</h2>
          <p style="color: #666; font-size: 16px;">Your order status has been updated!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin-top: 0;">Order #${order._id.toString().slice(-8).toUpperCase()}</h3>
            <div style="background: ${newStatus === 'delivered' ? '#10b981' : '#3b82f6'}; color: white; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold;">
              Status: ${newStatus.toUpperCase()}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            ${newStatus === 'shipped' ? 
              '<p style="color: #666;">Your order is on its way! You should receive it within 2-3 business days.</p>' :
              newStatus === 'delivered' ?
              '<p style="color: #666;">Your order has been delivered! We hope you enjoy your purchase.</p>' :
              '<p style="color: #666;">We\'ll keep you updated on your order progress.</p>'
            }
            <p style="color: #666;">Questions? Contact us at support@manisgadgets.com</p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 Mani's Gadgets. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request - Mani\'s Gadgets',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mani's Gadgets</h1>
          <p style="color: white; margin: 10px 0 0 0;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Hi ${user.name},</h2>
          <p style="color: #666; font-size: 16px;">We received a request to reset your password. Click the button below to reset it:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
               style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}</p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 Mani's Gadgets. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  newsletter: (user, subject, content) => ({
    subject: subject || 'Newsletter - Mani\'s Gadgets',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mani's Gadgets</h1>
          <p style="color: white; margin: 10px 0 0 0;">Newsletter</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Hi ${user.name},</h2>
          ${content}
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 Mani's Gadgets. All rights reserved.</p>
          <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
            <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #999;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Mani's Gadgets" <${process.env.EMAIL_USER || 'noreply@manisgadgets.com'}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendOrderConfirmation = async (order, user) => {
  const template = emailTemplates.orderConfirmation(order, user);
  return await sendEmail(user.email, template);
};

const sendOrderStatusUpdate = async (order, user, newStatus) => {
  const template = emailTemplates.orderStatusUpdate(order, user, newStatus);
  return await sendEmail(user.email, template);
};

const sendPasswordReset = async (user, resetToken) => {
  const template = emailTemplates.passwordReset(user, resetToken);
  return await sendEmail(user.email, template);
};

const sendNewsletter = async (user, subject, content) => {
  const template = emailTemplates.newsletter(user, subject, content);
  return await sendEmail(user.email, template);
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendPasswordReset,
  sendNewsletter,
  emailTemplates
};