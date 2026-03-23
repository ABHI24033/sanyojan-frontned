import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-center pt-0 pb-40">
                        <div className="mb-20">
                            <i className="fas fa-crown text-warning display-4"></i>
                        </div>
                        <h4 className="mb-16">Free Trial Expired</h4>
                        <p className="text-secondary-light mb-32">
                            Your 3-month free trial has ended. <br />
                            Upgrade to Pro to continue accessing all features including Family Tree, Events, and Feed.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-24"
                                onClick={onClose}
                            >
                                Not Now
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary px-24"
                                onClick={() => navigate('/subscriptions')}
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
