import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

const SearchableMultiSelect = ({
    label,
    options = [],
    selectedValues = [],
    onChange,
    placeholder = "Select options",
    searchPlaceholder = "Search...",
    id
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        (opt.label || opt).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (val) => {
        const newSelection = selectedValues.includes(val)
            ? selectedValues.filter(v => v !== val)
            : [...selectedValues, val];
        onChange(newSelection);
    };

    const handleSelectAll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedValues.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map(opt => opt.value || opt));
        }
    };

    return (
        <div className="mb-3" ref={dropdownRef}>
            {label && <label className="form-label fw-semibold">{label}</label>}
            <div className={`position-relative custom-multi-select ${isOpen ? 'is-open' : ''}`}>
                <div
                    className="form-control d-flex align-items-center justify-content-between px-3 py-0 cursor-pointer bg-white radius-8"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ height: '40px', minHeight: '40px' }}
                >
                    <div className="flex-grow-1 overflow-hidden" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedValues.length === 0 ? (
                            <span className="text-secondary-light small">{placeholder}</span>
                        ) : (
                            <span className="text-dark">
                                {selectedValues.length === options.length ? 'All Selected' : `${selectedValues.length} Selected`}
                            </span>
                        )}
                    </div>
                    <Icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="text-muted" width={20} />
                </div>

                {isOpen && (
                    <div
                        className="position-absolute w-100 bg-white shadow-lg rounded mt-1 p-2"
                        style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6' }}
                    >
                        <div className="mb-2 position-relative">
                            <input
                                type="text"
                                className="form-control form-control-sm ps-4"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Icon
                                icon="mdi:magnify"
                                className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
                            />
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <button
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={handleSelectAll}
                            >
                                {selectedValues.length === options.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div className="d-flex flex-column gap-1">
                            {filteredOptions.length === 0 ? (
                                <div className="text-center py-2 text-muted x-small">No options found</div>
                            ) : (
                                filteredOptions.map((opt, idx) => {
                                    const val = opt.value || opt;
                                    const lbl = opt.label || opt;
                                    const isSelected = selectedValues.includes(val);
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-2 rounded cursor-pointer d-flex align-items-center gap-2 hover-bg-light ${isSelected ? 'bg-primary-50' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleOption(val);
                                            }}
                                        >
                                            <div className={`border rounded d-flex align-items-center justify-content-center ${isSelected ? 'bg-primary border-primary' : 'bg-white'}`} style={{ width: '18px', height: '18px' }}>
                                                {isSelected && <Icon icon="mdi:check" className="text-white" width={14} />}
                                            </div>
                                            <span className="small text-dark">{lbl}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableMultiSelect;
