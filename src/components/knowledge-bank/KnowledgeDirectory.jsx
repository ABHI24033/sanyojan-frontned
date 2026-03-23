import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

/**
 * Sidebar component that groups knowledge bank entries by category and allows selection.
 * Designed with a premium, clean aesthetic and auto-selection logic.
 */
export default function KnowledgeDirectory({ knowledgeBanks = [], onSelect, selectedId, selectedMode }) {
    // Group knowledge bank entries by Category
    const grouped = knowledgeBanks.reduce((acc, item) => {
        const cat = item.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const [openCategory, setOpenCategory] = useState(null);

    // Default Selection Logic: Open first category and select first item
    useEffect(() => {
        const categories = Object.keys(grouped);
        if (categories.length > 0) {
            // 1. Ensure first category is open if none is open
            if (!openCategory) {
                setOpenCategory(categories[0]);
            }

            // 2. Select first item by default if nothing is selected
            if (!selectedId && onSelect) {
                const firstCat = categories[0];
                const firstKnowledgeBank = grouped[firstCat][0];
                if (firstKnowledgeBank) {
                    // Favor PDF then Video then default
                    const mode = firstKnowledgeBank.pdfUrl ? 'pdf' : (firstKnowledgeBank.videoUrl ? 'video' : 'link');
                    onSelect(firstKnowledgeBank, mode);
                }
            }
        }
    }, [grouped, openCategory, selectedId, onSelect]);

    return (
        <div className="knowledge-directory h-100 d-flex flex-column bg-white">
            <div className="flex-grow-1 overflow-auto custom-scrollbar pe-1">
                {Object.keys(grouped).map((category) => {
                    // Flatten items: if an item has both pdf and video, show them as two rows
                    const itemsToShow = [];
                    grouped[category].forEach(knowledgeBank => {
                        if (knowledgeBank.pdfUrl) {
                            itemsToShow.push({ ...knowledgeBank, displayMode: 'pdf' });
                        }
                        if (knowledgeBank.videoUrl) {
                            itemsToShow.push({ ...knowledgeBank, displayMode: 'video' });
                        }
                        if (!knowledgeBank.pdfUrl && !knowledgeBank.videoUrl) {
                            itemsToShow.push({ ...knowledgeBank, displayMode: 'link' });
                        }
                    });

                    return (
                        <div key={category} className="mb-2">
                            {/* CATEGORY HEADER */}
                            <div
                                className={`d-flex align-items-center px-3 py-8 rounded-3 cursor-pointer transition-all duration-200 ${openCategory === category
                                    ? "bg-primary bg-opacity-10 text-primary fw-bold"
                                    : "text-dark hover-bg-light fw-semibold"
                                    }`}
                                onClick={() => setOpenCategory(openCategory === category ? null : category)}
                            >
                                <Icon
                                    icon={openCategory === category ? "solar:folder-open-bold-duotone" : "solar:folder-bold-duotone"}
                                    className="me-3"
                                    width={22}
                                />
                                <span className="flex-grow-1">{category}</span>
                                <Icon
                                    icon={openCategory === category ? "solar:alt-arrow-down-linear" : "solar:alt-arrow-right-linear"}
                                    width={16}
                                    className="opacity-50"
                                />
                            </div>

                            {/* ITEMS LIST */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openCategory === category ? "max-h-1000 mt-8" : "max-h-0"
                                    }`}
                            >
                                <ul className="list-unstyled ms-40 ps-4  border-start bg-light border-light border-2">
                                    {itemsToShow.map((item, index) => {
                                        const isActive = selectedId === item._id && selectedMode === item.displayMode;
                                        const isPdf = item.displayMode === 'pdf';
                                        const isVideo = item.displayMode === 'video';

                                        return (
                                            <li
                                                key={`${item._id}-${item.displayMode}-${index}`}
                                                className={`d-flex align-items-center px-3 py-8 rounded-2 small mb-1 cursor-pointer transition-all ${isActive
                                                    ? "bg-primary text-white shadow-sm scale-102"
                                                    : "text-secondary hover-bg-light"
                                                    }`}
                                                style={{ transition: 'all 0.2s ease-in-out' }}
                                                onClick={() => onSelect(item, item.displayMode)}
                                            >
                                                <div className="d-flex align-items-center me-1">
                                                    {isPdf && (
                                                        <div className={`p-1 rounded-circle d-flex align-items-center justify-content-center bg-white shadow-xs`} style={{ width: "26px", height: "26px" }}>
                                                            <Icon icon="logos:google-drive" width={14} />
                                                        </div>
                                                    )}
                                                    {isVideo && (
                                                        <div className={`p-1 rounded-circle d-flex align-items-center justify-content-center bg-white shadow-xs`} style={{ width: "26px", height: "26px" }}>
                                                            <Icon icon="logos:youtube-icon" width={14} />
                                                        </div>
                                                    )}
                                                    {!isPdf && !isVideo && (
                                                        <Icon icon="solar:link-broken-linear" width={18} className={isActive ? "text-white" : "text-muted"} />
                                                    )}
                                                </div>

                                                <span className={`text-truncate flex-grow-1 ${isActive ? "fw-bold" : "fw-medium"}`}>
                                                    {item.title}
                                                </span>

                                                {isActive && (
                                                    <Icon icon="solar:round-alt-arrow-right-bold" className="ms-auto" width={18} />
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })}

                {Object.keys(grouped).length === 0 && (
                    <div className="text-center text-muted small py-5 d-flex flex-column align-items-center h-100 justify-content-center opacity-50">
                        <Icon icon="solar:box-minimalistic-linear" width={48} className="mb-2" />
                        <p>No entries found.</p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scale-102 { transform: scale(1.02); }
                .max-h-0 { max-height: 0; opacity: 0; }
                .max-h-1000 { max-height: 1000px; opacity: 1; }
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d0d0d0; }
            `}} />
        </div>
    );
}


