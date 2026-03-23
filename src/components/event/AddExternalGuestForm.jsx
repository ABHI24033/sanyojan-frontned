import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExternalGuest } from "../../api/event";
import AlertBox from "../ui/Alert";
import { Icon } from "@iconify/react";

const AddExternalGuestForm = ({ eventId, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        relation: "Friend"
    });
    const [alert, setAlert] = useState({ type: "", message: "" });

    const mutation = useMutation({
        mutationFn: (data) => addExternalGuest(eventId, data),
        onSuccess: () => {
            setAlert({ type: "success", message: "Guest added successfully!" });
            queryClient.invalidateQueries(["event", eventId]);
            setFormData({ name: "", mobile: "", email: "", relation: "Friend" });
            setTimeout(() => {
                setAlert({ type: "", message: "" });
            }, 3000);
        },
        onError: (err) => {
            setAlert({ type: "danger", message: err.response?.data?.message || "Failed to add guest" });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.mobile || !formData.relation) {
            setAlert({ type: "warning", message: "Name, Mobile and Relation are required." });
            return;
        }
        mutation.mutate(formData);
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-bottom">
                <h6 className="fw-bold mb-0 text-primary">Add Friend / Relative</h6>
            </div>
            <div className="card-body">
                <AlertBox alert={alert} setAlert={setAlert} />
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Relation <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                value={formData.relation}
                                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                            >
                                <option value="Friend">Friend</option>
                                <option value="Relative">Relative</option>
                                <option value="Colleague">Colleague</option>
                                <option value="Neighbor">Neighbor</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Mobile <span className="text-danger">*</span></label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="10-digit number"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Email <span className="text-muted fw-normal">(Optional)</span></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center" disabled={mutation.isPending}>
                                {mutation.isPending ? "Adding..." : <><Icon icon="mdi:plus" className="me-2" /> Add to Guest List</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExternalGuestForm;
