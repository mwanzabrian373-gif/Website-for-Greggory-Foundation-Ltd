import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, Camera, User } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

export function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState("admin"); // 'admin' or 'developer'

  const from = location.state?.from?.pathname || "/admin";

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfileFile(file)
    const previewUrl = URL.createObjectURL(file)
    setProfilePreview(previewUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use correct endpoint based on role
      const endpoint =
        loginRole === "developer"
          ? `${API_URL}/developer-verification/authenticate`
          : `${API_URL}/admin-verification/authenticate-enhanced`;

      console.log("[LOGIN] Logging in as", loginRole, "using", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Handle profile photo upload if selected
      if (profileFile && data.user?.id) {
        try {
          const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(profileFile);
          });

          const photoResponse = await fetch(
            `${API_URL}/admin-verification/profile/${data.user.id}/photo`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                dataBase64: base64Data.split(",")[1],
                contentType: profileFile.type,
                fileName: profileFile.name,
              }),
            },
          );

          if (photoResponse.ok) {
            console.log("[LOGIN] Profile photo uploaded successfully");
          }
        } catch (photoError) {
          console.error("[LOGIN] Photo upload failed:", photoError);
          // Don't fail login if photo upload fails
        }
      }

      // Store session
      const session = {
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      sessionStorage.setItem("gf_admin_session", JSON.stringify(session));

      // Notify parent of successful login
      onLoginSuccess(data.user);

      // Redirect based on user role
      if (data.user.role === "developer") {
        navigate("/developer", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message ||
          "Failed to connect to server. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Admin & Developer Access
          </h1>
          <p className="text-gray-400 mt-2">
            Sign in to access the admin or developer panel
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <label
                htmlFor="profilePhoto"
                className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-800 flex items-center justify-center text-white text-sm cursor-pointer shadow-md hover:bg-blue-700"
                title="Add profile photo"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileChange}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400 text-center max-w-xs">
              Optional: add a profile photo now.
            </p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Login As
            </label>
            <select
              value={loginRole}
              onChange={(e) => setLoginRole(e.target.value)}
              className="w-full bg-slate-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="admin" className="bg-slate-800">
                Administrator
              </option>
              <option value="developer" className="bg-slate-800">
                Developer
              </option>
            </select>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Security Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          This is a restricted area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

export default Login;
