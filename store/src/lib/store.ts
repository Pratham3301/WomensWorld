import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
            )
          }
        }
        return { items: [...state.items, { ...item, quantity: qty }] }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => 
          i.id === id ? { ...i, quantity } : i
        )
      })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'womens-world-cart',
    }
  )
)

export interface WishlistItem {
  id: string; // product id
  name: string;
  price: number;
  discountPrice?: number | null;
  image?: string;
  categorySlug?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => set((state) => {
        const exists = state.items.some((i) => i.id === item.id);
        if (exists) {
          return { items: state.items.filter((i) => i.id !== item.id) };
        }
        return { items: [...state.items, item] };
      }),
      hasItem: (id) => get().items.some((i) => i.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'womens-world-wishlist',
    }
  )
)
