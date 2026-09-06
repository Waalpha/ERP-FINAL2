import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  TenantWebsiteConfig,
  TenantWebsitePage,
  TenantWebsiteSection,
  TenantWebsiteSectionItem
} from '../../types';
import { PublicTenantWebsite } from '../../components/PublicWebsite/PublicTenantWebsite';
import {
  Globe,
  Layout,
  Palette,
  Phone,
  Eye,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Sparkles,
  Inbox,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface TenantWebsiteCMSProps {
  onOpenPublicSite?: () => void;
}

export const TenantWebsiteCMS: React.FC<TenantWebsiteCMSProps> = ({ onOpenPublicSite }) => {
  const { currentTenant, websiteConfig, updateWebsiteConfig, logAuditAction, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'pages' | 'theme' | 'contact' | 'inbox' | 'preview'>('pages');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activePageId, setActivePageId] = useState<string>(websiteConfig?.pages[0]?.id || 'page-home');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Working copy of website configuration
  const [config, setConfig] = useState<TenantWebsiteConfig>(() => {
    if (websiteConfig) return JSON.parse(JSON.stringify(websiteConfig));
    return {
      tenantId: currentTenant?.id || 'default',
      isPublished: true,
      displayPlatformBranding: false,
      theme: {
        primaryColor: currentTenant?.primaryColor || '#2563eb',
        secondaryColor: currentTenant?.secondaryColor || '#0f172a',
        accentColor: '#10b981',
        fontFamily: 'sans',
        heroLayout: 'split'
      },
      navigation: {
        logoUrl: currentTenant?.logoUrl || '',
        brandName: currentTenant?.name || 'My Organization',
        tagline: currentTenant?.motto || '',
        ctaButtonText: 'Get in Touch',
        ctaButtonLink: '#contact'
      },
      contact: {
        email: currentTenant?.contactEmail || '',
        phone: currentTenant?.phone || '',
        address: currentTenant?.address || '',
        openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
        socialLinks: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com'
        }
      },
      pages: [],
      updatedAt: new Date().toISOString()
    };
  });

  const activePage = config.pages.find(p => p.id === activePageId) || config.pages[0];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated: TenantWebsiteConfig = {
        ...config,
        updatedAt: new Date().toISOString()
      };
      await updateWebsiteConfig(updated);
      await logAuditAction({
        action: 'UPDATE',
        module: 'WEBSITE',
        record: `Website Config (${currentTenant?.name})`,
        result: 'SUCCESS',
        details: `Updated public website theme, pages (${config.pages.length}), and branding.`
      });
      setSaveSuccessMessage('Website changes successfully published & saved!');
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePage = (pageId: string, updates: Partial<TenantWebsitePage>) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => (p.id === pageId ? { ...p, ...updates } : p))
    }));
  };

  const updateSection = (pageId: string, sectionId: string, updates: Partial<TenantWebsiteSection>) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          sections: p.sections.map(s => (s.id === sectionId ? { ...s, ...updates } : s))
        };
      })
    }));
  };

  const addSection = (pageId: string, type: TenantWebsiteSection['type']) => {
    const newSection: TenantWebsiteSection = {
      id: `sec-${Date.now()}`,
      type,
      title: type === 'services' ? 'New Offerings & Services' : type === 'about' ? 'About Our Institution' : 'New Content Block',
      subtitle: 'Highlight your specialized services, academic curricula, or products.',
      content: 'Provide detailed information about your organization, mission, and achievements.',
      isVisible: true,
      order: 99,
      buttonText: 'Learn More',
      buttonLink: '#contact'
    };

    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          sections: [...p.sections, newSection]
        };
      })
    }));
  };

  const removeSection = (pageId: string, sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          sections: p.sections.filter(s => s.id !== sectionId)
        };
      })
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Publishing Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Tenant Website & CMS</h1>
              <p className="text-xs text-slate-500">
                Manage your public website pages, branding colors, imagery, and contact details in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenPublicSite && (
            <button
              onClick={onOpenPublicSite}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Website</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Website'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'pages'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Pages & Content Sections</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'theme'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Branding & Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & Locations</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Interactive Preview</span>
        </button>
      </div>

      {/* TAB 1: PAGES & CONTENT */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Pages List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Website Pages</h2>
                <button
                  onClick={() => {
                    const newPage: TenantWebsitePage = {
                      id: `page-${Date.now()}`,
                      slug: `page-${config.pages.length + 1}`,
                      title: 'New Page',
                      isPublished: true,
                      navOrder: config.pages.length + 1,
                      showInNav: true,
                      sections: []
                    };
                    setConfig(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
                    setActivePageId(newPage.id);
                  }}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Page</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {config.pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActivePageId(page.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activePageId === page.id
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{page.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">/{page.slug}</div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        page.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Page Settings */}
            {activePage && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Page Settings</h3>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={activePage.title}
                    onChange={e => updatePage(activePage.id, { title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={activePage.slug}
                    onChange={e => updatePage(activePage.id, { slug: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-700 font-medium">Show in Navigation Bar</span>
                  <input
                    type="checkbox"
                    checked={activePage.showInNav}
                    onChange={e => updatePage(activePage.id, { showInNav: e.target.checked })}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-700 font-medium">Published Publicly</span>
                  <input
                    type="checkbox"
                    checked={activePage.isPublished}
                    onChange={e => updatePage(activePage.id, { isPublished: e.target.checked })}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Sections on Active Page */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Sections on &quot;{activePage?.title}&quot;
                </h2>
                <p className="text-xs text-slate-500">
                  Customize headlines, marketing copy, images, and action buttons.
                </p>
              </div>

              {activePage && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => addSection(activePage.id, 'services')}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Services</span>
                  </button>
                  <button
                    onClick={() => addSection(activePage.id, 'about')}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add About</span>
                  </button>
                </div>
              )}
            </div>

            {activePage?.sections.map((sec, idx) => (
              <div key={sec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {sec.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1.5 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={sec.isVisible}
                        onChange={e => updateSection(activePage.id, sec.id, { isVisible: e.target.checked })}
                        className="h-3.5 w-3.5 text-indigo-600 rounded"
                      />
                      <span>Visible</span>
                    </label>

                    <button
                      onClick={() => removeSection(activePage.id, sec.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={e => updateSection(activePage.id, sec.id, { title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={sec.subtitle || ''}
                      onChange={e => updateSection(activePage.id, sec.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  {sec.content !== undefined && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Content Text</label>
                      <textarea
                        rows={3}
                        value={sec.content || ''}
                        onChange={e => updateSection(activePage.id, sec.id, { content: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={sec.imageUrl || ''}
                      onChange={e => updateSection(activePage.id, sec.id, { imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={sec.buttonText || ''}
                      onChange={e => updateSection(activePage.id, sec.id, { buttonText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BRANDING & THEME */}
      {activeTab === 'theme' && (
        <div className="max-w-4xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Brand Identity & Color Palette</h2>
            <p className="text-xs text-slate-500">
              Customize how your organization appears publicly to customers, parents, or patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={config.navigation.brandName}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    navigation: { ...prev.navigation, brandName: e.target.value }
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={config.navigation.tagline || ''}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    navigation: { ...prev.navigation, tagline: e.target.value }
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Logo Image URL</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={config.navigation.logoUrl || ''}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      navigation: { ...prev.navigation, logoUrl: e.target.value }
                    }))
                  }
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
                {config.navigation.logoUrl && (
                  <img
                    src={config.navigation.logoUrl}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-lg object-contain border border-slate-200 p-0.5 bg-white"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.theme.primaryColor}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value }
                    }))
                  }
                  className="h-10 w-14 rounded cursor-pointer border border-slate-200 p-1"
                />
                <input
                  type="text"
                  value={config.theme.primaryColor}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value }
                    }))
                  }
                  className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary / Dark Neutral</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.theme.secondaryColor}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      theme: { ...prev.theme, secondaryColor: e.target.value }
                    }))
                  }
                  className="h-10 w-14 rounded cursor-pointer border border-slate-200 p-1"
                />
                <input
                  type="text"
                  value={config.theme.secondaryColor}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      theme: { ...prev.theme, secondaryColor: e.target.value }
                    }))
                  }
                  className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Header Action Button Text</label>
              <input
                type="text"
                value={config.navigation.ctaButtonText || ''}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    navigation: { ...prev.navigation, ctaButtonText: e.target.value }
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* White-Label Control (MANDATORY REQUIREMENT) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Platform White-Labeling</h3>
                <p className="text-[11px] text-slate-500">
                  By default, public websites are 100% white-labeled with NO platform branding.
                </p>
              </div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={config.displayPlatformBranding}
                  onChange={e => setConfig(prev => ({ ...prev, displayPlatformBranding: e.target.checked }))}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>Display &quot;Powered by DAVETECH&quot;</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & LOCATIONS */}
      {activeTab === 'contact' && (
        <div className="max-w-4xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Official Contact & Opening Hours</h2>
            <p className="text-xs text-slate-500">
              Information displayed to the public for inquiries, customer support, and visits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={config.contact.email}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value }
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone / Hotline</label>
              <input
                type="text"
                value={config.contact.phone}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value }
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address / Campus / Store Location</label>
              <input
                type="text"
                value={config.contact.address}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    contact: { ...prev.contact, address: e.target.value }
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Working Hours</label>
              <input
                type="text"
                value={config.contact.openingHours || ''}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    contact: { ...prev.contact, openingHours: e.target.value }
                  }))
                }
                placeholder="e.g. Mon - Fri: 8:00 AM - 5:00 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={config.contact.socialLinks?.whatsapp || ''}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      socialLinks: { ...prev.contact.socialLinks, whatsapp: e.target.value }
                    }
                  }))
                }
                placeholder="https://wa.me/2547..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW */}
      {activeTab === 'preview' && currentTenant && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Device Viewport:</span>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    previewDevice === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {onOpenPublicSite && (
              <button
                onClick={onOpenPublicSite}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Fullscreen</span>
              </button>
            )}
          </div>

          <div className="flex justify-center bg-slate-100 p-4 rounded-3xl border border-slate-200 overflow-hidden">
            <div
              className={`transition-all duration-300 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-white ${
                previewDevice === 'mobile'
                  ? 'w-[375px] max-h-[800px] overflow-y-auto'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] max-h-[900px] overflow-y-auto'
                  : 'w-full max-h-[950px] overflow-y-auto'
              }`}
            >
              <PublicTenantWebsite
                tenant={currentTenant}
                websiteConfig={config}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
