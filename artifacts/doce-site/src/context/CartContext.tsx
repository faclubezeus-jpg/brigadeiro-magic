import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartItem {
  id: number;
  type: "sweet" | "cake" | "kit";
  name: string;
  price?: string | null;
  imageUrl?: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number, type: CartItem["type"]) => void;
  updateQty: (id: number, type: CartItem["type"], quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  buildWhatsAppMessage: (whatsappNumber: string, defaultMsg: string) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === item.type);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number, type: CartItem["type"]) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
  }, []);

  const updateQty = useCallback((id: number, type: CartItem["type"], quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
    } else {
      setItems(prev =>
        prev.map(i => i.id === id && i.type === type ? { ...i, quantity } : i)
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const buildWhatsAppMessage = useCallback((whatsappNumber: string, defaultMsg: string) => {
    if (items.length === 0) {
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`;
    }

    const lines = [
      "🍫 *Pedido — Docinho O Docinho*",
      "",
      "*Itens do pedido:*",
      ...items.map(i => {
        const price = i.price ? ` — ${i.price}` : "";
        return `• ${i.name}${price} (x${i.quantity})`;
      }),
      "",
      `*Total de itens:* ${totalItems}`,
      "",
      "Aguardo confirmação e informações de entrega! 💝",
    ];

    const message = lines.join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [items, totalItems]);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, isOpen, openCart, closeCart, buildWhatsAppMessage,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
