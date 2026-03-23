import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    onError: () => {
      // navigate("/sign-in");
      const publicRoutes = ["/", "/events", "/events/:id", "/about", "/contact"];

      const current = window.location.pathname;

      const isPublic = publicRoutes.some((r) =>
        current.startsWith(r.replace("/:id", ""))
      );

      if (!isPublic) {
        navigate("/sign-in");
      }
    }
  });

  const isAuthenticated = data?.success === true;
  const hasProfile = data?.data?.hasProfile ?? false;
  const isProfileCompleted = data?.data?.isProfileCompleted ?? false;
  const user = data?.data?.user ?? null;

  // Subscription Logic
  let isTrialExpired = false;
  let isProActive = false;

  if (user) {
    // Check Pro status
    isProActive = user.subscription?.plan === 'pro' &&
      user.subscription?.status === 'active' &&
      new Date(user.subscription?.expiryDate) > new Date();

    // Check Trial status (150 days / 5 Months)
    if (user.subscription?.plan === 'free' && user.subscription?.expiryDate) {
      isTrialExpired = new Date(user.subscription.expiryDate) < new Date();
    } else {
      const trialThreshold = new Date();
      trialThreshold.setDate(trialThreshold.getDate() - 150);
      isTrialExpired = new Date(user.createdAt) < trialThreshold;
    }

    // Overwrite with primary payer's shared access logic if possible
    // For inherited access, backend checks it inside getSubscriptionStatus,
    // but the getProfile/currentUser uses direct. Let's assume if they have a primary_account_id 
    // we lean on the backend 403 blocks for trial expiry rather than strictly disabling UI,
    // OR we act as if trial isn't expired on frontend if they have a primary_acc.
    // Ideally, the 'status' endpoint returns unified 'isProActive'.
    if (user.primary_account_id && !isProActive) {
      // By default, assume they have inherited access and hide upgrade prompts
      // Real validation occurs on the backend middleware anyway
      isProActive = true;
      isTrialExpired = false;
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Clear the query cache
      queryClient.clear();
      // Cookies are cleared by the server on logout
      // Navigate to sign-in page
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear cache and redirect
      queryClient.clear();
      navigate("/sign-in");
    }
  };

  const value = {
    isAuthenticated,
    hasProfile,
    isProfileCompleted,
    user,
    isTrialExpired,
    isProActive,
    isLoading,
    error,
    refetch,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

