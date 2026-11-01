import { useState, useEffect } from 'react';
import { getMetaPixelId, setMetaPixelId, trackEvent } from '../../utils/metaPixel';
import { ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, Save, RefreshCw } from 'lucide-react';

const AdminSettings = () => {
  const [pixelId, setPixelId] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const current = getMetaPixelId();
    setPixelId(current);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setMetaPixelId(pixelId.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestEvent = () => {
    trackEvent('PageView');
    trackEvent('Lead', { test_event: true, note: 'Admin Settings Test' });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  const isConfigured = Boolean(pixelId && pixelId.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-900">Store Settings &amp; Tracking Integrations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage advertising tracking pixels, analytics IDs, and store configurations.
        </p>
      </div>

      {/* Meta Pixel Configuration Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              f
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Meta Pixel (Facebook Ads)</h2>
              <p className="text-xs text-gray-500">Track website visitors, retarget customers, and optimize ad campaigns.</p>
            </div>
          </div>
          <div>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active &amp; Tracking
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" />
                Pixel Not Configured
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Meta Pixel ID saved successfully! All pageviews and conversion events are now active.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Meta Pixel ID (15 - 16 Digits)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value.replace(/\s+/g, ''))}
                placeholder="e.g. 1234567890123456"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-sm text-gray-900 transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Pixel ID</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can find your Pixel ID inside Meta Events Manager under <strong>Data Sources &gt; Settings &gt; Dataset ID / Pixel ID</strong>.
            </p>
          </div>

          {isConfigured && (
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Current active ID: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-800">{pixelId}</code>
              </div>
              <button
                type="button"
                onClick={handleTestEvent}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testSent ? 'animate-spin text-blue-600' : ''}`} />
                <span>{testSent ? 'Test Events Dispatched!' : 'Fire Test PageView &amp; Lead Event'}</span>
              </button>
            </div>
          )}
        </form>

        {/* Integrated Events Breakdown */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Standard Events Automatically Tracked:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block font-mono">PageView</span>
              <span className="text-gray-500">Triggers on every page visit and SPA route navigation.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block font-mono">ViewContent</span>
              <span className="text-gray-500">Triggers when a product details page is opened.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block font-mono">AddToCart</span>
              <span className="text-gray-500">Triggers when an item is added to cart or shortlist.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block font-mono">InitiateCheckout</span>
              <span className="text-gray-500">Triggers when the user opens the checkout page.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block font-mono">Purchase</span>
              <span className="text-gray-500">Triggers upon successful quotation / order completion.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block font-mono">Lead / Contact</span>
              <span className="text-gray-500">Triggers on corporate form submit &amp; WhatsApp inquiries.</span>
            </div>
          </div>
        </div>

        {/* Verification Tips */}
        <div className="p-6 bg-blue-50/50 border-t border-blue-100 text-xs text-blue-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">How to verify your Meta Pixel setup:</span>
            <p className="text-blue-800 leading-relaxed">
              Install the official <a href="https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc" target="_blank" rel="noreferrer" className="underline font-semibold inline-flex items-center gap-1">Meta Pixel Helper Chrome Extension <ExternalLink className="w-3 h-3" /></a> to verify real-time event signals directly on your live website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
