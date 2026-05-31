import React, { useState, useEffect } from "react";
import { Shield, ShieldCheck, AlertTriangle, Lock, Eye, EyeOff, Key, Database, Globe, AlertCircle, CheckCircle, X, TrendingUp, TrendingDown, Activity, Users, Map, Wifi, Clock, RefreshCw, Settings, Download, Search, Filter, MoreHorizontal, Ban, Unlock } from "lucide-react";

function Security() {
  const [securityScore, setSecurityScore] = useState(87);
  const [threatLevel, setThreatLevel] = useState('low');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [failedLogins, setFailedLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, [timeRange]);

  const fetchSecurityData = () => {
    setLoading(true);
    // Demo security data
    const alerts = [
      { id: 1, type: 'critical', message: 'Multiple failed login attempts from IP 192.168.1.45', source: 'authentication', time: '2 minutes ago', resolved: false, severity: 'high' },
      { id: 2, type: 'warning', message: 'Unusual access pattern detected for user john.doe', source: 'behavioral', time: '15 minutes ago', resolved: false, severity: 'medium' },
      { id: 3, type: 'info', message: 'System backup completed successfully', source: 'system', time: '1 hour ago', resolved: true, severity: 'low' },
      { id: 4, type: 'critical', message: 'Potential SQL injection attempt blocked', source: 'network', time: '2 hours ago', resolved: true, severity: 'critical' },
      { id: 5, type: 'warning', message: 'Password policy violation detected', source: 'authentication', time: '3 hours ago', resolved: false, severity: 'medium' },
      { id: 6, type: 'info', message: 'SSL certificate expires in 30 days', source: 'system', time: '4 hours ago', resolved: false, severity: 'low' },
      { id: 7, type: 'critical', message: 'Suspicious file upload blocked', source: 'content', time: '5 hours ago', resolved: true, severity: 'high' },
      { id: 8, type: 'warning', message: 'API rate limit exceeded for client xyz', source: 'api', time: '6 hours ago', resolved: false, severity: 'medium' }
    ];

    const sessions = [
      { id: 1, user: 'john.doe@example.com', device: 'MacBook Pro', browser: 'Chrome', ip: '192.168.1.100', location: 'New York, USA', loginTime: '2 hours ago', lastActivity: '5 minutes ago', status: 'active' },
      { id: 2, user: 'jane.smith@example.com', device: 'iPhone 14', browser: 'Safari', ip: '192.168.1.101', location: 'London, UK', loginTime: '1 day ago', lastActivity: '1 hour ago', status: 'active' },
      { id: 3, user: 'mike.brown@example.com', device: 'Windows PC', browser: 'Firefox', ip: '192.168.1.102', location: 'Toronto, Canada', loginTime: '3 days ago', lastActivity: '2 days ago', status: 'idle' },
      { id: 4, user: 'admin@example.com', device: 'Linux Server', browser: 'Chrome', ip: '192.168.1.103', location: 'San Francisco, USA', loginTime: '1 week ago', lastActivity: '3 days ago', status: 'idle' }
    ];

    const failedLogins = [
      { id: 1, user: 'unknown', ip: '192.168.1.45', attempts: 5, lastAttempt: '2 minutes ago', location: 'Unknown', status: 'blocked' },
      { id: 2, user: 'john.doe@example.com', ip: '192.168.1.46', attempts: 3, lastAttempt: '1 hour ago', location: 'New York, USA', status: 'blocked' },
      { id: 3, user: 'unknown', ip: '192.168.1.47', attempts: 2, lastAttempt: '3 hours ago', location: 'Unknown', status: 'monitoring' }
    ];

    setRecentAlerts(alerts);
    setActiveSessions(sessions);
    setFailedLogins(failedLogins);
    setLoading(false);
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500'
    };
    return colors[level] || 'bg-green-500';
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      critical: 'border-red-500 bg-red-50',
      warning: 'border-yellow-500 bg-yellow-50',
      info: 'border-blue-500 bg-blue-50',
      success: 'border-green-500 bg-green-50'
    };
    return colors[type] || 'border-gray-500 bg-gray-50';
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      critical: AlertTriangle,
      warning: AlertCircle,
      info: Info,
      success: CheckCircle
    };
    return icons[type] || AlertCircle;
  };

  return (
    <div className="h-[calc(100vh-200px)] flex bg-gray-900 text-white">
      {/* Sidebar - Security Navigation */}
      <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${getThreatLevelColor(threatLevel)}`}>
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Security Center</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${threatLevel === 'low' ? 'bg-green-500' : threatLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-400">{threatLevel} threat level</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Security Score</span>
              <span className="text-2xl font-bold">{securityScore}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className={`h-2 rounded-full ${securityScore >= 80 ? 'bg-green-500' : securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${securityScore}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {[
            { id: 'overview', label: 'Security Overview', icon: Dashboard },
            { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
            { id: 'sessions', label: 'Active Sessions', icon: Users },
            { id: 'firewall', label: 'Firewall Rules', icon: Shield },
            { id: 'audit', label: 'Audit Logs', icon: Activity },
            { id: 'policies', label: 'Security Policies', icon: Settings },
            { id: 'scanning', label: 'Vulnerability Scan', icon: Search },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-6 py-4 flex items-center gap-3 text-left transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">System Status</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Firewall</span>
              <span className="text-green-500 text-sm font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Intrusion Detection</span>
              <span className="text-green-500 text-sm font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">SSL/TLS</span>
              <span className="text-green-500 text-sm font-medium">Valid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Security Dashboard</h1>
              <p className="text-gray-400">Real-time security monitoring and threat analysis</p>
            </div>
            <div className="flex gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={fetchSecurityData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                <Download className="h-5 w-5" />
                Export Report
              </button>
            </div>
          </div>

          {/* Threat Level Indicator */}
          <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-6">
            <div className={`flex items-center gap-4 px-6 py-3 rounded-xl ${getThreatLevelColor(threatLevel)}`}>
              <Shield className="h-8 w-8 text-white" />
              <div>
                <div className="text-sm font-medium opacity-80">Current Threat Level</div>
                <div className="text-2xl font-bold capitalize">{threatLevel}</div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Critical Alerts</div>
                <div className="text-xl font-bold text-red-500">{recentAlerts.filter(a => a.type === 'critical' && !a.resolved).length}</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Warnings</div>
                <div className="text-xl font-bold text-yellow-500">{recentAlerts.filter(a => a.type === 'warning' && !a.resolved).length}</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Failed Logins</div>
                <div className="text-xl font-bold text-orange-500">{failedLogins.length}</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Active Sessions</div>
                <div className="text-xl font-bold text-blue-500">{activeSessions.filter(s => s.status === 'active').length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Security Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Lock className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">99.9%</div>
                      <div className="text-sm text-gray-400">Encryption Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-400">+0.2% from last week</span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">1,247</div>
                      <div className="text-sm text-gray-400">Security Events Today</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-400">-15% from yesterday</span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Key className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">24</div>
                      <div className="text-sm text-gray-400">API Keys Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">All keys secure</span>
                  </div>
                </div>
              </div>

              {/* Recent Security Alerts */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold mb-2">Recent Security Alerts</h2>
                  <p className="text-sm text-gray-400">Real-time security monitoring and threat detection</p>
                </div>
                <div className="divide-y divide-gray-700">
                  {recentAlerts.slice(0, 5).map(alert => {
                    const AlertIcon = getAlertTypeIcon(alert.type);
                    return (
                      <div key={alert.id} className={`p-4 flex items-start gap-4 ${alert.resolved ? 'opacity-50' : ''}`}>
                        <div className={`p-2 rounded-lg ${getAlertTypeColor(alert.type)} border`}>
                          <AlertIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium capitalize">{alert.type}</span>
                            <span className="text-xs text-gray-400">{alert.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              {alert.source}
                            </span>
                            {alert.resolved && (
                              <span className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="h-3 w-3" />
                                Resolved
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-gray-700">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </button>
                          {!alert.resolved && (
                            <button className="p-2 rounded-lg hover:bg-red-900">
                              <Ban className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold mb-2">Active Sessions</h2>
                <p className="text-sm text-gray-400">Monitor and manage user sessions across all devices</p>
              </div>
              <div className="divide-y divide-gray-700">
                {activeSessions.map(session => (
                  <div key={session.id} className="p-6 flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl ${session.status === 'active' ? 'bg-green-500/20' : 'bg-gray-700'} flex items-center justify-center`}>
                      <Globe className={`h-6 w-6 ${session.status === 'active' ? 'text-green-500' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{session.user}</div>
                      <div className="text-sm text-gray-400 mb-2">
                        {session.device} • {session.browser}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Wifi className="h-3 w-3" />
                          {session.ip}
                        </span>
                        <span className="flex items-center gap-1">
                          <Map className="h-3 w-3" />
                          {session.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Last Activity</div>
                      <div className="text-sm">{session.lastActivity}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                      {session.status}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-700">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-900">
                        <Ban className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Security Alerts</h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-600 rounded-lg text-sm font-medium">Mark All Resolved</button>
                    <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm font-medium">Export Logs</button>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Historical security events and incident tracking</p>
              </div>
              <div className="divide-y divide-gray-700">
                {recentAlerts.map(alert => {
                  const AlertIcon = getAlertTypeIcon(alert.type);
                  return (
                    <div key={alert.id} className={`p-6 flex items-start gap-4 ${alert.resolved ? 'opacity-50' : ''}`}>
                      <div className={`p-2 rounded-lg ${getAlertTypeColor(alert.type)} border`}>
                        <AlertIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{alert.type}</span>
                          <span className="text-xs text-gray-400">{alert.time}</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {alert.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Severity: {alert.severity}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!alert.resolved && (
                          <button className="px-3 py-1 bg-green-600 rounded-lg text-sm font-medium hover:bg-green-700">
                            Resolve
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-gray-700">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Security;