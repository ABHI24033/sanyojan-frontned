import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AlertBox from "../ui/Alert";
import { useFriends } from "../../hooks/friends/useFriends";
import Input from "../common/Input";
import SelectBox from "../common/SelectBox";

const AddContactForm = () => {
    const { createContactMutation } = useFriends();
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        relation: "Friend"
    });
    const [alert, setAlert] = useState({ type: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.mobile || !formData.relation) {
            setAlert({ type: "warning", message: "Name, Mobile and Relation are required." });
            return;
        }

        createContactMutation.mutate(formData, {
            onSuccess: () => {
                setAlert({ type: "success", message: "Contact added successfully!" });
                setFormData({ name: "", mobile: "", email: "", relation: "Friend" });
                setTimeout(() => {
                    setAlert({ type: "", message: "" });
                }, 3000);
            },
            onError: (err) => {
                setAlert({ type: "danger", message: err.response?.data?.message || "Failed to add contact" });
            }
        });
    };

    const relationOptions = [
        { label: "Friend", value: "Friend" },
        { label: "Relative", value: "Relative" },
        { label: "Colleague", value: "Colleague" },
        { label: "Neighbor", value: "Neighbor" },
        { label: "Other", value: "Other" },
    ];

    return (
        <div className="card border-0 p-3 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-bottom">
                <h6 className="fw-bold mb-0 text-primary fs-5 d-flex align-items-center">
                    <Icon icon="mdi:account-plus" className="me-10" width={24} />
                    Add Friend / Relative
                </h6>
            </div>
            <div className="card-body p-4">
                <AlertBox alert={alert} setAlert={setAlert} />
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <SelectBox
                                label="Relation"
                                name="relation"
                                options={relationOptions}
                                value={formData.relation}
                                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <Input
                                label="Mobile"
                                name="mobile"
                                type="number"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center py-10"
                                disabled={createContactMutation.isPending}
                            >
                                {createContactMutation.isPending ? "Adding..." : <><Icon icon="mdi:plus" className="me-2" /> Add Contact</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContactForm;
