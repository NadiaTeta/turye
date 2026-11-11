import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import OrdersPage from "./pages/OrdersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import LocationsPage from "./pages/LocationsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmed/:orderNumber" element={<OrderConfirmedPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/locations" element={<LocationsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}