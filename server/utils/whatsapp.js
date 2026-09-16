/**
 * Generates a professionally formatted WhatsApp message for a new order.
 */
const generateWhatsAppMessage = (order) => {
  const divider = '━━━━━━━━━━━━━━━━━━━━';

  let itemsText = order.items
    .map((item, i) => {
      let line = `${i + 1}. ${item.name}\n`;
      if (item.selectedColor) line += `   🎨 Color: ${item.selectedColor}\n`;
      if (item.selectedVariants && item.selectedVariants.size > 0) {
        for (const [key, val] of item.selectedVariants) {
          line += `   ${key}: ${val}\n`;
        }
      }
      if (item.customization) line += `   ✏️ Note: ${item.customization}\n`;
      line += `   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}`;
      return line;
    })
    .join('\n\n');

  const message = `🧶 NEW ORDER — PETALS OF HAPPINESS

Order ID: #${order.orderId}

${divider}

👤 CUSTOMER
Name: ${order.customerName}
Phone: ${order.phone}

📍 DELIVERY ADDRESS
Address: ${order.address}
City: ${order.city}
Pincode: ${order.pincode}

${divider}

🛍️ ORDER DETAILS

${itemsText}

${divider}

💰 TOTAL: ₹${order.total.toLocaleString('en-IN')}

📋 Order Status: ${order.orderStatus}

Thank you for ordering from Petals of Happiness! 🌸`;

  return encodeURIComponent(message);
};

/**
 * Returns the WhatsApp click-to-chat URL.
 */
const getWhatsAppURL = (order) => {
  const number = process.env.WHATSAPP_NUMBER || '';
  const encodedMessage = generateWhatsAppMessage(order);
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

module.exports = { generateWhatsAppMessage, getWhatsAppURL };
