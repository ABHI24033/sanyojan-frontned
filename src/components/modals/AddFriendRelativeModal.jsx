import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Modal, Button, Form } from "react-bootstrap";
import AlertBox from "../ui/Alert";
import { useFriends } from "../../hooks/friends/useFriends";

const AddFriendRelativeModal = ({ show, onHide }) => {
    const { createContactMutation } = useFriends();
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        relation: "Friend",
        foodPreference: "Both"
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
                setFormData({ name: "", mobile: "", email: "", relation: "Friend", foodPreference: "Both" });
                setTimeout(() => {
                    setAlert({ type: "", message: "" });
                    onHide(); // Close modal on success
                }, 1000);
            },
            onError: (err) => {
                setAlert({ type: "danger", message: err.response?.data?.message || "Failed to add contact" });
            }
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold h5">Add Friend / Relative</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <AlertBox alert={alert} setAlert={setAlert} />
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Form.Label className="small fw-bold">Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <Form.Label className="small fw-bold">Relation <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            value={formData.relation}
                            onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                        >
                            <option value="Friend">Friend</option>
                            <option value="Relative">Relative</option>
                            <option value="Colleague">Colleague</option>
                            <option value="Neighbor">Neighbor</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </div>

                    <div className="mb-3">
                        <Form.Label className="small fw-bold">Mobile Number <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                        />
                    </div>

                    <div className="mb-4">
                        <Form.Label className="small fw-bold">Email <span className="text-muted fw-normal">(Optional)</span></Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <Form.Label className="small fw-bold">Food Preference</Form.Label>
                        <Form.Select
                            value={formData.foodPreference}
                            onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
                        >
                            <option value="Both">Both</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </Form.Select>
                    </div>

                    <div className="d-grid">
                        <Button
                            variant="primary"
                            type="submit"
                            className="fw-bold py-2"
                            disabled={createContactMutation.isPending}
                        >
                            {createContactMutation.isPending ? "Adding..." : "Save Contact"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddFriendRelativeModal;
