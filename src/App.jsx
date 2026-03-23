import { BrowserRouter, Route, Routes, Navigate, useLocation, useParams } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ProfileForm from "./components/profile/ProfileForm";
import FamilyTreePage from "./pages/familyTree/FamilyTreePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ViewProfilePage from "./pages/profile/ViewProfilePage";
import FeedPage from "./pages/feed/FeedPage"
import UserProfilePage from "./pages/feed/UserProfilePage";
import SimplePricingPlan from "./pages/home/PricingPage";
import NoticeBoardListPage from "./pages/notice-board/NoticeBoardListPage";
import AddNoticePage from "./pages/notice-board/AddNoticePage";
import AdminNoticePage from "./pages/notice-board/AdminNoticePage";
import NoticeDetailsPage from "./pages/notice-board/NoticeDetailsPage";
import PostDetailsPage from "./pages/feed/PostDetailsPage";
import CreateEventPage from "./pages/event/CreateEventPage";
import EventListPage from "./pages/event/EventListPage";
import EventDetailsPage from "./pages/event/EventDetailsPage";
import EventReportPage from "./pages/event/EventReportPage";
import UpgradeModal from "./components/subscription/UpgradeModal";
import FeedbackForm from "./pages/feedback/FeedbackForm";
import FeedbackList from "./pages/feedback/FeedbackList";
import { useState } from "react";
import { useEffect } from "react";
import FeedbackFormPage from "./pages/feedback/FeedbackForm";
import FriendsRelativesPage from "./pages/friends/FriendsRelativesPage";
import NotificationPage from "./pages/notifications/NotificationPage";
import InvitationPage from "./pages/invitation/InvitationPage";
import MyGuestsPage from "./pages/my-guest/MyGuestsPage";
import EventGuestPage from "./pages/my-guest/EventGuestPage";
import KnowledgeBank from "./pages/knowledge-bank/KnowledgeBank";
import SocialMediaPage from "./pages/social-media/SocialMediaPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SentInvitationsPage from './pages/reports/SentInvitationsPage';
import SentInvitationsGuestListPage from './pages/reports/SentInvitationsGuestListPage';
import HelpPage from './pages/help/HelpPage';
import CreateKnowledgeBank from "./components/knowledge-bank/CreateKnowledgeBankForm";
import AdminKnowledgeBankTable from "./components/knowledge-bank/AdminKnowledgeBankTable";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
import UserIpPage from "./pages/admin/UserIpPage";
import ManageAdminPage from "./pages/settings/ManageAdminPage";
import ManageSubAdminPage from "./pages/settings/ManageSubAdminPage";
import ManageCoordinatorPage from "./pages/settings/ManageCoordinatorPage";
import MySubscriptionPage from "./pages/subscription/MySubscriptionPage";
import UpgradeSubscriptionPage from "./pages/subscription/UpgradeSubscriptionPage";
import EventAttendancePage from "./pages/event/EventAttendancePage";
import EventManagementAttendance from "./pages/event/EventManagementAttendance";
import ReceivedInvitationsPage from "./pages/invitation/ReceivedInvitationsPage";
import SetNewPasswordPage from "./pages/auth/SetNewPasswordPage";


