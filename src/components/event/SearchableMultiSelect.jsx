import React, { useState, useRef, useEffect, useMemo } from "react";
import "./event.css";

export default function UserMultiSelect({ options = [], onChange, selected = [] }) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef();

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Memoize filtered options to avoid double filtering and for Select All logic
    const filteredOptions = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return options.filter(user => {
            const name = (user.fullName || user.name || `${user.firstname} ${user.lastname}`).toLowerCase();
            const phone = (user.phone || "").toString().toLowerCase();
            return name.includes(term) || phone.includes(term);
        });
    }, [options, searchTerm]);

    const toggleUser = (user) => {
        let updated;
        const exists = selected.some((u) => String(u.id) === String(user.id));
        if (exists) {
            updated = selected.filter((u) => String(u.id) !== String(user.id));
        } else {
            updated = [...selected, user];
        }
        onChange(updated);
    };

    const handleSelectAll = () => {
        const allFilteredSelected = filteredOptions.every(opt =>
            selected.some(s => String(s.id) === String(opt.id))
        );

        if (allFilteredSelected) {
            // Remove all filtered options from selection
            const filteredIds = new Set(filteredOptions.map(o => String(o.id)));
            const updated = selected.filter(s => !filteredIds.has(String(s.id)));
            onChange(updated);
        } else {
            // Add all filtered options to selection
            const selectedIds = new Set(selected.map(s => String(s.id)));
            const itemsToAdd = filteredOptions.filter(o => !selectedIds.has(String(o.id)));
            onChange([...selected, ...itemsToAdd]);
        }
    };

    const isAllFilteredSelected = filteredOptions.length > 0 &&
        filteredOptions.every(opt => selected.some(s => String(s.id) === String(opt.id)));

    return (
        <div className="position-relative w-100" ref={ref}>
            {/* Select Box */}
            <div
                className="custom-select-box d-flex justify-content-between align-items-center"
                onClick={() => setOpen(!open)}
            >
                <span className="selected-text">
                    {selected.length === 0
                        ? "Select users"
                        : `${selected.length} selected`}
                </span>
                <span className="dropdown-icon">▾</span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="custom-dropdown p-2">
                    {/* Search Input */}
                    <div className="mb-2 p-1">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search by name or number..."
                            autoFocus
                            value={searchTerm}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Select All (Search Aware) */}
                    {filteredOptions.length > 0 && (
                        <label
                            className="dropdown-item-wrapper d-flex align-items-center fw-bold border-bottom pb-2 mb-2"
                            style={{ cursor: "pointer" }}
                        >
                            <input
                                type="checkbox"
                                className="form-check-input me-3 mt-0"
                                checked={isAllFilteredSelected}
                                onChange={handleSelectAll}
                            />
                            {searchTerm ? "Select All Search Results" : "Select All Members"}
                        </label>
                    )}

                    <div className="options-container" style={{ maxHeight: "250px", overflowY: "auto" }}>
                        {filteredOptions.map((user) => {
                            const isChecked = selected.some((u) => String(u.id) === String(user.id));
                            return (
                                <label
                                    key={user.id}
                                    className={`dropdown-item-wrapper d-flex align-items-start rounded mb-1 ${isChecked ? 'selected-item' : ''}`}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: isChecked ? "rgba(13,110,253,0.08)" : "transparent",
                                        gap: "12px",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input flex-shrink-0"
                                        checked={isChecked}
                                        onChange={() => toggleUser(user)}
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            marginTop: "3px"
                                        }}
                                    />
                                    <div className="d-flex flex-column py-6" style={{ lineHeight: "1.25" }}>
                                        <span className="fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
                                            {user.fullName || user.name || `${user.firstname} ${user.lastname}`}
                                        </span>
                                        {user.phone && (
                                            <small className="text-muted" style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                                                📞 {user.phone}
                                            </small>
                                        )}
                                    </div>
                                </label>
                            );
                        })}

                        {filteredOptions.length === 0 && (
                            <div className="text-center p-3 text-muted small">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
