import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Send, Plus, Search, Clock } from "lucide-react";
import { usePermissions } from "../hooks/usePermissions";
import { PERMISSIONS } from "../utils/permissions";
import { getApiUrl } from "../../services/api";

const MESSAGES = [
  { id: 1, sender: "Amaka Wanjiru", message: "Grant applications reviewed and approved.", time: "2 hours ago", channel: "email", unread: false },
  { id: 2, sender: "David Otieno", message: "Website update completed. Ready for deployment.", time: "4 hours ago", channel: "chat", unread: true },
  { id: 3, sender: "Susan Njeri", message: "Volunteer onboarding forms updated.", time: "Yesterday", channel: "email", unread: false },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "Monthly Board Meeting", date: "May 20, 2024", priority: "high" },
  { id: 2, title: "Q2 Financial Results Review", date: "May 25, 2024", priority: "medium" },
  { id: 3, title: "Donor Appreciation Gala", date: "June 1, 2024", priority: "low" },
];

export function Communication({ user }) {
  const { can } = usePermissions(user);
  const [activeTab, setActiveTab] = useState("messages");
  const [messageText, setMessageText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    audience: "all_users",
    announcement_type: "general",
  });
  const [announcementStatus, setAnnouncementStatus] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true);
      const response = await fetch(getApiUrl("/api/admin/announcements"));
      const data = await response.json();

      if (response.ok && data.success) {
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const handleAnnouncementSubmit = async () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      setAnnouncementStatus({ type: "error", message: "Title and content are required." });
      return;
    }

    try {
      setAnnouncementStatus(null);
      const payload = {
        title: announcementForm.title.trim(),
        content: announcementForm.content.trim(),
        priority: announcementForm.priority,
        audience: announcementForm.audience,
        announcement_type: announcementForm.announcement_type,
        status: "published",
        published_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        created_by: user?.id || null,
      };

      const response = await fetch(getApiUrl("/api/admin/announcements"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save announcement.");
      }

      setAnnouncementStatus({ type: "success", message: "Announcement saved successfully." });
      setAnnouncementForm({
        title: "",
        content: "",
        priority: "normal",
        audience: "all_users",
        announcement_type: "general",
      });
      setNewAnnouncementOpen(false);
      loadAnnouncements();
    } catch (error) {
      console.error("Announcement save failed:", error);
      setAnnouncementStatus({ type: "error", message: error.message || "Saving announcement failed." });
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      setBroadcastStatus({ type: "error", message: "Broadcast message cannot be empty." });
      return;
    }

    try {
      setBroadcastStatus(null);
      const response = await fetch(getApiUrl("/api/sms/send-all"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send broadcast message.");
      }

      setBroadcastStatus({ type: "success", message: "Broadcast sent to all active users." });
      setBroadcastMessage("");
    } catch (error) {
      console.error("Broadcast failed:", error);
      setBroadcastStatus({ type: "error", message: error.message || "Broadcast failed." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Channel Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Unread Messages</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">12</p>
            </div>
            <MessageSquare className="h-10 w-10 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Email Pending</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">5</p>
            </div>
            <Mail className="h-10 w-10 text-amber-600 opacity-20" />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Conversations</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">8</p>
            </div>
            <Phone className="h-10 w-10 text-green-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Main Communication Panel */}
      <div className="rounded-3xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "messages"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "announcements"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "broadcast"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Broadcast
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "messages" && (
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-sm text-slate-600">
                  Broadcast will send the same message to all active users with phone numbers. Use this for urgent portal-level updates.
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
                <button className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {broadcastStatus && (
                <div className={`rounded-2xl px-4 py-3 text-sm ${broadcastStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {broadcastStatus.message}
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {MESSAGES.map((msg) => (
                  <div key={msg.id} className={`rounded-3xl p-4 border transition ${msg.unread ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{msg.sender}</h4>
                        <p className="mt-1 text-sm text-slate-600">{msg.message}</p>
                      </div>
                      {msg.unread && <div className="h-3 w-3 rounded-full bg-blue-600" />}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span className="rounded-full bg-white px-3 py-1">{msg.channel}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => setNewAnnouncementOpen(!newAnnouncementOpen)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  New Announcement
                </button>
                <button
                  onClick={() => setActiveTab("broadcast")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Send Broadcast
                </button>
              </div>

              {newAnnouncementOpen && (
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Announcement title"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      rows={4}
                      placeholder="Announcement details"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        value={announcementForm.priority}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                        className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="normal">Normal Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <select
                        value={announcementForm.audience}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, audience: e.target.value })}
                        className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all_users">All Users</option>
                        <option value="all_clients">All Clients</option>
                        <option value="all_admins">All Admins</option>
                        <option value="specific_projects">Specific Projects</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setNewAnnouncementOpen(false)}
                        className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAnnouncementSubmit}
                        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Save Announcement
                      </button>
                    </div>
                    {announcementStatus && (
                      <div className={`rounded-2xl px-4 py-3 text-sm ${announcementStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {announcementStatus.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {(announcements.length > 0 ? announcements : ANNOUNCEMENTS).map((announcement) => (
                  <div key={announcement.id} className="rounded-3xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                      <p className="text-sm text-slate-500">{announcement.date || announcement.published_at || 'Today'}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      announcement.priority === "high" ? "bg-red-100 text-red-700" :
                      announcement.priority === "medium" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "broadcast" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Broadcast Message</label>
                <textarea
                  rows="6"
                  placeholder="Compose message to all team members..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSendBroadcast}
                  className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Broadcast
                </button>
                <button
                  onClick={() => {
                    setBroadcastMessage("");
                    setBroadcastStatus(null);
                    setActiveTab("messages");
                  }}
                  className="rounded-2xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
