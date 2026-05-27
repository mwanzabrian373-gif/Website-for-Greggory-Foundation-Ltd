import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

export function QuickLinks({ user }) {
  const [navbarItems, setNavbarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', url: '', icon_name: '', route_path: '', display_order: 0, is_active: true });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', url: '', icon_name: '', route_path: '', display_order: 0, is_active: true });

  useEffect(() => {
    fetchNavbarItems();
  }, []);

  const fetchNavbarItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/content/navbar/all`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("gf_admin_session")?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNavbarItems(data);
      }
    } catch (error) {
      console.error("Fetch navbar items error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/content/navbar/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("gf_admin_session")?.token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setEditingId(null);
        fetchNavbarItems();
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/content/navbar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("gf_admin_session")?.token}`,
        },
        body: JSON.stringify(newForm),
      });
      if (response.ok) {
        setShowAddForm(false);
        setNewForm({ title: '', url: '', icon_name: '', route_path: '', display_order: 0, is_active: true });
        fetchNavbarItems();
      }
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;
    try {
      const response = await fetch(`${API_URL}/content/navbar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("gf_admin_session")?.token}`,
        },
      });
      if (response.ok) {
        fetchNavbarItems();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleMove = async (id, direction) => {
    const currentIndex = navbarItems.findIndex(item => item.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= navbarItems.length) return;

    const reorderedItems = [...navbarItems];
    const temp = reorderedItems[currentIndex].display_order;
    reorderedItems[currentIndex].display_order = reorderedItems[newIndex].display_order;
    reorderedItems[newIndex].display_order = temp;

    try {
      const response = await fetch(`${API_URL}/content/navbar/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("gf_admin_session")?.token}`,
        },
        body: JSON.stringify({ links: reorderedItems }),
      });
      if (response.ok) {
        fetchNavbarItems();
      }
    } catch (error) {
      console.error("Reorder error:", error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', url: '', icon_name: '', route_path: '', display_order: 0, is_active: true });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Navigation Management</h1>
            <p className="text-gray-600 mt-1">Manage navigation items displayed in the user navbar</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Navigation Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {showAddForm && (
                <tr className="bg-blue-50">
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={newForm.title}
                      onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Navigation title"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={newForm.url}
                      onChange={(e) => setNewForm({ ...newForm, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/path"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={newForm.icon_name}
                      onChange={(e) => setNewForm({ ...newForm, icon_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Home"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      value={newForm.display_order}
                      onChange={(e) => setNewForm({ ...newForm, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={newForm.is_active ? 'true' : 'false'}
                      onChange={(e) => setNewForm({ ...newForm, is_active: e.target.value === 'true' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={handleAdd}
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mr-2"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewForm({ title: '', url: '', icon_name: '', route_path: '', display_order: 0, is_active: true });
                      }}
                      className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
              {navbarItems.map((item) => (
                <tr key={item.id} className={editingId === item.id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-3">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{item.title}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.url}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-600">{item.url}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.icon_name}
                        onChange={(e) => setEditForm({ ...editForm, icon_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-600">{item.icon_name || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editForm.display_order}
                        onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-600">{item.display_order}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === item.id ? (
                      <select
                        value={editForm.is_active ? 'true' : 'false'}
                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mr-2"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleMove(item.id, 'up')}
                          className="inline-flex items-center px-2 py-1 text-gray-600 hover:text-gray-900 mr-1"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMove(item.id, 'down')}
                          className="inline-flex items-center px-2 py-1 text-gray-600 hover:text-gray-900 mr-1"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(item)}
                          className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 mr-1"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}