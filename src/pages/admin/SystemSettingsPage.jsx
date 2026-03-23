import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";
import { useSettings, useSettingMutations } from "../../hooks/useSettings";

export default function SystemSettingsPage() {
    const { data: settings = [], isLoading } = useSettings();
    const { updateSetting, isUpdating } = useSettingMutations();

    const [pdfSize, setPdfSize] = useState(5);
    const [imageSize, setImageSize] = useState(2);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (settings.length > 0) {
            const pSize = settings.find(s => s.key === "maxPdfSize")?.value;
            const iSize = settings.find(s => s.key === "maxImageSize")?.value;
            if (pSize) setPdfSize(pSize);
            if (iSize) setImageSize(iSize);
        }
    }, [settings]);

    const handleUpdate = async (key, value) => {
        try {
            await updateSetting({ key, value: Number(value) });
            setSuccess("Setting updated successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.error("Failed to update setting", error);
        }
    };

    if (isLoading) {
        return (
            <MasterLayout>
                <div className="p-5 text-center">
                    <div className="spinner-border text-primary"></div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-white border-bottom py-3">
                                <h4 className="mb-0 fw-bold d-flex align-items-center text-primary">
                                    <Icon icon="solar:settings-bold-duotone" className="me-2" width={32} />
                                    System Settings
                                </h4>
                                <p className="text-muted small mb-0 mt-1">Manage global application limits and configurations.</p>
                            </div>
                            <div className="card-body p-4">
                                {success && (
                                    <div className="alert alert-success d-flex align-items-center rounded-3 py-2 border-0 bg-success-subtle text-success mb-4">
                                        <Icon icon="solar:check-circle-bold" className="me-2" />
                                        <small className="fw-medium">{success}</small>
                                    </div>
                                )}

                                <div className="mb-4 p-3 bg-light rounded-4 border border-white">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h6 className="fw-bold mb-1">Knowledge Bank PDF Limit</h6>
                                            <p className="text-secondary x-small mb-0">Max size for personal PDF uploads (in MB)</p>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control border-0 bg-white"
                                            value={pdfSize}
                                            onChange={(e) => setPdfSize(e.target.value)}
                                        />
                                        <span className="input-group-text border-0 bg-white fw-bold text-muted">MB</span>
                                        <button
                                            className="btn btn-primary px-4 fw-bold"
                                            onClick={() => handleUpdate("maxPdfSize", pdfSize)}
                                            disabled={isUpdating}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4 p-3 bg-light rounded-4 border border-white">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h6 className="fw-bold mb-1">Knowledge Bank Image Limit</h6>
                                            <p className="text-secondary x-small mb-0">Max size for personal image uploads (in MB)</p>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control border-0 bg-white"
                                            value={imageSize}
                                            onChange={(e) => setImageSize(e.target.value)}
                                        />
                                        <span className="input-group-text border-0 bg-white fw-bold text-muted">MB</span>
                                        <button
                                            className="btn btn-primary px-4 fw-bold"
                                            onClick={() => handleUpdate("maxImageSize", imageSize)}
                                            disabled={isUpdating}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
