import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import products from '../client/products.json';
import config from '../client/config.js';

const Ctx = createContext(null);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export const getProduct = id => products.find(p => p.id === id);
export const unitPrice = p => p.sale ?? p.price;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load('cart', []));
  const [wish, setWish] = useState(() => load('wish', []));
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => save('cart', items), [items]);
  useEffect(() => save('wish', wish), [wish]);

  const add = useCallback((id, qty = 1, grind = 0) => {
    setItems(cur => {
      const i = cur.findIndex(x => x.id === id && x.grind === grind);
      if (i > -1) { const n = [...cur]; n[i] = { ...n[i], qty: n[i].qty + qty }; return n; }
      return [...cur, { id, qty, grind }];
    });
    setToast({ id, t: Date.now() });
  }, []);
  const setQty = useCallback((id, grind, qty) => setItems(cur => cur.map(x => (x.id === id && x.grind === grind ? { ...x, qty: Math.max(1, qty) } : x))), []);
  const remove = useCallback((id, grind) => setItems(cur => cur.filter(x => !(x.id === id && x.grind === grind))), []);
  const clear = useCallback(() => setItems([]), []);
  const toggleWish = useCallback(id => setWish(cur => (cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id])), []);

  const value = useMemo(() => {
    const lines = items.map(x => ({ ...x, product: getProduct(x.id) })).filter(l => l.product);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    // sale only has SAR; USD derived proportionally
    const sub = cur => lines.reduce((s, l) => {
      const p = l.product; const u = p.sale && cur === 'USD' ? (p.price.USD * p.sale.SAR) / p.price.SAR : unitPrice(p)[cur];
      return s + u * l.qty;
    }, 0);
    return { items: lines, count, subtotal: sub, shipping: cur => config.shipping[cur], add, setQty, remove, clear, wish, toggleWish, open, setOpen, toast, setToast };
  }, [items, wish, open, toast, add, setQty, remove, clear, toggleWish]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
