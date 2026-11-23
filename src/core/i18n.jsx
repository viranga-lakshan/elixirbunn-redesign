import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import config from '../client/config.js';
import copy from '../client/copy.js';

const Ctx = createContext(null);
const read = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => read('lang', 'en'));
  const [currency, setCurrencyState] = useState(() => read('cur', config.currency.default));

  useEffect(() => {
    Object.entries(config.colors).forEach(([k, v]) => document.documentElement.style.setProperty(`--${k}`, v));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `${config.name[lang]} — ${config.tagline[lang]}`;
  }, [lang]);

  const setLang = useCallback(l => { setLangState(l); write('lang', l); }, []);
  const setCurrency = useCallback(c => { setCurrencyState(c); write('cur', c); }, []);

  const value = useMemo(() => {
    const tr = o => (o ? (o[lang] ?? o.en ?? '') : '');
    const nf = new Intl.NumberFormat(lang === 'ar' ? 'ar-u-nu-latn' : 'en-US', { style: 'currency', currency, maximumFractionDigits: currency === 'USD' ? 2 : 0 });
    const fmt = p => nf.format(typeof p === 'object' ? p[currency] : p);
    return { lang, dir: lang === 'ar' ? 'rtl' : 'ltr', isAr: lang === 'ar', setLang, currency, setCurrency, tr, fmt, c: copy, config };
  }, [lang, currency, setLang, setCurrency]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