// Route Guard Component
function RouteGuard({ children, requireProfile = false, redirectIfAuthenticated = false, requireSuperAdmin = false, requireAdmin = false }) {
  const location = useLocation();
  const {
    isAuthenticated,
    hasProfile,
    isProfileCompleted,
    isLoading,
    isTrialExpired,
    isProActive,
    user
  } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Public route - redirect if authenticated
  // if (redirectIfAuthenticated) {
  //   // If authenticated, redirect based on profile status
  //   if (isAuthenticated) {
  //     const defaultPath = user?.isSuperAdmin ? "/admin/user-ips" : "/";
  //     const targetPath = isProfileCompleted ? defaultPath : (hasProfile ? "" : "/complete-profile");
  //     return <Navigate to={targetPath} replace />;
  //   }
  //   // If not authenticated, allow access (for sign-in/sign-up pages)
  //   return children;
  // }

  if (redirectIfAuthenticated) {
    if (isAuthenticated) {
      const defaultPath = user?.isSuperAdmin ? "/admin/user-ips" : "/";
      const targetPath = isProfileCompleted ? defaultPath : "/complete-profile";

      return <Navigate to={targetPath} replace />;
    }

    return children;
  }

  // Protected route - check authentication
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Mandatory password reset for first-time login (admin-created members)
  if (user?.isFirstLogin && location.pathname !== "/set-new-password") {
    return <Navigate to="/set-new-password" replace />;
  }

  // Check super admin requirement
  if (requireSuperAdmin && !user?.isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check admin requirement (main Admin or Super Admin)
  if (requireAdmin && !(user?.isAdmin || user?.isSuperAdmin)) {
    return <Navigate to="/" replace />;
  }

  // Check profile requirement
  const searchParams = new URLSearchParams(location.search);
  const targetUserId = searchParams.get("userId");
  const isAdmin = user?.isAdmin || user?.isSuperAdmin;

  // Allow admins to access profile forms for other users
  const isEditingOther = (location.pathname === "/complete-profile" || location.pathname === "/update-profile") && targetUserId && isAdmin;
  const isProfilePage = location.pathname === "/complete-profile" || location.pathname === "/update-profile";

  if (requireProfile && !isProfileCompleted && !isEditingOther && !isProfilePage) {
    const targetPath = hasProfile ? "/update-profile" : "/complete-profile";
    return <Navigate to={targetPath} state={{ from: location }} replace />;
  }

  // Subscription Check (Lockout Logic)
  // If user is logged in, trial expired, and NOT pro active
  if (isAuthenticated && isTrialExpired && !isProActive) {
    // Allowed paths for locked out users
    const allowedPaths = ['/view-profile', '/subscriptions'];
    const isAllowedPath = allowedPaths.includes(location.pathname);

    if (!isAllowedPath) {
      // Identify if we should show upgrade modal or just redirect
      // For now, redirect to view-profile where we can show a banner/modal
      return <Navigate to="/view-profile" state={{ showUpgradeModal: true }} replace />;
    }
  }

  return children;
}

// Redirect component for home page based on user role
function HomePageRedirect() {
  const { user } = useAuth();
  if (user?.isSuperAdmin) {
    return <Navigate to="/admin/user-ips" replace />;
  }
  return <FeedPage />;
}

// Redirect for legacy RSVP links to the new Event Details page
function EventRedirect() {
  const { id } = useParams();
  const location = useLocation();
  return <Navigate to={`/events/${id}${location.search}`} replace />;
}

function AppContent() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/sign-up"
          element={
            <RouteGuard redirectIfAuthenticated={true}>
              <SignUpPage />
            </RouteGuard>
          }
        />
        <Route
          path="/sign-in"
          element={
            <RouteGuard redirectIfAuthenticated={true}>
              <SignInPage />
            </RouteGuard>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/set-new-password" element={<RouteGuard><SetNewPasswordPage /></RouteGuard>} />

        {/* Protected Routes */}
        <Route
          path="/complete-profile"
          element={
            <RouteGuard requireProfile={true}>
              <ProfileForm />
            </RouteGuard>
          }
        />
        <Route
          path="/update-profile"
          element={
            <RouteGuard requireProfile={true}>
              <ProfileForm />
            </RouteGuard>
          }
        />
        <Route
          path="/profile/edit-profile"
          element={
            <RouteGuard requirePassword={true} requireProfile={false}>
              <ViewProfilePage />
            </RouteGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <RouteGuard requirePassword={true} requireProfile={false}>
              <UserProfilePage />
            </RouteGuard>
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard requireProfile={true}>
              <HomePageRedirect />
            </RouteGuard>
          }
        />
        <Route
          path="/post/:id"
          element={
            <RouteGuard requireProfile={true}>
              <PostDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/poll/:id"
          element={
            <RouteGuard requireProfile={true}>
              <PostDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/family-tree"
          element={
            <RouteGuard requireProfile={true}>
              <FamilyTreePage />
            </RouteGuard>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <RouteGuard requireProfile={true}>
              <SimplePricingPlan />
            </RouteGuard>
          }
        />
        <Route
          path="/my-subscription"
          element={
            <RouteGuard requireProfile={true}>
              <MySubscriptionPage />
            </RouteGuard>
          }
        />
        <Route
          path="/upgrade-subscription"
          element={
            <RouteGuard requireProfile={true}>
              <UpgradeSubscriptionPage />
            </RouteGuard>
          }
        />
        <Route
          path="/notice"
          element={
            <RouteGuard requireProfile={true}>
              <NoticeBoardListPage />
            </RouteGuard>
          }
        />
        <Route
          path="/notifications"
          element={
            <RouteGuard requireProfile={true}>
              <NotificationPage />
            </RouteGuard>
          }
        />
        <Route
          path="/invitations"
          element={
            <RouteGuard requireProfile={true}>
              <InvitationPage />
            </RouteGuard>
          }
        />
        <Route
          path="/received-invitations"
          element={
            <RouteGuard requireProfile={true}>
              <ReceivedInvitationsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/my-guests"
          element={
            <RouteGuard requireProfile={true}>
              <MyGuestsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/my-guests/event-guest/:id"
          element={
            <RouteGuard requireProfile={true}>
              <EventGuestPage />
            </RouteGuard>
          }
        />
        <Route
          path="/knowledge-bank"
          element={
            <RouteGuard requireProfile={true}>
              <KnowledgeBank />
            </RouteGuard>
          }
        />
        <Route
          path="/notice/:id"
          element={
            <RouteGuard requireProfile={true}>
              <NoticeDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/add-notice"
          element={
            <RouteGuard requireProfile={true}>
              <AddNoticePage />
            </RouteGuard>
          }
        />
        <Route
          path="/admin-notices"
          element={
            <RouteGuard requireProfile={true}>
              <AdminNoticePage />
            </RouteGuard>
          }
        />
        <Route
          path="/create-event"
          element={
            <RouteGuard requireProfile={true}>
              <CreateEventPage />
            </RouteGuard>
          }
        />

        <Route
          path="/event-attendance"
          element={
            <RouteGuard requireProfile={true}>
              <EventManagementAttendance />
            </RouteGuard>
          }
        />

        {/* Universal Event Route (Public + Private handling inside component) */}
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events/:id/attendance" element={<EventAttendancePage />} />
        <Route path="/rsvp/:id" element={<EventRedirect />} />
        <Route path="/events/:id/report" element={<EventReportPage />} />

        <Route
          path="/events"
          element={
            <RouteGuard requireProfile={true}>
              <EventListPage />
            </RouteGuard>
          }
        />
        <Route
          path="/feedback"
          element={
            <RouteGuard requireProfile={true}>
              <FeedbackFormPage />
            </RouteGuard>
          }
        />
        <Route
          path="/feedback/view"
          element={
            <RouteGuard requireProfile={true}>
              <FeedbackList />
            </RouteGuard>
          }
        />
        <Route
          path="/friends-relatives"
          element={
            <RouteGuard requireProfile={true}>
              <FriendsRelativesPage />
            </RouteGuard>
          }
        />
        <Route
          path="/follow-us"
          element={
            <RouteGuard requireProfile={true}>
              <SocialMediaPage />
            </RouteGuard>
          }
        />
        <Route
          path="/reports"
          element={
            <RouteGuard requireProfile={true}>
              <ReportsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/sent-invitations"
          element={
            <RouteGuard requireProfile={true}>
              <SentInvitationsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/sent-invitations/:id/guests"
          element={
            <RouteGuard requireProfile={true}>
              <SentInvitationsGuestListPage />
            </RouteGuard>
          }
        />
        <Route
          path="/reports/event/:id"
          element={
            <RouteGuard requireProfile={true}>
              <EventReportPage />
            </RouteGuard>
          }
        />
        <Route
          path="/help"
          element={
            <RouteGuard requireProfile={true}>
              <HelpPage />
            </RouteGuard>
          }
        />
        <Route
          path="/create-knowledge-bank"
          element={
            <RouteGuard requireProfile={true} requireSuperAdmin={true}>
              <CreateKnowledgeBank />
            </RouteGuard>
          }
        />
        <Route
          path="/edit-knowledge-bank/:id"
          element={
            <RouteGuard requireProfile={true} requireSuperAdmin={true}>
              <CreateKnowledgeBank />
            </RouteGuard>
          }
        />
        <Route
          path="/admin/knowledge-bank"
          element={
            <RouteGuard requireProfile={true} requireSuperAdmin={true}>
              <AdminKnowledgeBankTable />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <RouteGuard requireProfile={true} requireSuperAdmin={true}>
              <SystemSettingsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/admin/user-ips"
          element={
            <RouteGuard requireProfile={true} requireSuperAdmin={true}>
              <UserIpPage />
            </RouteGuard>
          }
        />

        {/* Admin Settings */}
        <Route
          path="/settings/manage-admin"
          element={
            <RouteGuard requireProfile={true} requireAdmin={true}>
              <ManageAdminPage />
            </RouteGuard>
          }
        />
        <Route
          path="/settings/manage-subadmin"
          element={
            <RouteGuard requireProfile={true} requireAdmin={true}>
              <ManageSubAdminPage />
            </RouteGuard>
          }
        />
        <Route
          path="/settings/manage-coordinator"
          element={
            <RouteGuard requireProfile={true} requireAdmin={true}>
              <ManageCoordinatorPage />
            </RouteGuard>
          }
        />
      </Routes>

      <ConditionalUpgradeModal />
    </>
  );
}

// Separate component to use hook inside provider
function ConditionalUpgradeModal() {
  const { isTrialExpired, isProActive, isAuthenticated } = useAuth();
  // We can show it if expired and not pro. 
  // Maybe we only show it on specific pages or globally once?
  // Requirement: "authentication... show a popup message to upgrade... If user close... redirect it to profile page"
  // RouteGuard handles redirect.
  // We can control modal visibility with local state or global context.

  // For simplicity, let's render it if condition met.
  // But we need close handler.

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isTrialExpired && !isProActive) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isTrialExpired, isProActive]);

  return <UpgradeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
