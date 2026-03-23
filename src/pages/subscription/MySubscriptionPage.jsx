import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/common/Breadcrumb";
import { createSubscriptionOrder, verifySubscriptionPayment } from "../../api/subscription";
import ManageFamily from "../../components/subscription/ManageFamily";

const MySubscriptionPage = () => {
    const { user, isProActive, isTrialExpired, refetch } = useAuth();
    const navigate = useNavigate();

    // Calculate trial dates
    const getTrialDates = () => {
        if (!user?.createdAt) return { start: null, end: null, daysRemaining: 0 };
        const createdDate = new Date(user.createdAt);

        let trialEndDate;
        if (user.subscription?.plan === 'free' && user.subscription?.expiryDate) {
            trialEndDate = new Date(user.subscription.expiryDate);
        } else {
            trialEndDate = new Date(createdDate);
            trialEndDate.setDate(trialEndDate.getDate() + 150);
        }

        const today = new Date();
        const diffTime = trialEndDate - today;
        const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        return {
            start: createdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            end: trialEndDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            daysRemaining
        };
    };

    // Get Pro subscription details
    const getProDetails = () => {
        if (!user?.subscription) return null;
        return {
            plan: user.subscription.plan,
            status: user.subscription.status,
            startDate: user.subscription.startDate
                ? new Date(user.subscription.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : null,
            expiryDate: user.subscription.expiryDate
                ? new Date(user.subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : null
        };
    };

    const trialInfo = getTrialDates();
    const proDetails = getProDetails();

    // Handle subscription purchase/renewal
    const handleSubscribe = async () => {
        try {
            const { order } = await createSubscriptionOrder();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Family Tree App",
                description: "Pro Subscription - 1 Year",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await verifySubscriptionPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        alert('Subscription upgraded successfully!');
                        await refetch();
                    } catch (error) {
                        alert('Payment verification failed: ' + error.message);
                    }
                },
                prefill: {
                    name: `${user?.firstname} ${user?.lastname}` || "User Name",
                    email: user?.email || "user@example.com",
                    contact: user?.phone || "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="My Subscription" />

            <div className="row g-4">
                {/* Main Subscription Card */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-20">
                            {/* Current Plan Header */}
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${isProActive ? 'bg-success-subtle' : 'bg-primary-subtle'}`}
                                        style={{ width: '60px', height: '60px' }}>
                                        <Icon
                                            icon={isProActive ? "mdi:crown" : "mdi:clock-outline"}
                                            className={isProActive ? "text-success" : "text-primary"}
                                            width={32}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="mb-1 fw-bold">
                                            {isProActive ? 'Pro Plan' : 'Free Trial'}
                                        </h5>
                                        <span className={`badge ${isProActive ? 'bg-success' : isTrialExpired ? 'bg-danger' : 'bg-primary'}`}>
                                            {isProActive ? 'Active' : isTrialExpired ? 'Expired' : 'Active'}
                                        </span>
                                    </div>
                                </div>
                                {isProActive && (
                                    <div className="text-end">
                                        <p className="mb-0 text-muted small">Next billing</p>
                                        <p className="mb-0 fw-semibold">{proDetails?.expiryDate}</p>
                                    </div>
                                )}
                            </div>

                            <hr />

                            {/* Subscription Details */}
                            <div className="row g-4 mb-4">
                                {isProActive ? (
                                    <>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Plan</p>
                                            <p className="fw-semibold mb-0">Pro (Annual)</p>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Price</p>
                                            <p className="fw-semibold mb-0">₹699/year</p>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Started On</p>
                                            <p className="fw-semibold mb-0">{proDetails?.startDate || '-'}</p>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Expires On</p>
                                            <p className="fw-semibold mb-0">{proDetails?.expiryDate || '-'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Plan</p>
                                            <p className="fw-semibold mb-0">Free Trial</p>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Duration</p>
                                            <p className="fw-semibold mb-0">5 Months</p>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">Started On</p>
                                            <p className="fw-semibold mb-0">{trialInfo.start}</p>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <p className="text-muted small mb-1">{isTrialExpired ? 'Expired On' : 'Expires On'}</p>
                                            <p className="fw-semibold mb-0">{trialInfo.end}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Trial Status Alert */}
                            {!isProActive && (
                                <div className={`alert ${isTrialExpired ? 'alert-danger' : 'alert-info'} d-flex align-items-center gap-3`}>
                                    <Icon
                                        icon={isTrialExpired ? "mdi:alert-circle" : "mdi:information"}
                                        width={24}
                                    />
                                    <div>
                                        {isTrialExpired ? (
                                            <p className="mb-0">
                                                Your free trial has expired. Upgrade to Pro to continue accessing all features.
                                            </p>
                                        ) : (
                                            <p className="mb-0">
                                                You have <strong>{trialInfo.daysRemaining} days</strong> remaining in your free trial.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 flex-wrap mt-5">
                                {isProActive ? (
                                    <button
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                        onClick={handleSubscribe}
                                    >
                                        <Icon icon="mdi:refresh" className="me-2" width={18} />
                                        Renew Subscription
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                        onClick={handleSubscribe}
                                    >
                                        <Icon icon="mdi:crown" className="me-2" width={18} />
                                        Upgrade to Pro - ₹699/year
                                    </button>
                                )}
                                <button
                                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                                    onClick={() => navigate('/upgrade-subscription')}
                                >
                                    <Icon icon="mdi:format-list-bulleted" className="me-2" width={18} />
                                    View All Plans
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Manage Family Account */}
                    <ManageFamily />
                </div>

                {/* Pro Benefits Card */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-20">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <Icon icon="mdi:star" className="text-warning" width={20} />
                                Pro Benefits
                            </h6>
                            <ul className="list-unstyled mb-0">
                                <li className="d-flex align-items-center gap-2 mb-3">
                                    <Icon icon="mdi:check-circle" className="text-success" width={18} />
                                    <span>Unlimited Family Tree Access</span>
                                </li>
                                <li className="d-flex align-items-center gap-2 mb-3">
                                    <Icon icon="mdi:check-circle" className="text-success" width={18} />
                                    <span>Create & Host Unlimited Events</span>
                                </li>
                                <li className="d-flex align-items-center gap-2 mb-3">
                                    <Icon icon="mdi:check-circle" className="text-success" width={18} />
                                    <span>Priority Customer Support</span>
                                </li>
                                <li className="d-flex align-items-center gap-2 mb-3">
                                    <Icon icon="mdi:check-circle" className="text-success" width={18} />
                                    <span>Create Unlimited Polls</span>
                                </li>
                                <li className="d-flex align-items-center gap-2 mb-3">
                                    <Icon icon="mdi:check-circle" className="text-success" width={18} />
                                    <span>Advanced Analytics</span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <Icon icon="mdi:check-circle" className="text-success" width={18} />
                                    <span>Share with Family Members</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-20">
                            <h6 className="fw-bold mb-4">Frequently Asked Questions</h6>
                            <div className="accordion" id="subscriptionFaq">
                                <div className="accordion-item border-0 mb-2">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                            What happens when my trial expires?
                                        </button>
                                    </h2>
                                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#subscriptionFaq">
                                        <div className="accordion-body">
                                            After your 5-month free trial expires, you'll need to upgrade to the Pro plan to continue accessing all features. Some basic features may still be available, but premium features like event creation will be restricted.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item border-0 mb-2">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                            How do I renew my subscription?
                                        </button>
                                    </h2>
                                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#subscriptionFaq">
                                        <div className="accordion-body">
                                            Click the "Renew Subscription" button above. You'll be redirected to our secure payment gateway (Razorpay) to complete the payment. Your subscription will be extended by 1 year from the current expiry date at the Family rate of ₹699.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item border-0">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                            Is my payment secure?
                                        </button>
                                    </h2>
                                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#subscriptionFaq">
                                        <div className="accordion-body">
                                            Yes! We use Razorpay, India's leading payment gateway, which is PCI-DSS compliant. Your payment information is encrypted and secure.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default MySubscriptionPage;
