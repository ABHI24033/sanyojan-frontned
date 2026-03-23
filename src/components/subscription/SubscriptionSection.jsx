import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const SubscriptionSection = () => {
    const { user, isProActive, isTrialExpired } = useAuth();
    const navigate = useNavigate();

    // Calculate trial days remaining
    const getTrialDaysRemaining = () => {
        if (!user?.createdAt) return 0;
        const createdDate = new Date(user.createdAt);
        const trialEndDate = new Date(createdDate);
        trialEndDate.setMonth(trialEndDate.getMonth() + 3);

        const today = new Date();
        const diffTime = trialEndDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    // Get Pro expiry date
    const getProExpiryDate = () => {
        if (!user?.subscription?.expiryDate) return null;
        return new Date(user.subscription.expiryDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const trialDays = getTrialDaysRemaining();
    const proExpiry = getProExpiryDate();

    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                        <Icon icon="mdi:crown" className="text-warning" width={20} />
                        Subscription
                    </h6>
                    {isProActive && (
                        <span className="badge bg-success-subtle text-success px-2 py-1">
                            <Icon icon="mdi:check-circle" className="me-1" width={14} />
                            Pro
                        </span>
                    )}
                </div>

                {/* Status Display */}
                {isProActive ? (
                    // Pro User View
                    <div className="bg-success-subtle rounded-3 p-3 mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Icon icon="mdi:star-circle" className="text-success" width={24} />
                            <span className="fw-medium text-success">Pro Member</span>
                        </div>
                        <p className="text-muted mb-0 small">
                            <Icon icon="mdi:calendar" className="me-1" width={14} />
                            Valid until: <strong>{proExpiry}</strong>
                        </p>
                    </div>
                ) : (
                    // Free Trial User View
                    <div className={`rounded-3 p-3 mb-3 ${isTrialExpired ? 'bg-danger-subtle' : 'bg-primary-subtle'}`}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Icon
                                icon={isTrialExpired ? "mdi:alert-circle" : "mdi:clock-outline"}
                                className={isTrialExpired ? "text-danger" : "text-primary"}
                                width={24}
                            />
                            <span className={`fw-medium ${isTrialExpired ? 'text-danger' : 'text-primary'}`}>
                                {isTrialExpired ? 'Trial Expired' : 'Free Trial'}
                            </span>
                        </div>
                        {isTrialExpired ? (
                            <p className="text-danger mb-0 small">
                                Your free trial has ended. Upgrade to Pro to continue accessing all features.
                            </p>
                        ) : (
                            <p className="text-muted mb-0 small">
                                <Icon icon="mdi:timer-sand" className="me-1" width={14} />
                                <strong>{trialDays} days</strong> remaining in your trial
                            </p>
                        )}
                    </div>
                )}

                {/* Features List */}
                <div className="mb-3">
                    <p className="text-muted small mb-2">
                        {isProActive ? 'Your Pro benefits:' : 'Upgrade to unlock:'}
                    </p>
                    <ul className="list-unstyled mb-0 small">
                        <li className="d-flex align-items-center gap-2 mb-1">
                            <Icon icon="mdi:check" className={isProActive ? "text-success" : "text-muted"} width={16} />
                            <span className={isProActive ? "" : "text-muted"}>Unlimited Family Tree Access</span>
                        </li>
                        <li className="d-flex align-items-center gap-2 mb-1">
                            <Icon icon="mdi:check" className={isProActive ? "text-success" : "text-muted"} width={16} />
                            <span className={isProActive ? "" : "text-muted"}>Create & Host Events</span>
                        </li>
                        <li className="d-flex align-items-center gap-2 mb-1">
                            <Icon icon="mdi:check" className={isProActive ? "text-success" : "text-muted"} width={16} />
                            <span className={isProActive ? "" : "text-muted"}>Priority Support</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                    {isProActive ? (
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate('/subscriptions')}
                        >
                            <Icon icon="mdi:cog" className="me-1" width={16} />
                            Manage Subscription
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate('/subscriptions')}
                        >
                            <Icon icon="mdi:crown" className="me-1" width={16} />
                            Upgrade to Pro
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSection;
