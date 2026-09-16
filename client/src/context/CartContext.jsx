import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_KEY = 'poh_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = (product, quantity = 1, selectedColor = '', selectedVariants = {}, customization = '') => {
    const key = `${product._id}-${selectedColor}-${JSON.stringify(selectedVariants)}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} in stock`);
          return prev;
        }
        return prev.map((i) => (i.key === key ? { ...i, quantity: newQty } : i));
      }

      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} in stock`);
        return prev;
      }

      const effectivePrice = product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;

      return [
        ...prev,
        {
          key,
          productId: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: effectivePrice,
          stock: product.stock,
          quantity,
          selectedColor,
          selectedVariants,
          customization,
        },
      ];
    });
  };

  const updateQuantity = (key, quantity) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.key !== key) return item;
        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} in stock`);
          return item;
        }
        return { ...item, quantity };
      })
    );
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setItems([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
