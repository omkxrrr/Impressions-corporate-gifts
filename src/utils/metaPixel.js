import { META_PIXEL_ID as CONFIG_PIXEL_ID } from '../config';

/**
 * Meta (Facebook) Pixel Utility & Event Tracker
 * Fully compliant with Meta Conversions API & Browser Event Specifications.
 * Supports: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Lead, Contact.
 */

// Priority order: 1. localStorage override (admin settings), 2. .env / config, 3. window global
export const getMetaPixelId = () => {
  if (typeof window !== 'undefined') {
    const localId = localStorage.getItem('impressions_meta_pixel_id');
    if (localId && localId.trim()) return localId.trim();
    if (window.__META_PIXEL_ID__ && window.__META_PIXEL_ID__.trim()) {
      return window.__META_PIXEL_ID__.trim();
    }
  }
  return CONFIG_PIXEL_ID ? String(CONFIG_PIXEL_ID).trim() : '';
};

export const setMetaPixelId = (pixelId) => {
  if (typeof window !== 'undefined') {
    if (pixelId && pixelId.trim()) {
      localStorage.setItem('impressions_meta_pixel_id', pixelId.trim());
      initMetaPixel(pixelId.trim());
    } else {
      localStorage.removeItem('impressions_meta_pixel_id');
    }
  }
};

/**
 * Initialize Meta Pixel Base Script
 */
export const initMetaPixel = (pixelId) => {
  const activeId = pixelId || getMetaPixelId();
  if (!activeId || activeId === 'YOUR_PIXEL_ID_HERE') {
    return false;
  }

  if (typeof window === 'undefined') return false;

  // Initialize fbq queue if not loaded yet
  if (!window.fbq) {
    /* eslint-disable */
    (function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
  }

  try {
    if (window.fbq && window._meta_pixel_active_id !== activeId) {
      window.fbq('init', activeId);
      window._meta_pixel_active_id = activeId;
      return true;
    }
  } catch (err) {
    console.warn('Meta Pixel Init Warning:', err);
  }

  return false;
};

/**
 * Safe Event Dispatcher
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const activeId = getMetaPixelId();
  if (!activeId) return;

  try {
    if (params && Object.keys(params).length > 0) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
  } catch (err) {
    console.warn(`Meta Pixel Track [${eventName}] Warning:`, err);
  }
};

/**
 * Custom Event Dispatcher
 */
export const trackCustomEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('trackCustom', eventName, params);
  } catch (err) {
    console.warn(`Meta Pixel TrackCustom [${eventName}] Warning:`, err);
  }
};

// ============================================================================
// Standard Meta E-commerce & Lead Events
// ============================================================================

/**
 * PageView - Fired on every SPA route transition
 */
export const trackPageView = () => {
  trackEvent('PageView');
};

/**
 * ViewContent - Fired when viewing a product detail page
 */
export const trackViewContent = (product) => {
  if (!product) return;
  const price = parseFloat(product.salePrice || product.price || 0);
  trackEvent('ViewContent', {
    content_name: product.name,
    content_ids: [String(product.id || product.slug)],
    content_type: 'product',
    content_category: product.category || 'Corporate Gifts',
    value: isNaN(price) ? 0 : price,
    currency: 'INR'
  });
};

/**
 * AddToCart - Fired when an item is added to the cart
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  const unitPrice = parseFloat(product.salePrice || product.price || 0);
  const totalVal = (isNaN(unitPrice) ? 0 : unitPrice) * quantity;
  trackEvent('AddToCart', {
    content_name: product.name,
    content_ids: [String(product.id || product.slug)],
    content_type: 'product',
    content_category: product.category || 'Corporate Gifts',
    value: totalVal,
    currency: 'INR'
  });
};

/**
 * InitiateCheckout - Fired when starting checkout flow
 */
export const trackInitiateCheckout = (cartItems = [], totalAmount = 0) => {
  trackEvent('InitiateCheckout', {
    content_ids: (cartItems || []).map(item => String(item.id || item.slug)),
    content_type: 'product',
    num_items: (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0),
    value: parseFloat(totalAmount) || 0,
    currency: 'INR'
  });
};

/**
 * Purchase - Fired on confirmed quotation / order placement
 */
export const trackPurchase = (orderPayload = {}, totalAmount = 0, cartItems = []) => {
  trackEvent('Purchase', {
    content_ids: (cartItems || []).map(item => String(item.productId || item.id || item.slug)),
    content_type: 'product',
    num_items: (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0),
    value: parseFloat(totalAmount) || 0,
    currency: 'INR',
    order_id: String(orderPayload.id || Date.now())
  });
};

/**
 * Lead - Fired on Executive Corporate Quotation request submission
 */
export const trackLead = (leadType = 'Executive Quotation Request', details = {}) => {
  trackEvent('Lead', {
    content_name: leadType,
    currency: 'INR',
    ...details
  });
};

/**
 * Contact - Fired on direct WhatsApp or Phone enquiry clicks
 */
export const trackContact = (channel = 'WhatsApp', context = 'Catalog Enquiry') => {
  trackEvent('Contact', {
    content_name: channel,
    content_category: context
  });
};
