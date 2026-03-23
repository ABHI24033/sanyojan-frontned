import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { formatDate } from "../../helper/DateFormatter";
import "./notice.css";

export default function NoticeDetails({ notice, isLoading }) {

    if (isLoading) {
        return <h2 className="text-center mt-5">Loading...</h2>;
    }

    if (!notice) {
        return <h2 className="text-center mt-5">Notice Not Found</h2>;
    }

    return (
        <div className="notice-details-container">
            {/* Back link */}
            <div className="notice-back-btn mb-3">
                <Link to="/notice">
                    <Icon icon="ri:arrow-left-line" /> Back to Notices
                </Link>
            </div>

            {/* Main card */}
            <div className="p-5">
                <div className="card-body p-5">
                    {/* Title */}
                    <h1 className="notice-details-title text-center fs-3 mb-3">
                        {notice.title}
                    </h1>

                    {/* Meta */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                        {notice.category && (
                            <span className="badge bg-light text-dark notice-tag">
                                {notice.category}
                            </span>
                        )}
                        <span className="notice-date-info">
                            <Icon icon="ri:calendar-2-line" />
                            {formatDate(notice.createdAt)}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="notice-full-description mb-0">
                        {notice.description}
                    </p>

                    {/* PDF preview */}
                    {notice?.pdfUrl && (
                        <div className="mt-4">
                            <div
                                className="pdf-preview-wrapper bg-light rounded overflow-hidden"
                                style={{ height: "600px", border: "1px solid #eee" }}
                            >
                                <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                                        notice.pdfUrl
                                    )}&embedded=true`}
                                    width="100%"
                                    height="100%"
                                    title="PDF Preview"
                                    style={{ border: "none" }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
