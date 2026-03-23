import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import SelectBox from "../common/SelectBox"; // Added import
import ProfileImageUpload from "../common/ProfileUpload";
import { Icon } from "@iconify/react";
import './AddRelationshipModal.css'

const EditMemberModal = ({ show, onClose, onUpdate, memberData }) => {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth, dateOfDeath = null) => {
    if (!dateOfBirth) return "";

    const birthDate = new Date(dateOfBirth);
    // If dead, age is calculated till death date. If alive, till today.
    const endDate = dateOfDeath ? new Date(dateOfDeath) : new Date();

    if (isNaN(birthDate.getTime()) || (dateOfDeath && isNaN(endDate.getTime()))) return "";

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year (relative to end date)
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 0 ? age : 0;
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    // basic check for valid date
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    prefix: "", // New Field
    phone: "",
    email: "",
    dob: "",
    dateOfDeath: "", // New Field
    age: "",
    gender: "other",
    religion: "",
    profilePicture: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Populate form when memberData changes
  useEffect(() => {
    if (show && memberData) {
      // Handle dummy phone numbers for Late members
      let initialPhone = memberData.phone || "";
      if (initialPhone.startsWith("DEAD-")) {
        initialPhone = "";
      }

      setFormData({
        firstname: memberData.firstname || "",
        lastname: memberData.lastname || "",
        prefix: memberData.prefix || "",
        phone: initialPhone,
        email: memberData.email || "",
        dob: formatDateForInput(memberData.dob) || "",
        dateOfDeath: formatDateForInput(memberData.dateOfDeath) || "",
        age: memberData.age || "",
        gender: memberData.gender || "other",
        religion: memberData.religion || "",
        profilePicture: memberData.profilePicture || ""
      });
      setErrors({});
      setSelectedFile(null);
      setUploadProgress("");
    }
  }, [show, memberData]);

  // Reset upload state when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedFile(null);
      setUploadProgress("");
      setUploadingImage(false);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const calculatedAge = calculateAge(value, formData.dateOfDeath);
      setFormData(prev => ({
        ...prev,
        dob: value,
        age: calculatedAge
      }));
      setErrors(prev => ({ ...prev, dob: "", age: "" }));
    } else if (name === "dateOfDeath") {
      const calculatedAge = calculateAge(formData.dob, value);
      setFormData(prev => ({
        ...prev,
        dateOfDeath: value,
        age: calculatedAge
      }));
      setErrors(prev => ({ ...prev, dateOfDeath: "", age: "" }));
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // If prefix changes to 'Late', we might need logic? Not really, controlled by render.
        // Recalc age if dob was somehow dependent (it's not).
        return newData;
      });

      // Clear error
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle file selection
  const handleFileUpload = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadProgress("Image selected");
    setErrors(prev => ({ ...prev, profilePicture: "" }));
  };

  const isLate = formData.prefix === 'Late';

  const validate = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }
    if (!formData.religion?.trim()) {
      newErrors.religion = "Religion is required";
    }

    if (isLate) {
      // Optional Phone/Email logic for Late members
      if (formData.phone && formData.phone.trim() !== "" && !/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be exactly 10 digits";
      }
      if (formData.email && formData.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      // Death Date required
      if (!formData.dateOfDeath) {
        newErrors.dateOfDeath = "Date of death is required for Late members";
      }
      // Custom check: Date of death > DOB
      if (formData.dob && formData.dateOfDeath) {
        if (new Date(formData.dateOfDeath) < new Date(formData.dob)) {
          newErrors.dateOfDeath = "Date of death must be after Date of birth";
        }
      }
    } else {
      // Alive - Phone Mandatory, Email Mandatory (as per Add logic usually, but user mentioned fix issue)
      // Let's enforce standard validation for living members
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be exactly 10 digits";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      newErrors.age = "Age must be between 0 and 120";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setUploadingImage(true);
    setUploadProgress("Updating member...");

    try {
      // Pass the file along with other form data
      await onUpdate(memberData.userId, {
        ...formData,
        dateOfDeath: formData.dateOfDeath || null, // send null if allowed to clear? Backend handles check.
        file: selectedFile // Include the file if selected
      });

      setSelectedFile(null);
      setUploadProgress("");
      // onClose handled by parent usually after success, or here?
      // FamilyTreePage handles closing after success.
    } catch (error) {
      console.error("Error updating member:", error);
      setErrors({ submit: error.message || "Failed to update family member" });
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  if (!memberData) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="xl" dialogClassName="modal-xxl">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-xl fw-bold text-neutral-900 d-flex align-items-center gap-12">
          <div className="d-flex align-items-center justify-content-center bg-primary-50 text-primary-600 rounded-circle w-40-px h-40-px">
            <Icon icon="fluent:person-edit-24-filled" width="24" height="24" />
          </div>
          <span>
            Edit {memberData.firstname} {memberData.lastname}
          </span>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="px-32 py-24 overflow-y-auto" style={{ maxHeight: '75vh' }}>
          {errors.submit && (
            <div className="alert alert-danger bg-danger-50 text-danger-700 border-danger-200 px-16 py-12 mb-24 radius-8 d-flex align-items-center gap-12" role="alert">
              <Icon icon="mingcute:alert-fill" className="text-xl" />
              {errors.submit}
            </div>
          )}
          <div className="row g-24">
            {/* LEFT COLUMN: Profile Image & Gender */}
            <div className="col-lg-4 d-flex flex-column align-items-center border-end-lg border-neutral-200 pe-lg-24">
              {/* Profile Picture Upload */}
              <div className="mb-24 w-100 text-center">
                <label className="form-label fw-semibold text-neutral-900 mb-12">Profile Photo</label>
                <div className="mx-auto">
                  <ProfileImageUpload
                    onFileSelect={handleFileUpload}
                    error={errors.profilePicture}
                    value={formData.profilePicture}
                    gender={formData.gender}
                  />
                </div>
                {uploadingImage && (
                  <div className="mt-8 d-flex align-items-center justify-content-center gap-8 text-primary">
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span className="text-xs">Uploading...</span>
                  </div>
                )}
                {!uploadingImage && selectedFile && (
                  <div className="mt-8 text-success text-xs fw-medium d-flex align-items-center justify-content-center gap-4">
                    <Icon icon="mdi:check-circle" />
                    {selectedFile.name.substring(0, 15)}...
                  </div>
                )}
              </div>

              {/* Gender Selection */}
              <div className="w-100">
                <label className="form-label fw-semibold text-neutral-900 mb-12 d-block text-center">Gender</label>
                <div className="d-flex flex-column gap-12">
                  {['male', 'female', 'other'].map((g) => (
                    <div key={g} className="form-check style-check d-flex align-items-center p-0">
                      <input
                        className="form-check-input visually-hidden"
                        type="radio"
                        name="gender"
                        id={`gender${g}Edit`}
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                      />
                      <label
                        className={`form-check-label w-100 p-10 radius-8 border cursor-pointer d-flex align-items-center gap-8 transition-2 ${formData.gender === g ? 'border-primary-500 bg-primary-50 text-primary-700 fw-medium' : 'border-neutral-200 text-neutral-600 hover-bg-neutral-50'}`}
                        htmlFor={`gender${g}Edit`}
                      >
                        {g === 'male' && <Icon icon="fa6-solid:person" />}
                        {g === 'female' && <Icon icon="fa6-solid:person-dress" />}
                        {g === 'other' && <Icon icon="fa6-solid:genderless" />}
                        <span className="text-capitalize">{g}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Form Fields */}
            <div className="col-lg-8 ps-lg-24">
              {/* SECTION: Personal Information */}
              <div className="mb-24">
                <h6 className="text-md fw-bold text-neutral-900 mb-16 d-flex align-items-center gap-8 border-bottom pb-8">
                  <Icon icon="solar:user-id-bold" className="text-primary-600" />
                  Personal Information
                </h6>

                {/* Row 1: Prefix & First Name */}
                <div className="row g-16 mb-16">
                  <div className="col-md-4">
                    <SelectBox
                      label="Prefix"
                      name="prefix"
                      value={formData.prefix}
                      onChange={handleChange}
                      options={[
                        { value: "Mr.", label: "Mr." },
                        { value: "Mrs.", label: "Mrs." },
                        { value: "Miss", label: "Miss" },
                        { value: "Ms.", label: "Ms." },
                        { value: "Dr.", label: "Dr." },
                        { value: "Late", label: "Late" },
                      ]}
                      placeholder="Prefix"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-medium text-neutral-900 mb-8">First Name <span className="text-danger-600">*</span></label>
                    <input
                      type="text"
                      className={`form-control h-48-px bg-neutral-50 radius-8 ${errors.firstname ? 'is-invalid' : ''}`}
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    {errors.firstname && <div className="text-danger-600 text-xs mt-4">{errors.firstname}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-medium text-neutral-900 mb-8">Last Name <span className="text-danger-600">*</span></label>
                    <input
                      type="text"
                      className={`form-control h-48-px bg-neutral-50 radius-8 ${errors.lastname ? 'is-invalid' : ''}`}
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    {errors.lastname && <div className="text-danger-600 text-xs mt-4">{errors.lastname}</div>}
                  </div>
                </div>

                {/* Row 2: Last Name & DOB */}
                <div className="row g-16 mb-16">
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-neutral-900 mb-8">Date of Birth <span className="text-danger-600">*</span></label>
                    <input
                      type="date"
                      className={`form-control h-48-px bg-neutral-50 radius-8 ${errors.dob ? 'is-invalid' : ''}`}
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    {errors.dob && <div className="text-danger-600 text-xs mt-4">{errors.dob}</div>}
                  </div>
                  {/* {formData.prefix === 'Late' && ( */}
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-neutral-900 mb-8">Date of Death
                      {formData?.prefix === 'Late' && <span className="text-danger-600">*</span>}
                    </label>
                    <input
                      type="date"
                      className={`form-control h-48-px bg-neutral-50 radius-8 ${errors.dateOfDeath ? 'is-invalid' : ''}`}
                      name="dateOfDeath"
                      value={formData.dateOfDeath}
                      onChange={handleChange}
                    />
                    {errors.dateOfDeath && <div className="text-danger-600 text-xs mt-4">{errors.dateOfDeath}</div>}
                  </div>
                  {/* )} */}
                </div>

                {/* Row 3: Date of Death (if Late) & Age */}
                <div className="row g-16">
                  <div className={formData.prefix === 'Late' ? "col-md-6" : "col-md-6"}>
                    <label className="form-label fw-medium text-neutral-900 mb-8">Age</label>
                    <input
                      type="text"
                      className="form-control h-48-px bg-neutral-200 radius-8 text-neutral-600 cursor-not-allowed"
                      value={`${formData.age} yrs`}
                      readOnly
                    />
                  </div>
                </div>

                {/* Row 4: Religion */}
                <div className="row g-16 mt-0 mb-16">
                  <div className="col-md-6">
                    <SelectBox
                      label="Religion *"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      error={errors.religion}
                      options={[
                        { label: "Christian", value: "Christian" },
                        { label: "Hindu", value: "Hindu" },
                        { label: "Muslim", value: "Muslim" },
                        { label: "Sikh", value: "Sikh" },
                        { label: "Other", value: "Other" },
                      ]}
                      placeholder="Select Religion"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Contact Information */}
              <div className="mb-0">
                <h6 className="text-md fw-bold text-neutral-900 mb-16 d-flex align-items-center gap-8 border-bottom pb-8">
                  <Icon icon="solar:phone-bold" className="text-primary-600" />
                  Contact Information
                </h6>

                {/* Row 4: Phone & Email */}
                <div className="row g-16">
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-neutral-900 mb-8">
                      Phone Number {!isLate && <span className="text-danger-600">*</span>}
                    </label>
                    <div className="position-relative">
                      <Icon icon="solar:phone-linear" className="position-absolute top-50 start-0 translate-middle-y ms-16 text-neutral-500 text-lg" />
                      <input
                        type="tel"
                        className={`form-control h-48-px bg-neutral-50 radius-8 ps-40 ${errors.phone ? 'is-invalid' : ''}`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9123456789"
                        maxLength="10"
                      />
                    </div>
                    {errors.phone && <div className="text-danger-600 text-xs mt-4">{errors.phone}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-neutral-900 mb-8">
                      Email Address {!isLate && <span className="text-danger-600">*</span>}
                    </label>
                    <div className="position-relative">
                      <Icon icon="solar:letter-linear" className="position-absolute top-50 start-0 translate-middle-y ms-16 text-neutral-500 text-lg" />
                      <input
                        type="email"
                        className={`form-control h-48-px bg-neutral-50 radius-8 ps-40 ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="member@example.com"
                      />
                    </div>
                    {errors.email && <div className="text-danger-600 text-xs mt-4">{errors.email}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 px-24 pb-24">
          <div className="d-flex gap-12 w-100 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary text-sm btn-sm px-20 py-11 radius-8"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-20 py-11 radius-8"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                "Update Member"
              )}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal >
  );
};

export default EditMemberModal;

