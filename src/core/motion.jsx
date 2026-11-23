import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const LenisCtx = createContext(null);
export const useLenis = () => useContext(LenisCtx);

export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    if (reduced()) return undefined;
    const l = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    ref.current = l; setLenis(l);
    l.on('scroll', ScrollTrigger.update);
    const tick = t => l.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); l.destroy(); ref.current = null; };
  }, []);

  useLayoutEffect(() => {
    ref.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = setTimeout(() => ScrollTrigger.refresh(), 350);
    return () => clearTimeout(id);
  }, [pathname]);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}

// Stop/start the smooth scroller (used by overlays/drawers)
export function useLockScroll(locked) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) { document.body.style.overflow = locked ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }
    locked ? lenis.stop() : lenis.start();
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { lenis.start(); document.body.style.overflow = ''; };
  }, [locked, lenis]);
}

// gsap.context scoped to a ref; re-runs when deps change (e.g. language / direction)
export function useGsap(fn, deps = []) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => fn(scope.current), scope);
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => { clearTimeout(id); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}
