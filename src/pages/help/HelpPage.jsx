import React from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import { Icon } from '@iconify/react';

const HelpPage = () => {
    return (
        <MasterLayout>
            <div className="container py-4">
                <div className="mb-4">
                    <h4 className="mb-1 text-primary-600 fw-bold">Help & Support</h4>
                    <p className="text-secondary-light text-sm">We are here to help you. Reach out to us for any queries.</p>
                </div>

                <div className="row gy-4">
                    {/* Contact Details Column */}
                    <div className="col-lg-5">
                        <div className="row gy-4">
                            {/* Address Card */}
                            <div className="col-12">
                                <div className="card h-100 p-0 shadow-none border bg-transparent radius-12">
                                    <div className="card-body p-24 d-flex align-items-start gap-3">
                                        <div className="w-56-px h-56-px rounded-circle bg-primary-50 text-primary-600 d-flex justify-content-center align-items-center flex-shrink-0">
                                            <Icon icon="solar:map-point-bold" width="28" height="28" />
                                        </div>
                                        <div>
                                            <h6 className="mb-2 fw-bold text-primary-light">Our Office</h6>
                                            <p className="text-secondary-light text-sm mb-0">
                                                Harmu , Ranchi , Jharkhand - 834002
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="col-12">
                                <div className="card h-100 p-0 shadow-none border bg-transparent radius-12">
                                    <div className="card-body p-24 d-flex align-items-start gap-3">
                                        <div className="w-56-px h-56-px rounded-circle bg-info-50 text-info-600 d-flex justify-content-center align-items-center flex-shrink-0">
                                            <Icon icon="solar:letter-bold" width="28" height="28" />
                                        </div>
                                        <div>
                                            <h6 className="mb-2 fw-bold text-primary-light">Email Us</h6>
                                            {/* <p className="text-secondary-light text-sm mb-1">
                                                sanyojantree@gmail.com
                                            </p> */}
                                            <p className="text-secondary-light text-sm mb-0">
                                                hello@sanyojan.in
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* What's app Card */}
                            <div className="col-12">
                                {/* <div className="card h-100 p-0 shadow-none border bg-transparent radius-12">
                                    <div className="card-body p-24 d-flex align-items-start gap-3">
                                        <div className="w-56-px h-56-px rounded-circle bg-success-50 text-success-600 d-flex justify-content-center align-items-center flex-shrink-0">
                                            <Icon icon="mdi:whatsapp" width="28" height="28" />
                                        </div>
                                        <div>
                                            <h6 className="mb-2 fw-bold text-primary-light">What's App</h6>
                                            <p className="text-secondary-light text-sm mb-1">
                                                +91 8987583711
                                            </p>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="card h-100 p-0 shadow-none border bg-transparent radius-12">
                                    <div className="card-body p-24 d-flex align-items-center gap-3">

                                        {/* Icon */}
                                        <div className="w-56-px h-56-px rounded-circle bg-success-50 text-success-600 
                    d-flex justify-content-center align-items-center flex-shrink-0">
                                            <Icon icon="mdi:whatsapp" width="28" height="28" />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h6 className="mb-1 fw-bold text-primary-light">WhatsApp</h6>

                                            {/* Clickable Number */}
                                            <a
                                                href="https://wa.me/918987583711"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-secondary-light text-sm text-decoration-none"
                                            >
                                                +91 89875 83711
                                            </a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Column */}
                    <div className="col-lg-7">
                        <div className="card h-100 p-0 shadow-none border bg-transparent radius-12 overflow-hidden">
                            <div className="card-body p-0 h-100 min-h-300-px">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14651.746733293798!2d85.29495294430961!3d23.354308362886066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e056ddebf877%3A0x57954cebe2300c0c!2sHarmu%20Housing%20Colony%2C%20Argora%2C%20Ranchi%2C%20Jharkhand%20834002!5e0!3m2!1sen!2sin!4v1767624112796!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: '400px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Office Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default HelpPage;