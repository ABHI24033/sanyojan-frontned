import { Icon } from "@iconify/react";

export default function PricingPlanCard({ plan }) {
    const {
        type,
        target,
        icon,
        price,
        duration,
        description,
        features,
        badge,
        badgeBg,
    } = plan;

    return (
        <div className="col-md-6 col-lg-5 d-flex">
            <div className="pricing-plan position-relative radius-24 overflow-hidden border w-100 d-flex flex-column bg-white shadow">
                {badge && (
                    <span
                        className={`${badgeBg || 'bg-primary text-white'} radius-24 py-8 px-24 text-sm position-absolute end-0 top-0 z-1 rounded-start-top-0 rounded-end-bottom-0`}
                    >
                        {badge}
                    </span>
                )}

                <div className="d-flex align-items-center gap-16">
                    <span className="w-72-px h-72-px d-flex justify-content-center align-items-center radius-16 bg-primary-50">
                        <img src={icon} alt="icon" />
                    </span>
                    <div>
                        <span className="fw-medium text-md text-secondary-light">
                            {target}
                        </span>
                        <h6 className="mb-0">{type}</h6>
                    </div>
                </div>

                <p className="mt-16 mb-0 mb-28 text-secondary-light">
                    {description}
                </p>

                <h3 className="mb-24">
                    {price}
                    <span className="fw-medium text-md text-secondary-light">
                        {duration}
                    </span>
                </h3>

                <span className="mb-20 fw-medium">What's included</span>

                <ul>
                    {features?.map((item, index) => (
                        <li
                            key={index}
                            className="d-flex align-items-center gap-16 mb-16"
                        >
                            <span className="w-24-px h-24-px d-flex justify-content-center align-items-center rounded-circle bg-primary-600">
                                <Icon
                                    icon="iconamoon:check-light"
                                    className="text-lg text-white"
                                />
                            </span>
                            <span className="text-secondary-light text-lg">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => plan.onChoose && plan.onChoose(plan)}
                    className="text-center text-sm btn-sm px-12 py-10 w-100 radius-8 mt-auto border bg-primary-600 bg-hover-primary-700 text-white border-primary-600"
                >
                    Get started
                </button>
            </div>
        </div>
    );
}

