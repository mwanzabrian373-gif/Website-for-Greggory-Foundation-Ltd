import React, { useState } from "react";
import { Settings as SettingsIcon, User, Lock, Bell, Database, Globe, Mail, Shield, CreditCard, Layers, Sliders, ChevronRight, ChevronDown, ToggleLeft, ToggleRight, Save, RefreshCw } from "lucide-react";

function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [expandedCategories, setExpandedCategories] = useState({
    general: true,
    user: false,
    security: false,
    api: false,
    email: false,
    system: false
  });
  const [settings, setSettings] = useState({
    general: {
      siteName: "Greggory Foundation Ltd",
      siteTagline: "Building Tomorrow's Solutions",
      timezone: "UTC",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      maintenanceMode: false
    },
    user: {
      allowRegistration: true,
      requireEmailVerification: true,
      defaultUserRole: "user",
      sessionTimeout: 30,
      passwordResetDays: 90
    },
    security: {
      enable2FA: false,
      requireStrongPasswords: true,
      minPasswordLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: "",
      enableAuditLogs: true
    },
    api: {
      enableAPI: true,
      rateLimit: 1000,
      apiKeyExpiry: 90,
      webhookURL: "",
      enableCORS: true,
      allowedOrigins: "*"
    },
    email: {
      smtpHost: "smtp.example.com",
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: "",
      fromEmail: "noreply@example.com",
      fromName: "Greggory Foundation",
      emailNotifications: true
    },
    system: {
      enableBackups: true,
      backupFrequency: "daily",
      backupRetention: 30,
      logRetention: 90,
      debugMode: false,
      performanceMonitoring: true
    }
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const updateSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const categories = [
    { id: 'general', name: 'General Settings', icon: Sliders, color: 'bg-blue-600' },
    { id: 'user', name: 'User Preferences', icon: User, color: 'bg-purple-600' },
    { id: 'security', name: 'Security', icon: Shield, color: 'bg-red-600' },
    { id: 'api', name: 'API Configuration', icon: Globe, color: 'bg-green-600' },
    { id: 'email', name: 'Email Settings', icon: Mail, color: 'bg-orange-600' },
    { id: 'system', name: 'System Configuration', icon: Database, color: 'bg-teal-600' }
  ];

  const SettingGroup = ({ category, items }) => (
    <div className="space-y-6">
      {Object.entries(items).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            {typeof value === 'boolean' && (
              <p className="text-xs text-gray-500 mt-1">
                {value ? 'Currently enabled' : 'Currently disabled'}
              </p>
            )}
          </div>
          {typeof value === 'boolean' ? (
            <button
              onClick={() => toggleSetting(category, key)}
              className={`relative w-14 h-7 rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          ) : typeof value === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => updateSetting(category, key, parseInt(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateSetting(category, key, e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Settings</h2>
              <p className="text-sm text-gray-400">Configure your system</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {categories.map(category => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                {expandedCategories[category.id] ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedCategories[category.id] && (
                <div className="px-6 py-2 space-y-1 bg-gray-800">
                  {Object.keys(settings[category.id]).map(setting => (
                    <button
                      key={setting}
                      onClick={() => setActiveSection(`${category.id}.${setting}`)}
                      className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                        activeSection === `${category.id}.${setting}`
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-800">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            <Save className="h-5 w-5" />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categories.find(c => c.id === activeSection.split('.')[0])?.name || 'Settings'}
            </h1>
            <p className="text-gray-600">Configure your {activeSection.split('.')[0]} preferences</p>
          </div>

          {categories.map(category => (
            <div key={category.id} className={`mb-8 ${expandedCategories[category.id] ? '' : 'hidden'}`}>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-sm text-gray-600">Manage your {category.name.toLowerCase()}</p>
                  </div>
                </div>

                <SettingGroup category={category.id} items={settings[category.id]} />
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-600">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Visit our documentation or contact support for assistance with settings configuration.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;