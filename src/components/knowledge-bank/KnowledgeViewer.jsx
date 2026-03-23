import React from "react";
import { Icon } from "@iconify/react";

/**
 * Main content area that renders Document (PDF) or Video (YouTube).
 */
export default function KnowledgeViewer({ item, viewMode }) {
    if (!item) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted bg-light rounded p-5">
                <Icon icon="solar:library-linear" width={64} className="mb-3 opacity-50" />
                <h5 className="fw-light">Select an item to view</h5>
            </div>
        );
    }

    const { pdfUrl, videoUrl, fileUrl, title } = item;
    // Prefer the displayMode on the item (from split logic) otherwise use global viewMode
    // If we have a fileUrl (Cloudinary) but no pdfUrl, treat it as the pdf source
    const effectivePdfUrl = pdfUrl || fileUrl;

    // Determine effective mode: if mode is 'pdf' but no pdfUrl/fileUrl exists, check if videoUrl exists
    let effectiveMode = item.displayMode || viewMode;

    // Auto-switch mode if the selected mode has no content but the other does
    if (effectiveMode === 'pdf' && !effectivePdfUrl && videoUrl) effectiveMode = 'video';
    if (effectiveMode === 'video' && !videoUrl && effectivePdfUrl) effectiveMode = 'pdf';

    console.log(effectivePdfUrl, videoUrl);


    return (
        <div className="h-100 d-flex flex-column">
            <div className="flex-grow-1 bg-white border rounded shadow-sm overflow-hidden position-relative d-flex flex-column">
                {/* PDF / FILE VIEWER */}
                {effectiveMode === "pdf" && effectivePdfUrl && (
                    <iframe
                        src={getViewerUrl(effectivePdfUrl)}
                        width="100%"
                        height="100%"
                        title={title}
                        className="w-100 h-100 border-0 flex-grow-1"
                        style={{ minHeight: "600px" }}
                    />
                )}

                {/* YOUTUBE/VIDEO VIEWER */}
                {effectiveMode === "video" && videoUrl && (
                    <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-dark p-2">
                        <div className="ratio ratio-16x9" style={{ maxWidth: '900px', width: '100%' }}>
                            <iframe
                                src={getEmbedUrl(videoUrl)}
                                title={title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded shadow-lg"
                            />
                        </div>
                    </div>
                )}

                {/* FALLBACK FOR MISSING URL */}
                {((effectiveMode === 'pdf' && !effectivePdfUrl) || (effectiveMode === 'video' && !videoUrl)) && (
                    <div className="alert alert-warning m-4 align-self-center">
                        Content URL is missing for this item.
                    </div>
                )}
            </div>
        </div>
    );
}


/**
 * Helper: Determine the best viewer URL based on source
 */
function getViewerUrl(url) {
    if (!url) return "";

    // Google Drive Links -> Use Preview
    if (url.includes("drive.google.com")) {
        return url.replace("/view", "/preview").replace("/edit", "/preview");
    }

    // Cloudinary or other PDFs -> Use Google Docs Viewer for better compatibility
    // checking for common pdf extensions or just defaulting to google viewer for remote files
    // But direct iframe works for many, let's stick to direct for now unless it fails,
    // actually Google Viewer is safer for cross-origin PDFs often.
    // However, user said "pdf from cloudaniry is not visiable" specifically.
    // Direct embedding often works better for cloudinary if headers are right.
    // Let's return URL directly for Cloudinary, but Drive needs transformation.
    return url;
}

/**
 * Helper: Convert YouTube links to embed format
 */
function getEmbedUrl(url) {
    if (!url) return "";
    if (url.includes("youtube.com/watch")) {
        const videoId = url.split("v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    // Drive preview fallback
    if (url.includes("drive.google.com/file")) {
        return url.replace("/view", "/preview");
    }
    return url;
}
