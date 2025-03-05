// App.js - Main React Application
import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import "./styles.css";

// Import components
import AdminPanel from "./components/admin/AdminPanel";
import HomePage from "./components/client/HomePage";
import ServicesPage from "./components/client/ServicesPage";
import QueuePage from "./components/client/QueuePage";
import LoyaltyPage from "./components/client/LoyaltyPage";
import ContactPage from "./components/client/ContactPage";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";
import BookingModal from "./components/client/BookingModal";
import MobileNavigation from "./components/common/MobileNavigation";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Create Application Context
const AppContext = createContext();

// API configuration
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

// Initialize API service
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error handling for responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      toast.error("Сессия истекла. Пожалуйста, войдите снова.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Main App Component
function App() {
  // State
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    carModel: "",
    carNumber: "",
    date: "",
    time: "",
    options: [],
    comment: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  
  // Company Info (would come from API in real implementation)
  const companyInfo = {
    name: "A1Detailing",
    address: "ул. Байтик Баатыра, 98 / ул. Максима Горького, 27/1, Бишкек",
    phone: "+996550000000",
    email: "info@a1detailing.kg",
    workHours: "Пн-Сб: 9:00 - 19:00, Вс: 10:00 - 17:00",
    coordinates: {
      lat: 42.8746,
      lng: 74.5698,
    },
    socialLinks: {
      instagram: "https://instagram.com/a1detailing",
      facebook: "https://facebook.com/a1detailing",
      whatsapp: "https://wa.me/996550000000",
    },
  };

  // Authentication functions
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsInitializing(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setShowLoginModal(false);
      showMessageNotification("Вы успешно вошли в систему");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Ошибка входа";
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setShowRegisterModal(false);
      showMessageNotification("Вы успешно зарегистрировались");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Ошибка регистрации";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    toast.success("Вы вышли из системы");
  };

  // Initialize Socket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      const socketInstance = io(SOCKET_URL, {
        withCredentials: true,
        query: { token }
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected");
        
        // Join admin room if admin
        if (user.role === "admin" || user.role === "staff") {
          socketInstance.emit("join-admin", { token });
        }
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  // Check auth status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Notification helper
  const showMessageNotification = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // App Context value
  const contextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    login,
    logout,
    register,
    api,
    socket,
    activeTab,
    setActiveTab,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    showBookingModal,
    setShowBookingModal,
    selectedService,
    setSelectedService,
    bookingForm,
    setBookingForm,
    showSuccessMessage,
    setShowSuccessMessage,
    successMessage,
    setSuccessMessage,
    showMessageNotification,
    showMobileMenu,
    setShowMobileMenu,
    companyInfo
  };

  // Loading state
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  // Determine if we're in the admin section
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Admin routes require authentication and admin role
  if (isAdminRoute) {
    // If not authenticated or not admin, redirect to home
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return <Navigate to="/" replace />;
    }
    
    return (
      <AppContext.Provider value={contextValue}>
        <AdminPanel />
      </AppContext.Provider>
    );
  }

  // Client routes
  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Success Message Notification */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 left-4 md:left-auto bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setShowSuccessMessage(false)} className="text-white ml-4">
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-grow pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Navigation */}
        <MobileNavigation />

        {/* Modals */}
        {showLoginModal && <LoginModal />}
        {showRegisterModal && <RegisterModal />}
        {showBookingModal && selectedService && <BookingModal />}
      </div>
    </AppContext.Provider>
  );
}

// Export context hook for easy access
export const useAppContext = () => useContext(AppContext);

export default App;