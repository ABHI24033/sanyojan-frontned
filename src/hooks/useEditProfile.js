import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserProfileById, updateProfile, updateUserProfileById } from "../api/profile";
import { useAuth } from "../context/AuthContext";
import indiaData from "../data/indiaData.json";

export function useEditProfile(userId = null) {
  const { user, refetch: refetchAuth } = useAuth();

  const [formData, setFormData] = useState({
    // PERSONAL INFO
    prefix: "",
    firstname: "",
    lastname: "",
    gender: "",
    dob: "",
    age: "",
    dateOfDeath: "",
    birthPlace: "",
    deathPlace: "",
    marital_status: "",
    marriageDate: "",

    // ACCOUNT INFO
    phone: "",
    whatsappNo: "",
    email: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    postalCode: "",

    // EDUCATION
    education: [
      { level: "Class 10th", year: "", institution: "" },
      { level: "Class 12th", year: "", institution: "" },
      { level: "Graduation", year: "", institution: "" },
      { level: "Post Graduation", year: "", institution: "" }
    ],

    // EMPLOYMENT
    jobCategory: "",
    employmentHistory: [
      { fromYear: "", toYear: "", company: "", designation: "" }
    ],

    // OTHER DETAILS
    foodPreference: "",
    bloodGroup: "",
    religion: "",
    parish: "",
    church: "",
    parishPriest: "",
    parishCoordinator: "",
    parishContact: "",
    lifeHistory: "",
    religionDetails: "",
    burialPlace: "",
    lifeHistoryDocuments: [], // For PDF documents
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // ------------------------------------------------
  // ✅ GET User Profile API (React Query)
  // ------------------------------------------------
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userId ? getUserProfileById(userId) : getUserProfile(),
    enabled: !!userId || !userId // Enable if userId exists (admin edit) or doesn't (self edit)
  });

  // Initialize form data when GET completes
  useEffect(() => {
    if (userData?.data) {
      // Logic for getUserProfileById structure: { data: { profile: {...}, user: {...} } } or similar
      // User specified structure: userData.data.profile contains the main info

      const profileData = userData.data.profile || userData.data;
      const u = profileData;
      const connectedUser = u.user || {};

      const formattedUser = {
        ...u,

        // Map fields from User model if present (user provided instruction: use userData.data.profile.user)
        firstname: connectedUser.firstname || u.firstname || "",
        lastname: connectedUser.lastname || u.lastname || "",
        email: connectedUser.email || u.email || "",
        phone: connectedUser.phone || u.phone || "",

        // Date formatting
        dob: u.dob ? u.dob.split("T")[0] : "",
        marriageDate: u.marriageDate ? u.marriageDate.split("T")[0] : "",
        dateOfDeath: u.dateOfDeath ? u.dateOfDeath.split("T")[0] : "",

        education: (u.education && u.education.length > 0) ? u.education : [
          { level: "Class 10th", year: "", institution: "" },
          { level: "Class 12th", year: "", institution: "" },
          { level: "Graduation", year: "", institution: "" },
          { level: "Post Graduation", year: "", institution: "" }
        ],
        employmentHistory: (u.employmentHistory && u.employmentHistory.length > 0) ? u.employmentHistory : [
          { fromYear: "", toYear: "", company: "", designation: "" }
        ],

        // Life history documents
        lifeHistoryDocuments: u.lifeHistoryDocuments || [],
      };

      setFormData((prev) => ({ ...prev, ...formattedUser }));

      setImagePreview(
        u.profilePicture || null
      );
    }
  }, [userData]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Auto-calc age
    if (name === "dob") {
      const dobDate = new Date(value);
      if (!isNaN(dobDate)) {
        const diff = new Date().getFullYear() - dobDate.getFullYear();
        setFormData((prev) => ({
          ...prev,
          dob: value,
          age: diff.toString(),
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
      ...(name === "state" ? { city: "" } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Education handlers
  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
      return { ...prev, education: updatedEducation };
    });
  };

  // Employment handlers
  const handleEmploymentChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedHistory = [...prev.employmentHistory];
      updatedHistory[index] = { ...updatedHistory[index], [field]: value };
      return { ...prev, employmentHistory: updatedHistory };
    });
  };

  const addEmploymentRow = () => {
    setFormData((prev) => ({
      ...prev,
      employmentHistory: [
        ...prev.employmentHistory,
        { fromYear: "", toYear: "", company: "", designation: "" }
      ]
    }));
  };

  const removeEmploymentRow = (index) => {
    setFormData((prev) => {
      const updatedHistory = prev.employmentHistory.filter((_, i) => i !== index);
      return { ...prev, employmentHistory: updatedHistory };
    });
  };

  // Upload profile image
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // States / Cities logic
  const states = indiaData.states.map((s) => s.state);
  const selectedStateObj = indiaData.states.find((s) => s.state === formData.state);
  const cities = selectedStateObj ? selectedStateObj.cities : [];

  // Reset form
  const handleCancel = () => {
    if (userData?.data) {
      refetchProfile();
    }
  };

  // ------------------------------------------------
  // UPDATE MUTATION
  // ------------------------------------------------
  const updateProfileMutation = useMutation({
    mutationFn: (payload) => {
      if (userId) {
        return updateUserProfileById(userId, payload);
      }
      return updateProfile(payload);
    },
    onSuccess: async (data) => {
      await refetchAuth();
      await refetchProfile();

      setAlert({
        type: "success",
        message: data?.message || "Profile updated successfully!",
      });
      setProfileImage(null);
    },
    onError: (err) => {
      setAlert({
        type: "danger",
        message: err?.message || "Failed to update profile.",
      });
    },
  });

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    if (profileImage) {
      formDataToSend.append("profilePicture", profileImage);
    }

    // Editable fields that should be sent to the backend
    const editableFields = [
      "prefix",
      "firstname",
      "lastname",
      "gender",
      "dob",
      "age",
      "birthPlace",
      "marital_status",
      "marriageDate",
      "phone",
      "whatsappNo",
      "email",
      "address",
      "country",
      "state",
      "city",
      "postalCode",
      "education",
      "jobCategory",
      "employmentHistory",
      "foodPreference",
      "bloodGroup",
      "religion",
      "parish",
      "church",
      "parishPriest",
      "parishCoordinator",
      "parishContact",
      "lifeHistory",
      "religionDetails",
      "dateOfDeath",
      "deathPlace",
      "burialPlace",
    ];

    editableFields.forEach((key) => {
      const value = formData[key];
      if (value !== null && value !== undefined) {
        if (key === "education" || key === "employmentHistory") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // Join non-JSON arrays with commas as expected by backend transformFormData
          formDataToSend.append(key, value.join(","));
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    updateProfileMutation.mutate(formDataToSend);
  };

  return {
    formData,
    errors,
    alert,
    setAlert,
    imagePreview,
    handleChange,
    handleEducationChange,
    handleEmploymentChange,
    addEmploymentRow,
    removeEmploymentRow,
    handleFileUpload,
    handleSubmit,
    handleCancel,
    states,
    cities,
    isUserLoading,
    isPending: updateProfileMutation.isPending,
  };
}
