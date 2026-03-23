import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import SearchableMultiSelect from './SearchableMultiSelect';
import { getMemberReportMetadata } from '../../api/report';
import { Icon } from '@iconify/react';

const MemberFilterModal = ({ show, onClose, onApply, onReset, initialFilters }) => {
    const [metadata, setMetadata] = useState({
        cities: [],
        states: [],
        jobCategories: []
    });

    const [filters, setFilters] = useState({
        ageMin: '',
        ageMax: '',
        gender: [],
        marital_status: [],
        city: [],
        state: [],
        dobStart: '',
        dobEnd: '',
        anniversaryStart: '',
        anniversaryEnd: '',
        jobCategory: [],
        foodPreference: [],
        bloodGroup: []
    });

    useEffect(() => {
        if (show) {
            setFilters(prev => ({
                ...prev,
                ...initialFilters
            }));
            fetchMeta();
        }
    }, [show, initialFilters]);

    const fetchMeta = async () => {
        try {
            const res = await getMemberReportMetadata();
            if (res.success) {
                setMetadata(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch filter metadata", err);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        const resetFilters = {
            ageMin: '',
            ageMax: '',
            gender: [],
            marital_status: [],
            city: [],
            state: [],
            dobStart: '',
            dobEnd: '',
            anniversaryStart: '',
            anniversaryEnd: '',
            jobCategory: [],
            foodPreference: [],
            bloodGroup: []
        };
        setFilters(resetFilters);
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ];

    const maritalStatusOptions = [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
        { label: 'Divorced', value: 'divorced' },
        { label: 'Widowed', value: 'widowed' },
        { label: 'Separated', value: 'separated' }
    ];

    const foodPreferenceOptions = [
        { label: 'Veg', value: 'veg' },
        { label: 'Non-Veg', value: 'non-veg' },
        { label: 'Both', value: 'both' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Jain', value: 'jain' }
    ];

    const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"];

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            size="lg"
            contentClassName="radius-12 border-0 shadow"
        >
            <Modal.Header closeButton className="border-bottom bg-neutral-50 py-16 px-24">
                <Modal.Title className="text-lg fw-bold d-flex align-items-center gap-2">
                    <Icon icon="solar:filter-bold-duotone" className="text-primary-600" width={24} />
                    Apply Filters
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-24 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <div className="row g-24">
                    {/* Basic Info Group */}
                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="Gender"
                            options={genderOptions}
                            selectedValues={filters.gender}
                            onChange={(val) => handleFilterChange('gender', val)}
                            placeholder="Select Gender"
                        />
                    </div>

                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="Marital Status"
                            options={maritalStatusOptions}
                            selectedValues={filters.marital_status}
                            onChange={(val) => handleFilterChange('marital_status', val)}
                            placeholder="Select Status"
                        />
                    </div>

                    {/* Location Group */}
                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="City"
                            options={metadata.cities}
                            selectedValues={filters.city}
                            onChange={(val) => handleFilterChange('city', val)}
                            placeholder="Select City"
                            searchPlaceholder="Search cities..."
                        />
                    </div>

                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="State"
                            options={metadata.states}
                            selectedValues={filters.state}
                            onChange={(val) => handleFilterChange('state', val)}
                            placeholder="Select State"
                        />
                    </div>

                    {/* Professional & Health Group */}
                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="Job Category"
                            options={metadata.jobCategories}
                            selectedValues={filters.jobCategory}
                            onChange={(val) => handleFilterChange('jobCategory', val)}
                            placeholder="Select category"
                        />
                    </div>

                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="Blood Group"
                            options={bloodGroupOptions}
                            selectedValues={filters.bloodGroup}
                            onChange={(val) => handleFilterChange('bloodGroup', val)}
                            placeholder="Select group"
                        />
                    </div>

                    <div className="col-md-6">
                        <SearchableMultiSelect
                            label="Veg / Non-Veg"
                            options={foodPreferenceOptions}
                            selectedValues={filters.foodPreference}
                            onChange={(val) => handleFilterChange('foodPreference', val)}
                            placeholder="Select preference"
                        />
                    </div>

                    {/* Age Range - Single Row for better alignment */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Age Range</label>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="number"
                                className="form-control h-40-px radius-8"
                                placeholder="Min"
                                value={filters.ageMin}
                                onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                            />
                            <span className="text-neutral-500 fw-medium">to</span>
                            <input
                                type="number"
                                className="form-control h-40-px radius-8"
                                placeholder="Max"
                                value={filters.ageMax}
                                onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Birthday Range - Full Width Row */}
                    <div className="col-12 my-4">
                        <div className="bg-neutral-50 p-16 radius-12 border">
                            <div className="row align-items-center g-3">
                                <div className="">
                                    <label className="form-label fw-bold d-flex align-items-center text-secondary-light">
                                        <Icon icon="solar:calendar-minimalistic-bold-duotone" className="me-2 text-primary-600" width={18} />
                                        Birthday Range
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="flex-grow-1">
                                            <input
                                                type="date"
                                                className="form-control h-40-px radius-8"
                                                value={filters.dobStart || ''}
                                                onChange={(e) => handleFilterChange('dobStart', e.target.value)}
                                            />
                                        </div>
                                        <span className="text-neutral-500 fw-medium">to</span>
                                        <div className="flex-grow-1">
                                            <input
                                                type="date"
                                                className="form-control h-40-px radius-8"
                                                value={filters.dobEnd || ''}
                                                onChange={(e) => handleFilterChange('dobEnd', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Anniversary Range - Full Width Row */}
                    <div className="col-12 my-4">
                        <div className="bg-neutral-50 p-16 radius-12 border">
                            <div className="row align-items-center g-3">
                                <div className="">
                                    <label className="form-label fw-bold mb-0 text-secondary-light">
                                        <Icon icon="solar:heart-bold-duotone" className="me-2 text-primary-600" width={18} />
                                        Anniversary Range
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="flex-grow-1">
                                            <input
                                                type="date"
                                                className="form-control h-40-px radius-8"
                                                value={filters.anniversaryStart || ''}
                                                onChange={(e) => handleFilterChange('anniversaryStart', e.target.value)}
                                            />
                                        </div>
                                        <span className="text-neutral-500 fw-medium">to</span>
                                        <div className="flex-grow-1">
                                            <input
                                                type="date"
                                                className="form-control h-40-px radius-8"
                                                value={filters.anniversaryEnd || ''}
                                                onChange={(e) => handleFilterChange('anniversaryEnd', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="p-24 border-top bg-neutral-50 d-flex justify-content-between">
                <button
                    className="btn btn-outline-secondary d-flex align-items-center gap-2 radius-8 px-20 py-10"
                    onClick={handleReset}
                >
                    <Icon icon="mdi:refresh" />
                    Reset Filters
                </button>
                <div className="d-flex gap-3">
                    <button
                        className="btn btn-neutral-200 text-neutral-600 radius-8 px-20 py-10"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2 radius-8 px-24 py-10"
                        onClick={handleApply}
                    >
                        <Icon icon="mdi:check" />
                        Apply Filters
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default MemberFilterModal;
