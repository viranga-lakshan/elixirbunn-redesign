import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import { I18nProvider } from './core/i18n.jsx';
import { CartProvider } from './core/cart.jsx';
import { SmoothScroll } from './core/motion.jsx';
import { Cursor } from './core/ui.jsx';
import { Preloader, Header, CartDrawer, Toast, OrderPill, Footer } from './components/Shell.jsx';
import { Home, Shop, Product, Story, Branches, Wholesale, Info, Checkout, NotFound } from './pages/Pages.jsx';

function App() {
  return (
    <HashRouter>
      <I18nProvider>
        <CartProvider>
          <SmoothScroll>
            <Preloader />
            <Cursor />
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/story" element={<Story />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/info/:id" element={<Info />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <OrderPill />
            <CartDrawer />
            <Toast />
          </SmoothScroll>
        </CartProvider>
      </I18nProvider>
    </HashRouter>
  );
}
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
