
import { Icon } from "@iconify/react";
import PricingPlanCard from "../../components/common/PricingCard";
import { pricingPlans, UpgradePricingPlans } from "../../data/pricingData";
import { createSubscriptionOrder, verifySubscriptionPayment, selectSubscription } from "../../api/subscription";
import { useAuth } from "../../context/AuthContext";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/common/Breadcrumb";

const UpgradeSubscriptionPage = () => {
    const { user, isProActive, isTrialExpired, refetch } = useAuth();

    // Calculate trial days remaining
    const getTrialDaysRemaining = () => {
        if (!user?.createdAt) return 0;
        const createdDate = new Date(user.createdAt);
        const trialEndDate = new Date(createdDate);
        trialEndDate.setDate(trialEndDate.getDate() + 150);

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

    const handleChoosePlan = async (plan) => {
        if (plan.type === 'Pro') {
            try {
                // 1. Create Order
                const { order } = await createSubscriptionOrder();

                // 2. Initialize Razorpay
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Family Tree App",
                    description: "Pro Subscription",
                    order_id: order.id,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment
                            await verifySubscriptionPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            alert('Subscription upgraded successfully!');
                            await refetch(); // Refetch auth state
                            window.location.href = '/'; // Redirect to dashboard
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
        } else if (plan.type === 'Starter') {
            try {
                await selectSubscription('free');
                alert('Free trial activated successfully!');
                await refetch();
                window.location.href = '/';
            } catch (error) {
                console.error("Trial activation failed", error);
                alert("Failed to activate free trial. Please try again.");
            }
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Choose Subscription Plan" />

            <div className="card border-0 shadow-sm radius-12 overflow-hidden">
                <div className="card-body p-40">
                    <div className="row justify-content-center">
                        <div className="col-xxl-10">
                            {/* Current Subscription Status Banner */}
                            {isProActive ? (
                                <div className="alert alert-success d-flex align-items-center gap-3 p-10 border-0 radius-12" role="alert">
                                    <Icon icon="mdi:check-circle" width={32} className="text-success" />
                                    <div>
                                        <h6 className="mb-1 text-success fw-bold">You're a Pro Member!</h6>
                                        <p className="mb-0 small">Your subscription is active until {proExpiry}</p>
                                    </div>
                                </div>
                            ) : isTrialExpired ? (
                                <div className="alert alert-warning d-flex align-items-center gap-3 p-4 border-0 radius-12" role="alert">
                                    <Icon icon="mdi:alert-circle" width={32} className="text-warning" />
                                    <div>
                                        <h6 className="mb-1 text-warning fw-bold">Your Free Trial Has Expired</h6>
                                        <p className="mb-0 small text-secondary-light">Upgrade to Pro to continue accessing all features</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-info d-flex align-items-center gap-3 p-4 border-0 radius-12" role="alert">
                                    <Icon icon="mdi:clock-outline" width={32} className="text-info" />
                                    <div>
                                        <h6 className="mb-1 text-info fw-bold">Free Trial Active</h6>
                                        <p className="mb-0 small text-secondary-light">You have {trialDays} days remaining in your trial</p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center">
                                <h3 className="fw-bold">Upgrade Your Experience</h3>
                                <p className="text-secondary-light text-lg">
                                    Unlock full access to Family Tree, Events, and more with our Pro plan.
                                </p>
                            </div>

                            <div className="row d-flex justify-content-center gy-4">
                                {UpgradePricingPlans?.map((plan, index) => (
                                    <PricingPlanCard
                                        key={index}
                                        plan={{
                                            ...plan,
                                            onChoose: handleChoosePlan,
                                            isCurrentPlan: isProActive && plan.type === 'Pro'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default UpgradeSubscriptionPage;
