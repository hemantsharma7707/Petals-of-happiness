// Format price in Indian Rupees
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Truncate text
export const truncate = (text, length = 80) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Get image URL (handles both uploads and external URLs)
export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400';
  if (url.startsWith('http')) return url;
  return url; // relative /uploads/ path served by backend
};

// Validate Indian phone number
export const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

// Validate Indian pincode
export const validatePincode = (pin) => {
  return /^\d{6}$/.test(pin);
};

// Get status color class
export const getStatusClass = (status) => {
  const map = {
    Pending: 'status-pending',
    Confirmed: 'status-confirmed',
    Processing: 'status-processing',
    Ready: 'status-ready',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled',
  };
  return map[status] || 'status-pending';
};

// Debounce helper
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
