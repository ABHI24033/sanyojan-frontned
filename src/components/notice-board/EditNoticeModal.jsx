import CreateNoticeForm from "./AddNoticeForm";
import { useEffect, useState } from "react";

const EditNoticeForm = ({ initialData = {}, onSubmitHandler }) => {
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Active",
    });

    const [pdf, setPdf] = useState(null);

    useEffect(() => {
        if (initialData?._id) {
            setForm({
                title: initialData.title || "",
                category: initialData.category || "",
                description: initialData.description || "",
                startDate: initialData.startDate?.slice(0, 10) || "",
                endDate: initialData.endDate?.slice(0, 10) || "",
                status: initialData.status || "Active",
            });
            setPdf(null);
        }
    }, [initialData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
        } else {
            alert("Please select a valid PDF file");
            e.target.value = null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("startDate", form.startDate);
        formData.append("endDate", form.endDate);
        formData.append("status", form.status);
        if (pdf) {
            formData.append("pdf", pdf);
        }

        onSubmitHandler(formData);
    };

    return (
        <form className="d-flex flex-column gap-20" onSubmit={handleSubmit}>
            <div>
                <label className="form-label fw-bold">Notice Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="form-control border radius-8"
                />
            </div>

            <div className="row">
                <div className="col-md-6">
                    <label className="form-label fw-bold">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="form-control border radius-8"
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="form-control border radius-8"
                    />
                </div>
            </div>

            <div>
                <label className="form-label fw-bold">Update PDF (Optional)</label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="form-control border radius-8"
                />
                {initialData?.pdfUrl && (
                    <p className="text-success small mt-1">Current PDF: <a href={initialData.pdfUrl} target="_blank" rel="noreferrer">View</a></p>
                )}
            </div>

            <div>
                <label className="form-label fw-bold">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control border radius-8"
                    rows={6}
                />
            </div>

            <button type="submit" className="btn btn-primary radius-8">
                Update Notice
            </button>
        </form>
    );
};




const EditNoticeModal = ({ show, onClose, data, onUpdate }) => {

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content p-3">

                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Edit Notice</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <EditNoticeForm
                            initialData={data}
                            onSubmitHandler={(values) => onUpdate({ id: data._id, data: values })}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditNoticeModal;
