import React from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const SocialMediaPage = () => {
    const socialLinks = [
        {
            name: 'Facebook',
            icon: 'logos:facebook',
            url: 'https://facebook.com',
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
            description: 'Join our community on Facebook for updates and event photos.'
        },
        {
            name: 'Instagram',
            icon: 'skill-icons:instagram',
            url: 'https://instagram.com',
            color: 'text-danger-600',
            bgColor: 'bg-danger-50',
            description: 'Follow us for visual stories and daily moments from sanyojan.'
        },
        {
            name: 'Twitter (X)',
            icon: 'prime:twitter',
            url: 'https://twitter.com',
            color: 'text-info-600', // Twitter Blue
            bgColor: 'bg-info-50',
            description: 'Stay tuned with quick updates and announcements.'
        },
        {
            name: 'YouTube',
            icon: 'logos:youtube-icon',
            url: 'https://youtube.com',
            color: 'text-danger-600',
            bgColor: 'bg-danger-50',
            description: 'Watch event highlights, interviews, and family videos.'
        }
    ];

    return (
        <MasterLayout>
            <div className="container py-4">
                <div className="mb-4">
                    <h4 className="mb-1 text-primary-600 fw-bold">Follow Us</h4>
                    <p className="text-secondary-light text-sm">Follow us on social media to stay updated with sanyojan across our social platforms.</p>
                </div>

                <div className="row gy-4">
                    {socialLinks.map((social, index) => (
                        <div key={index} className="col-xxl-3 col-lg-4 col-sm-6">
                            <div className="card h-100 p-0 shadow-none border bg-transparent radius-12 hover-scale-sm transition-all">
                                <div className="card-body p-24 d-flex flex-column align-items-center text-center">
                                    <div className={`w-64-px h-64-px rounded-circle d-flex justify-content-center align-items-center mb-3 ${social.bgColor}`}>
                                        <Icon icon={social.icon} width="32" height="32" />
                                    </div>
                                    <h5 className="mb-2 fw-bold text-primary-light">{social.name}</h5>
                                    <p className="text-secondary-light text-sm mb-4">{social.description}</p>

                                    <Link
                                        to={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2 radius-8 mt-auto"
                                    >
                                        Visit Page <Icon icon="iconamoon:arrow-right-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MasterLayout>
    );
};

export default SocialMediaPage;