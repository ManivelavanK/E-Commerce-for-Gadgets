const PDFDocument = require('pdfkit');

const generateOrderBill = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks = [];

      doc.on('data', chunk => {
        chunks.push(chunk);
      });
      
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      
      doc.on('error', (error) => {
        console.error('PDF document error:', error);
        reject(error);
      });

      // Header with gradient background
      doc.rect(0, 0, 612, 120).fill('#4A90E2');
      
      // Shop name in white
      doc.fillColor('#FFFFFF')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('GADGETORY MART', 50, 30);
      
      // Tagline
      doc.fontSize(12)
         .font('Helvetica')
         .text('Your Technology Partner', 50, 65);
      
      // Invoice title
      doc.fillColor('#FFD700')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('INVOICE', 450, 40);
      
      // Order details in header
      doc.fillColor('#FFFFFF')
         .fontSize(10)
         .font('Helvetica')
         .text(`Order ID: ${order._id.toString().slice(-8).toUpperCase()}`, 450, 70)
         .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 450, 85)
         .text(`Time: ${new Date(order.createdAt).toLocaleTimeString('en-IN')}`, 450, 100);

      // Reset to black for body content
      doc.fillColor('#000000');

      // Customer Details Section
      let yPos = 150;
      doc.rect(40, yPos - 10, 250, 120).stroke('#E0E0E0').fillAndStroke('#F8F9FA', '#E0E0E0');
      
      doc.fillColor('#2C3E50')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('BILL TO:', 50, yPos);
      
      doc.fillColor('#000000')
         .fontSize(11)
         .font('Helvetica')
         .text(`${user.name || 'N/A'}`, 50, yPos + 25)
         .text(`${user.email || 'N/A'}`, 50, yPos + 40);

      if (order.shippingAddress) {
        const addr = order.shippingAddress;
        doc.text(`${addr.street || ''}`, 50, yPos + 55)
           .text(`${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}`, 50, yPos + 70)
           .text(`${addr.country || 'India'}`, 50, yPos + 85);
      }

      // Payment Details Section
      doc.rect(320, yPos - 10, 230, 120).stroke('#E0E0E0').fillAndStroke('#F0F8FF', '#E0E0E0');
      
      doc.fillColor('#2C3E50')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('PAYMENT INFO:', 330, yPos);
      
      doc.fillColor('#000000')
         .fontSize(11)
         .font('Helvetica')
         .text('Method:', 330, yPos + 25)
         .text((order.paymentMethod || 'COD').toUpperCase(), 380, yPos + 25);
      
      doc.text('Status:', 330, yPos + 45);
      // Always show as COMPLETED for downloaded bills
      doc.fillColor('#27AE60')
         .font('Helvetica-Bold')
         .text('COMPLETED', 380, yPos + 45);

      // Items Table
      yPos = 300;
      
      // Table header with blue background
      doc.rect(40, yPos, 530, 25).fill('#4A90E2');
      
      doc.fillColor('#FFFFFF')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('ITEM', 50, yPos + 8)
         .text('QTY', 300, yPos + 8)
         .text('PRICE', 360, yPos + 8)
         .text('TOTAL', 480, yPos + 8);

      yPos += 25;
      let itemCount = 0;

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          
          // Alternate row colors
          const bgColor = itemCount % 2 === 0 ? '#FFFFFF' : '#F8F9FA';
          doc.rect(40, yPos, 530, 25).fill(bgColor);
          
          doc.fillColor('#000000')
             .fontSize(10)
             .font('Helvetica')
             .text(item.name || 'Unknown Item', 50, yPos + 8, { width: 240 })
             .text((item.quantity || 1).toString(), 310, yPos + 8)
             .text(`₹${(item.price || 0).toFixed(2)}`, 360, yPos + 8)
             .text(`₹${itemTotal.toFixed(2)}`, 480, yPos + 8);
          
          yPos += 25;
          itemCount++;
        });
      }

      // Total Section with green background
      yPos += 10;
      doc.rect(350, yPos, 220, 30).fill('#E8F5E8').stroke('#27AE60');
      
      doc.fillColor('#27AE60')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('TOTAL AMOUNT:', 360, yPos + 8)
         .text(`₹${(order.totalAmount || 0).toFixed(2)}`, 480, yPos + 8);

      // Footer with company info
      yPos += 80;
      doc.rect(40, yPos, 530, 60).fill('#F0F8FF').stroke('#4A90E2');
      
      doc.fillColor('#2C3E50')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Thank you for shopping with Gadgetory Mart!', 50, yPos + 15);
      
      doc.fillColor('#666666')
         .fontSize(10)
         .font('Helvetica')
         .text('For support: support@manigadgets.com | Phone: +91-XXXXXXXXXX', 50, yPos + 35);

      doc.end();
    } catch (error) {
      console.error('Error in PDF generation:', error);
      reject(error);
    }
  });
};

module.exports = { generateOrderBill };