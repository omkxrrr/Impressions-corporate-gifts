import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '../utils/metaPixel';

/**
 * MetaPixelTracker Component
 * Automatically initializes Meta Pixel on app mount and tracks PageView on every route transition.
 */
const MetaPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
};

export default MetaPixelTracker;
