import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import indiaData from "../data/indiaData.json";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitProfile, getUserProfileById, updateUserProfileById, getUserProfile, updateProfile, uploadLifeHistoryDocument, removeLifeHistoryDocument } from "../api/profile";
import { useAuth } from "../context/AuthContext";

export const useProfileForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const { refetch: refetchAuth, user: currentUser, hasProfile, isProfileCompleted } = useAuth();
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        // PERSONAL INFO
        profileImage: null,
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
        religionDetails: "", // For non-Christian
        burialPlace: "",
        lifeHistoryDocuments: [], // For PDF uploads (already uploaded)
        pendingUploadFiles: [], // For PDF files waiting to be uploaded on submit
    });

    // Initialize with current user if no userId in URL
    useEffect(() => {
        if (!userId && currentUser) {
            setForm(prev => ({
                ...prev,
                firstname: currentUser.firstname || "",
                lastname: currentUser.lastname || "",
                phone: currentUser.phone || "",
            }));
        }
    }, [userId, currentUser]);

    // Fetch existing profile if userId is present OR if current user already has a profile
    const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
        queryKey: ["userProfile", userId || "me"],
        queryFn: () => userId ? getUserProfileById(userId) : getUserProfile(),
        enabled: !!userId || hasProfile,
    });

    useEffect(() => {
        const data = profileResponse?.data || profileResponse;
        if (data) {
            // Handle both getProfile (flat) and getUserProfileById (nested) response formats
            const p = data.profile || data;
            const u = data.user || p.user || {};

            if (p._id || u.firstname) {
                setForm({
                    profileImage: p.profilePicture || null,
                    prefix: p.prefix || "",
                    firstname: u.firstname || "",
                    lastname: u.lastname || "",
                    gender: p.gender || "",
                    dob: p.dob ? p.dob.split('T')[0] : "",
                    age: p.age?.toString() || "",
                    dateOfDeath: p.dateOfDeath ? p.dateOfDeath.split('T')[0] : "",
                    birthPlace: p.birthPlace || "",
                    deathPlace: p.deathPlace || "",
                    marital_status: p.marital_status || "",
                    marriageDate: p.marriageDate ? p.marriageDate.split('T')[0] : "",
                    phone: u.phone || "",
                    whatsappNo: p.whatsappNo || "",
                    email: p.email || "",
                    address: p.address || "",
                    country: p.country || "India",
                    state: p.state || "",
                    city: p.city || "",
                    postalCode: p.postalCode || "",
                    education: p.education?.length ? p.education : [
                        { level: "Class 10th", year: "", institution: "" },
                        { level: "Class 12th", year: "", institution: "" },
                        { level: "Graduation", year: "", institution: "" },
                        { level: "Post Graduation", year: "", institution: "" }
                    ],
                    jobCategory: p.jobCategory || "",
                    employmentHistory: p.employmentHistory?.length ? p.employmentHistory : [
                        { fromYear: "", toYear: "", company: "", designation: "" }
                    ],
                    foodPreference: p.foodPreference || "",
                    bloodGroup: p.bloodGroup || "",
                    religion: p.religion || "",
                    parish: p.parish || "",
                    church: p.church || "",
                    parishPriest: p.parishPriest || "",
                    parishCoordinator: p.parishCoordinator || "",
                    parishContact: p.parishContact || "",
                    lifeHistory: p.lifeHistory || "",
                    religionDetails: p.religionDetails || "",
                    burialPlace: p.burialPlace || "",
                    lifeHistoryDocuments: p.lifeHistoryDocuments || [],
                    pendingUploadFiles: [], // Reset pending files on load
                });
            }
        }
    }, [profileResponse]);

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ type: "", message: "" });

    // ---------------------------
    // HANDLE INPUT CHANGE
    // ---------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;

        // Auto-calc age
        if (name === "dob") {
            const dob = new Date(value);
            if (!isNaN(dob)) {
                const diff = new Date().getFullYear() - dob.getFullYear();
                updatedValue = value;

                setForm((prev) => ({
                    ...prev,
                    dob: value,
                    age: diff.toString(),
                }));
                return;
            }
        }

        setForm((prev) => ({
            ...prev,
            [name]: updatedValue,
            ...(name === "state" ? { city: "" } : {}),
        }));
        setErrors({});
    };

    // ---------------------------
    // HANDLE EDUCATION CHANGE
    // ---------------------------
    const handleEducationChange = (index, field, value) => {
        setForm((prev) => {
            const updatedEducation = [...prev.education];
            updatedEducation[index] = { ...updatedEducation[index], [field]: value };
            return { ...prev, education: updatedEducation };
        });
        setErrors((prev) => ({ ...prev, education: undefined }));
    };

    // ---------------------------
    // HANDLE EMPLOYMENT CHANGE
    // ---------------------------
    const handleEmploymentChange = (index, field, value) => {
        setForm((prev) => {
            const updatedHistory = [...prev.employmentHistory];
            updatedHistory[index] = { ...updatedHistory[index], [field]: value };
            return { ...prev, employmentHistory: updatedHistory };
        });
    };

    const addEmploymentRow = () => {
        setForm((prev) => ({
            ...prev,
            employmentHistory: [
                ...prev.employmentHistory,
                { fromYear: "", toYear: "", company: "", designation: "" }
            ]
        }));
    };

    const removeEmploymentRow = (index) => {
        setForm((prev) => {
            const updatedHistory = prev.employmentHistory.filter((_, i) => i !== index);
            return { ...prev, employmentHistory: updatedHistory };
        });
    };

    // ---------------------------
    // HANDLE FILE SELECTION (Store for upload on submit)
    // ---------------------------
    const handleFileSelect = (file) => {
        if (!file) return;
        
        const totalDocs = (form.lifeHistoryDocuments?.length || 0) + (form.pendingUploadFiles?.length || 0);
        if (totalDocs >= 3) {
            setAlert({ type: "danger", message: "Maximum 3 documents allowed" });
            return;
        }
        
        setForm((prev) => ({
            ...prev,
            pendingUploadFiles: [...(prev.pendingUploadFiles || []), file]
        }));
    };

    // ---------------------------
    // HANDLE FILE REMOVE (Pending or Uploaded)
    // ---------------------------
    const handleFileRemove = async (idOrIndex, type) => {
        if (type === 'pending') {
            // Remove from pending list
            setForm((prev) => ({
                ...prev,
                pendingUploadFiles: prev.pendingUploadFiles.filter((_, i) => i !== idOrIndex)
            }));
        } else if (type === 'uploaded') {
            // Remove already uploaded document from server
            try {
                await removeLifeHistoryDocument(idOrIndex);
                setForm((prev) => ({
                    ...prev,
                    lifeHistoryDocuments: prev.lifeHistoryDocuments.filter(doc => doc._id !== idOrIndex)
                }));
                setAlert({ type: "success", message: "Document removed successfully" });
            } catch (error) {
                setAlert({ type: "danger", message: error.message || "Failed to remove document" });
            }
        }
    };

    // ---------------------------
    // HANDLE PROFILE IMAGE
    // ---------------------------
    const handleProfileImageChange = (file) => {
        setForm((prev) => ({
            ...prev,
            profileImage: file,
        }));
    };

    // ---------------------------
    // VALIDATION PER STEP
    // ---------------------------
    const validateStep = (currentStep) => {
        const newErrors = {};

        // PERSONAL INFO (Keep only absolute essentials required)
        if (currentStep === 1) {
            // if (!form?.profileImage) newErrors.profileImage = "Profile picture is required" // Optional
            if (!form.firstname) newErrors.firstname = "Required";
            if (!form.gender) newErrors.gender = "Required";
            if (!form.dob || form.dob === "") newErrors.dob = "Required";
            // if (!form.marital_status) newErrors.marital_status = "Required"; // Optional
        }

        // ADDRESS INFO
        if (currentStep === 2) {
            // Making all these optional as per user request
            // if (!form.whatsappNo) newErrors.whatsappNo = "Required";
            // if (!form.email) newErrors.email = "Required";
            // if (!form.address) newErrors.address = "Required";
            // if (!form.state) newErrors.state = "Required";
            // if (!form.country) newErrors.country = "Required";
            // if (!form.city) newErrors.city = "Required";
            // if (!form.postalCode) newErrors.postalCode = "Required";
        }

        // EDUCATION + EMPLOYMENT
        if (currentStep === 3) {
            // Already optional
        }

        // OTHERS
        if (currentStep === 4) {
            // Making optional
            // if (!form.foodPreference) newErrors.foodPreference = "Required";
            // if (!form.bloodGroup) newErrors.bloodGroup = "Required";
            // if (!form.religion) newErrors.religion = "Required";
            
            // Burial place is required if date of death is provided
            if (form.dateOfDeath && !form.burialPlace) {
                newErrors.burialPlace = "Burial place is required when date of death is provided";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    // STATE / CITY OPTIONS
    const states = indiaData.states.map((s) => s.state);
    const selectedStateObj = indiaData.states.find((s) => s.state === form.state);
    const cities = selectedStateObj ? selectedStateObj.cities : [];

    //   Handle submit form
    const submitProfileMutation = useMutation({
        mutationFn: submitProfile,
        onSuccess: async (data) => {
            console.log(data);
            // Refetch auth data to refresh user state
            await refetchAuth();
            setAlert({
                type: "success",
                message: data?.message || "Profile created successfully!",
            });
            // Redirect to home after successful profile creation
            setTimeout(() => {
                navigate("/");
            }, 1000);
        },
        onError: (error) => {
            setAlert({
                type: "danger",
                message: error?.message || "Something went wrong!, please retry.",
            });
            console.log(error);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        try {
            let res;
            if (userId) {
                res = await updateUserProfileById(userId, form);
            } else if (hasProfile) {
                res = await updateProfile(form);
            } else {
                res = await submitProfile(form);
            }

            setAlert({
                type: "success",
                message: res?.message || "Profile updated successfully!",
            });

            // Wait for refetch to complete so App.jsx gets the new isProfileCompleted flag
            const authRes = await refetchAuth();

            // After 1 second, navigate away. The authContext should be updated by now.
            setTimeout(() => {
                if (userId) {
                    navigate("/family-tree");
                } else if (authRes.data?.data?.user?.isSuperAdmin) {
                    navigate("/admin/user-ips");
                } else {
                    navigate("/");
                }
            }, 1000);
        } catch (error) {
            setAlert({
                type: "danger",
                message: error?.message || "Something went wrong!, please retry.",
            });
        }
    };

    return {
        step,
        form,
        errors,
        states,
        cities,
        handleChange,
        handleEducationChange,
        handleEmploymentChange,
        addEmploymentRow,
        removeEmploymentRow,
        handleFileSelect,
        handleFileRemove,
        handleProfileImageChange,
        nextStep,
        prevStep,
        handleSubmit,
        isPending: submitProfileMutation?.isPending,
        alert,
        setAlert,
        hasProfile,
        isProfileCompleted,
    };
};
