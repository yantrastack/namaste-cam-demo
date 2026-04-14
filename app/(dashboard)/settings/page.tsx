"use client";

import { useState, useEffect, useCallback } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

// Dynamic configuration for settings sections
const SETTINGS_CONFIG = {
  general: {
    id: "general",
    label: "General Settings",
    icon: "settings",
    fields: [
      {
        key: "businessName",
        label: "BUSINESS NAME",
        type: "text",
        defaultValue: "Namaste Cambridge",
        validation: { required: true, minLength: 2 }
      },
      {
        key: "supportEmail",
        label: "SUPPORT EMAIL",
        type: "email",
        defaultValue: "admin@namastecambridge.co.uk",
        validation: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
      },
      {
        key: "globalDeliveryFee",
        label: "GLOBAL DELIVERY FEE (£)",
        type: "number",
        defaultValue: "3.50",
        validation: { required: true, min: 0, max: 100 }
      },
      {
        key: "maintenanceMode",
        label: "Maintenance Mode",
        type: "toggle",
        defaultValue: false,
        description: "Disable customer app ordering"
      },
      {
        key: "platformLogo",
        label: "PLATFORM LOGO",
        type: "file",
        accept: "image/*",
        maxSize: 2 * 1024 * 1024, // 2MB
        description: "PNG, JPG or SVG. Max 2MB."
      }
    ]
  },
  banners: {
    id: "banners",
    label: "Home Screen Banners",
    icon: "image",
    fields: [
      {
        key: "title",
        label: "BANNER TITLE",
        type: "text",
        validation: { required: true, maxLength: 100 }
      },
      {
        key: "sortOrder",
        label: "SORT ORDER",
        type: "number",
        validation: { required: true, min: 1 }
      },
      {
        key: "linkUrl",
        label: "LINK URL",
        type: "text",
        validation: { required: true }
      },
      {
        key: "active",
        label: "Active",
        type: "toggle",
        description: "Show this banner on home screen"
      },
      {
        key: "imageUrl",
        label: "Banner Image",
        type: "file",
        accept: "image/*",
        aspectRatio: "16:9"
      }
    ]
  },
  delivery: {
    id: "delivery",
    label: "Delivery Zones",
    icon: "delivery_dining",
    fields: [
      {
        key: "zoneName",
        label: "ZONE NAME",
        type: "text",
        validation: { required: true }
      },
      {
        key: "deliveryFee",
        label: "DELIVERY FEE (£)",
        type: "number",
        validation: { required: true, min: 0 }
      },
      {
        key: "minOrder",
        label: "MINIMUM ORDER (£)",
        type: "number",
        validation: { required: true, min: 0 }
      },
      {
        key: "estimatedTime",
        label: "ESTIMATED TIME (minutes)",
        type: "number",
        validation: { required: true, min: 5 }
      }
    ]
  },
  email: {
    id: "email",
    label: "Email Templates",
    icon: "email",
    fields: [
      {
        key: "orderConfirmation",
        label: "Order Confirmation Template",
        type: "textarea",
        validation: { required: true }
      },
      {
        key: "deliveryUpdate",
        label: "Delivery Update Template",
        type: "textarea",
        validation: { required: true }
      },
      {
        key: "marketingEmails",
        label: "Enable Marketing Emails",
        type: "toggle",
        defaultValue: false
      }
    ]
  }
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  
  // Dynamic state for all settings
  const [settingsData, setSettingsData] = useState<Record<string, any>>({});
  const [banners, setBanners] = useState<any[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<Record<string, any>>({});
  
  // Initialize settings data from config
  useEffect(() => {
    const initialData: Record<string, any> = {};
    Object.values(SETTINGS_CONFIG).forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.key] = field.defaultValue;
        }
      });
    });
    setSettingsData(initialData);
    
    // Initialize with sample banners
    setBanners([
      {
        id: "1",
        title: "Authentic Italian Pizzas",
        imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=200&fit=crop&crop=center",
        sortOrder: "1",
        active: true,
        linkUrl: "namaste://category/pizza"
      },
      {
        id: "2", 
        title: "Summer Salad Fest",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop&crop=center",
        sortOrder: "2",
        active: true,
        linkUrl: "namaste://campaign/summer-fest"
      }
    ]);
  }, []);
  
  // Get current section configuration
  const currentSectionConfig = SETTINGS_CONFIG[activeSection as keyof typeof SETTINGS_CONFIG];
  const settingsSections = Object.values(SETTINGS_CONFIG);

  // Dynamic validation
  const validateField = useCallback((field: any, value: any): string | null => {
    if (!field.validation) return null;
    
    const { required, minLength, maxLength, min, max, pattern } = field.validation;
    
    if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }
    
    if (minLength && value.length < minLength) {
      return `${field.label} must be at least ${minLength} characters`;
    }
    
    if (maxLength && value.length > maxLength) {
      return `${field.label} must not exceed ${maxLength} characters`;
    }
    
    if (min && parseFloat(value) < min) {
      return `${field.label} must be at least ${min}`;
    }
    
    if (max && parseFloat(value) > max) {
      return `${field.label} must not exceed ${max}`;
    }
    
    if (pattern && !pattern.test(value)) {
      return `${field.label} format is invalid`;
    }
    
    return null;
  }, []);
  
  // Dynamic field change handler
  const handleFieldChange = useCallback((key: string, value: any, section?: string) => {
    if (section === 'banners') {
      setBanners(prev => prev.map(banner => 
        banner.id === key ? { ...banner, ...value } : banner
      ));
    } else if (section === 'delivery') {
      setDeliveryZones(prev => prev.map(zone => 
        zone.id === key ? { ...zone, ...value } : zone
      ));
    } else {
      setSettingsData(prev => ({ ...prev, [key]: value }));
      
      // Clear error for this field if value is valid
      const field = currentSectionConfig?.fields.find(f => f.key === key);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => {
          const newErrors = { ...prev };
          if (error) {
            newErrors[key] = error;
          } else {
            delete newErrors[key];
          }
          return newErrors;
        });
      }
    }
  }, [currentSectionConfig, validateField]);
  
  // Dynamic save handler
  const handleSaveChanges = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");
    
    try {
      // Validate all fields in current section
      const newErrors: Record<string, string> = {};
      
      if (activeSection === 'general') {
        currentSectionConfig.fields.forEach(field => {
          const value = settingsData[field.key];
          const error = validateField(field, value);
          if (error) {
            newErrors[field.key] = error;
          }
        });
      } else if (activeSection === 'banners') {
        banners.forEach((banner, index) => {
          currentSectionConfig.fields.forEach(field => {
            if (field.key !== 'imageUrl') { // Skip image validation for now
              const value = banner[field.key];
              const error = validateField(field, value);
              if (error) {
                newErrors[`banner_${index}_${field.key}`] = error;
              }
            }
          });
        });
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving data:', {
        section: activeSection,
        data: activeSection === 'banners' ? banners : settingsData
      });
      
      setSuccessMessage(`${currentSectionConfig.label} saved successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setErrors({ general: 'Failed to save changes. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [activeSection, currentSectionConfig, settingsData, banners, validateField]);
  
  // Dynamic banner management
  const handleAddBanner = useCallback(() => {
    const newBanner = {
      id: Date.now().toString(),
      title: "",
      imageUrl: "",
      sortOrder: (banners.length + 1).toString(),
      active: true,
      linkUrl: ""
    };
    setBanners(prev => [...prev, newBanner]);
  }, [banners.length]);
  
  const handleDeleteBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  }, []);
  
  const handleBannerChange = useCallback((id: string, field: string, value: any) => {
    handleFieldChange(id, { [field]: value }, 'banners');
  }, [handleFieldChange]);
  
  // Dynamic file upload handler
  const handleFileUpload = useCallback((fieldKey: string, file: File) => {
    // In a real app, this would upload to a server
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    handleFieldChange(fieldKey, url);
  }, [handleFieldChange]);
  
  // Dynamic search filter
  const filteredSections = settingsSections.filter(section => 
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Dynamic field renderer component
  const renderDynamicField = useCallback((field: any, value: any, onChange: (value: any) => void, errorKey?: string) => {
    const error = errorKey ? errors[errorKey] : errors[field.key];
    
    const baseInputClasses = "w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorInputClasses = error ? "border-red-500" : "border-gray-300";
    
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`${baseInputClasses} ${errorInputClasses}`}
              placeholder={field.placeholder}
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>
        );
        
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`${baseInputClasses} ${errorInputClasses}`}
              min={field.validation?.min}
              max={field.validation?.max}
              step="0.01"
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>
        );
        
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{field.label}</h3>
              {field.description && (
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              )}
            </div>
            <button
              onClick={() => onChange(!value)}
              className={`relative inline-flex h-5 w-14 items-center rounded-xl transition-colors ${
                value ? 'bg-red-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-xl bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );
        
      case 'file':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
              <div className="flex flex-col items-center">
                {value ? (
                  <div className="w-full">
                    {field.aspectRatio === '16:9' ? (
                      <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden">
                        <img 
                          src={value} 
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                        <MaterialIcon name="image" className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <button 
                      onClick={() => onChange('')}
                      className="text-red-600 text-sm font-medium hover:underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                      <MaterialIcon name="image" className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                    <button className="text-red-600 text-sm font-medium hover:underline">
                      Choose File
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`${baseInputClasses} ${errorInputClasses}`}
              rows={4}
              placeholder={field.placeholder}
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  }, [errors]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Exactly matching reference image */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">
            Platform Configuration
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your platform settings and preferences
          </p>
        </div>
        
        <nav className="px-4 pb-6">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-colors mb-1 ${
                activeSection === section.id
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MaterialIcon 
                name={section.icon} 
                className={`text-lg ${
                  activeSection === section.id ? "text-red-600" : "text-gray-500"
                }`} 
              />
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
          
          {/* System Security Box */}
          <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="security" className="text-red-600 text-lg" />
              <h3 className="text-sm font-semibold text-red-900">System Security</h3>
            </div>
            <p className="text-xs text-red-700">
              All platform activities are logged and monitored for security purposes.
            </p>
          </div>
        </nav>
      </div>

      {/* Main Content Area - Exactly matching reference image */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <MaterialIcon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search settings, menus, orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                <MaterialIcon name="notifications" className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-xl flex items-center justify-center">
                <MaterialIcon name="person" className="text-gray-600 text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-green-600 text-lg" />
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <MaterialIcon name="error" className="text-red-600 text-lg" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          )}
          
          {/* Dynamic Section Rendering */}
          {activeSection === 'general' && (
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Card Header with Title and Save Button */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MaterialIcon name={currentSectionConfig.icon} className="text-xl text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentSectionConfig.label}
                    </h2>
                  </div>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>

                {/* Dynamic Fields Grid - Custom Layout for Reference Image */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Platform Logo Section - Left Column */}
                  <div className="lg:col-span-1">
                    {(() => {
                      const logoField = currentSectionConfig.fields.find(f => f.key === 'platformLogo');
                      return (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Platform Logo</h3>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                            <div className="flex flex-col items-center">
                              {settingsData.platformLogo ? (
                                <div className="w-full">
                                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                    <img 
                                      src={settingsData.platformLogo} 
                                      alt="Platform Logo"
                                      className="w-full h-full object-cover rounded-xl"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => handleFieldChange('platformLogo', '')}
                                    className="text-red-600 text-sm font-medium hover:underline"
                                  >
                                    Replace Logo
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                                    <MaterialIcon name="image" className="text-gray-400 text-3xl" />
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2 text-center">PNG, JPG or SVG. Max 2MB.</p>
                                  <button className="text-red-600 text-sm font-medium hover:underline">
                                    Replace Logo
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Input Fields - Right Column */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentSectionConfig.fields
                        .filter(field => field.key !== 'platformLogo' && field.type !== 'toggle')
                        .map((field) => (
                          <div key={field.key}>
                            {renderDynamicField(
                              field,
                              settingsData[field.key],
                              (value) => handleFieldChange(field.key, value)
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Maintenance Mode Toggle - Below Input Fields */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      {(() => {
                        const maintenanceField = currentSectionConfig.fields.find(f => f.key === 'maintenanceMode');
                        return renderDynamicField(
                          maintenanceField,
                          settingsData.maintenanceMode,
                          (value) => handleFieldChange('maintenanceMode', value)
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Banners Section */}
          {activeSection === 'banners' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentSectionConfig.label}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage promotional banners displayed on the customer app home screen
                  </p>
                </div>
                <button 
                  onClick={handleAddBanner}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <MaterialIcon name="add" className="text-base" />
                  Add New Banner
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                {/* Banner Items Container */}
                <div className="divide-y divide-gray-200">
                  {banners.map((banner, index) => (
                    <div key={banner.id} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Banner Image */}
                        <div className="md:col-span-1">
                          {renderDynamicField(
                            { ...currentSectionConfig.fields.find(f => f.key === 'imageUrl'), key: `imageUrl_${banner.id}` },
                            banner.imageUrl,
                            (value) => handleBannerChange(banner.id, 'imageUrl', value)
                          )}
                        </div>

                        {/* Banner Details */}
                        <div className="md:col-span-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {currentSectionConfig.fields
                              .filter(field => field.key !== 'imageUrl')
                              .map((field) => {
                                if (field.key === 'active') {
                                  return (
                                    <div key={field.key} className="md:col-span-2">
                                      {renderDynamicField(
                                        field,
                                        banner[field.key],
                                        (value) => handleBannerChange(banner.id, field.key, value),
                                        `banner_${index}_${field.key}`
                                      )}
                                    </div>
                                  );
                                }
                                return (
                                  <div key={field.key}>
                                    {renderDynamicField(
                                      field,
                                      banner[field.key],
                                      (value) => handleBannerChange(banner.id, field.key, value),
                                      `banner_${index}_${field.key}`
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleSaveChanges()}
                              disabled={isLoading}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors"
                            >
                              <MaterialIcon name="delete" className="text-base" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {banners.length === 0 && (
                    <div className="p-12 text-center">
                      <MaterialIcon name="image" className="text-gray-300 text-4xl mx-auto mb-4" />
                      <p className="text-gray-500">No banners configured yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add your first banner to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Dynamic Delivery Zones Section */}
          {activeSection === 'delivery' && (
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MaterialIcon name={currentSectionConfig.icon} className="text-xl text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentSectionConfig.label}
                    </h2>
                  </div>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>

                <div className="text-center py-12">
                  <MaterialIcon name="delivery_dining" className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">Delivery zones management coming soon</p>
                  <p className="text-sm text-gray-400 mt-1">Configure delivery areas and pricing</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dynamic Email Templates Section */}
          {activeSection === 'email' && (
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MaterialIcon name={currentSectionConfig.icon} className="text-xl text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentSectionConfig.label}
                    </h2>
                  </div>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>

                <div className="space-y-6">
                  {currentSectionConfig.fields.map((field) => (
                    <div key={field.key}>
                      {renderDynamicField(
                        field,
                        emailTemplates[field.key] || field.defaultValue,
                        (value) => setEmailTemplates(prev => ({ ...prev, [field.key]: value }))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
