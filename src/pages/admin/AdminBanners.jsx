import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  Flame, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Edit2
} from 'lucide-react';
import { getHeroBanners, saveHeroBanners, uploadBannerImage, DEFAULT_BANNERS } from '../../services/bannerService';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  // Load banners on component mount
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await getHeroBanners();
      setBanners(data);
    } catch (err) {
      setBanners(DEFAULT_BANNERS);
    } finally {
      setLoading(false);
    }
  };

  // Show temporary feedback message
  const showFeedback = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 6000);
  };

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processAndAutoPublish(files[0]);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      await processAndAutoPublish(files[0]);
    }
  };

  /**
   * AUTOMATIC UPLOAD & PUBLISH ON DROP
   * When user drops or chooses an image, this immediately:
   * 1. Compresses & uploads to cloud
   * 2. Adds banner to slider as Position #1
   * 3. Saves to cloud + localStorage
   * 4. Makes it live immediately!
   */
  const processAndAutoPublish = async (file) => {
    if (!file.type.startsWith('image/')) {
      showFeedback('Please select a valid image file (.jpg, .png, .webp)', 'error');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to cloud / CDN
      const publicUrl = await uploadBannerImage(file);

      // 2. Automatically create new active banner item
      const newLiveBanner = {
        id: `banner-${Date.now()}`,
        pillText: 'Diwali 2026 • Festive Corporate Desk',
        pillType: 'festive',
        titlePrefix: 'Grand Festive Curation &',
        titleHighlight: 'Diwali Gift Suites',
        description: 'Bespoke corporate Diwali hampers, luxury dry fruits, brassware and branded executive gifts.',
        ctaText: 'Explore Diwali Hampers',
        ctaLink: '/shop',
        secondaryCtaText: 'Request Diwali Proposal',
        enquiryTopic: 'Diwali 2026 Corporate Festive Gifting Suites',
        bannerImg: publicUrl,
        isActive: true,
        highlights: [
          { value: 'Bespoke', label: 'Festive Hampers' },
          { value: 'Custom', label: 'Logo Embossing' },
          { value: 'Pan-India', label: 'Consolidated Dispatch' }
        ]
      };

      // 3. Put at Position #1 in the slider
      const updatedList = [newLiveBanner, ...banners];
      setBanners(updatedList);

      // 4. Save to both cloud & local storage
      await saveHeroBanners(updatedList);

      showFeedback('Banner uploaded successfully & is now LIVE at Position #1 on your homepage!');
    } catch (err) {
      showFeedback('Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Toggle active status
  const handleToggleActive = async (id) => {
    const updated = banners.map(b => b.id === id ? { ...b, isActive: b.isActive === false ? true : false } : b);
    setBanners(updated);
    await saveHeroBanners(updated);
    showFeedback('Banner visibility updated.');
  };

  // Delete banner
  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to remove this banner from the slider?')) return;
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated);
    await saveHeroBanners(updated);
    showFeedback('Banner deleted.');
  };

  // Move banner Up (earlier in slider)
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const copy = [...banners];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setBanners(copy);
    await saveHeroBanners(copy);
  };

  // Move banner Down (later in slider)
  const handleMoveDown = async (index) => {
    if (index === banners.length - 1) return;
    const copy = [...banners];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setBanners(copy);
    await saveHeroBanners(copy);
  };

  // Save edits on a banner
  const handleSaveEdit = async (bannerId, editedFields) => {
    const updated = banners.map(b => b.id === bannerId ? { ...b, ...editedFields } : b);
    setBanners(updated);
    await saveHeroBanners(updated);
    setEditingId(null);
    showFeedback('Banner details updated & saved live.');
  };

  // Reset to factory defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all hero banners back to factory defaults (Diwali, Corporate, Brands)?')) return;
    setBanners(DEFAULT_BANNERS);
    await saveHeroBanners(DEFAULT_BANNERS);
    showFeedback('Reset to default curated banners.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Hero Banner Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop your Diwali or campaign banner. It automatically uploads and goes live on the homepage immediately.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleResetDefaults}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Reset to factory defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-xs transition-all ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer">✕</button>
        </div>
      )}

      {/* 1. Drag & Drop Upload Zone (Instant Auto-Publish) */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 via-amber-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-950">Drag & Drop Banner (Instant Live Upload)</h2>
              <p className="text-xs text-gray-600">Drop your banner image here — it uploads and goes live on the homepage immediately!</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full self-start sm:self-center">
            Recommended: 1200 x 675 px (16:9)
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragOver 
                ? 'border-amber-500 bg-amber-100/60 scale-[1.01] shadow-lg' 
                : 'border-amber-300 hover:border-amber-500 bg-[#faf8f5] hover:bg-amber-50/50'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />

            {uploading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
                <p className="text-sm font-bold text-amber-900">Uploading banner image & publishing live to homepage...</p>
                <p className="text-xs text-gray-500">Optimizing resolution for instant mobile and desktop loading</p>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shadow-2xs">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    Drag and drop your Diwali or festive banner image here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Or <span className="text-amber-700 font-bold underline">click to browse files</span> from your computer (.jpg, .png, .webp)
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drop image → Automatically publishes to Position #1 in live slider</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Live Active Banners List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900">Live Homepage Slider Banners ({banners.length})</h2>
            <p className="text-xs text-gray-500">Order from 1 to {banners.length}. Visitors see these banners rotating in this sequence.</p>
          </div>
          <span className="text-xs text-gray-400">
            Auto-rotates every 6 seconds on homepage
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No banners active. Drop an image in the box above to add a banner.
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((b, idx) => (
              <div 
                key={b.id || idx}
                className={`p-5 rounded-2xl border transition-all ${
                  b.isActive === false 
                    ? 'bg-gray-50/70 border-gray-200 opacity-60' 
                    : 'bg-white border-amber-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Sequence Badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1 font-medium">Position</span>
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="w-28 h-20 rounded-xl bg-gray-100 border border-amber-200 overflow-hidden flex items-center justify-center shrink-0 relative group">
                      {b.bannerImg ? (
                        <img 
                          src={b.bannerImg} 
                          alt={b.titleHighlight || 'Banner'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="text-[10px] font-bold text-amber-800 p-2 text-center leading-tight">
                          Text Banner
                        </div>
                      )}
                      {b.bannerImg && (
                        <a 
                          href={b.bannerImg} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
                        >
                          View Full
                        </a>
                      )}
                    </div>

                    {/* Banner Info */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {b.pillText || 'Banner'}
                        </span>
                        {b.isActive === false ? (
                          <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                            Hidden from Website
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Now
                          </span>
                        )}
                        {b.bannerImg && (
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            Graphic Image Banner
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-base text-gray-900 mt-1.5">
                        {b.titlePrefix} <span className="text-primary italic">{b.titleHighlight}</span>
                      </h3>
                      
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xl mt-0.5">
                        {b.description || 'Custom corporate banner'}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                        <span><strong>Button:</strong> {b.ctaText || 'Explore'}</span>
                        <span>•</span>
                        <span><strong>Link:</strong> <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px] text-gray-700">{b.ctaLink || '/shop'}</code></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-20 transition-colors cursor-pointer"
                      title="Move to earlier position"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === banners.length - 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-20 transition-colors cursor-pointer"
                      title="Move to later position"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Edit Details */}
                    <button
                      onClick={() => setEditingId(editingId === b.id ? null : b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                        editingId === b.id 
                          ? 'bg-amber-100 border-amber-300 text-amber-900' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{editingId === b.id ? 'Close' : 'Edit Details'}</span>
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        b.isActive === false 
                          ? 'border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200' 
                          : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {b.isActive === false ? 'Hidden' : 'Live Active'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Edit Panel */}
                {editingId === b.id && (
                  <div className="mt-5 pt-4 border-t border-amber-200/80 bg-amber-50/40 p-4 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Edit Banner Text & Links for #{idx + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Badge Text</label>
                        <input 
                          type="text" 
                          defaultValue={b.pillText} 
                          id={`edit-pill-${b.id}`}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Gold Highlight Word</label>
                        <input 
                          type="text" 
                          defaultValue={b.titleHighlight} 
                          id={`edit-highlight-${b.id}`}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-amber-700" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Button Text</label>
                        <input 
                          type="text" 
                          defaultValue={b.ctaText} 
                          id={`edit-cta-${b.id}`}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Button Link URL</label>
                        <input 
                          type="text" 
                          defaultValue={b.ctaLink} 
                          id={`edit-link-${b.id}`}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const pillText = document.getElementById(`edit-pill-${b.id}`).value;
                          const titleHighlight = document.getElementById(`edit-highlight-${b.id}`).value;
                          const ctaText = document.getElementById(`edit-cta-${b.id}`).value;
                          const ctaLink = document.getElementById(`edit-link-${b.id}`).value;
                          handleSaveEdit(b.id, { pillText, titleHighlight, ctaText, ctaLink });
                        }}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Save & Update Live
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminBanners;
