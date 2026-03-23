import AlertBox from "../../ui/Alert";
import { useEditProfile } from "../../../hooks/useEditProfile";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInfoTab from "./PersonalInfoTab";
import AddressCommunicationTab from "./AddressCommunicationTab";
import EducationOccupationTab from "./EducationOccupationTab";
import OthersTab from "./OthersTab";

import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ViewProfileLayer = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Authorization Check
  // 1. If no userId in URL -> Editing own profile -> Always allowed
  // 2. If userId present -> Allowed if:
  //    a. It's me (currentUser._id or currentUser.id matches userId)
  //    b. I am an admin (role 'admin' or isSuperAdmin)
  const isSelf = !userId || (currentUser?._id === userId) || (currentUser?.id === userId);
  const isAdmin = currentUser?.isAdmin || currentUser?.isSuperAdmin;

  const isAuthorized = isSelf || isAdmin;

  console.log("DEBUG: Auth Check", { userId, currentUserId: currentUser?._id, isSelf, isAdmin, isAuthorized });

  const {
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
    states,
    cities,
    isPending,
  } = useEditProfile(userId);

  if (!isAuthorized) {
    return (
      <div className="container p-5 text-center">
        <h3 className="text-danger">Access Denied</h3>
        <p>You do not have permission to edit this profile.</p>
      </div>
    );
  }

  return (
    <>
      <AlertBox alert={alert} setAlert={setAlert} />
      <div className='row gy-4'>
        <div className='col-lg-4'>
          <ProfileSidebar formData={formData} />
        </div>
        <div className='col-lg-8'>
          <div className='card h-100'>
            <div className='card-body p-24'>
              <ul
                className='nav border-gradient-tab nav-pills mb-20 d-inline-flex'
                id='pills-tab'
                role='tablist'
              >
                <li className='nav-item' role='presentation'>
                  <button
                    className='nav-link d-flex align-items-center px-24 active'
                    id='pills-edit-profile-tab'
                    data-bs-toggle='pill'
                    data-bs-target='#pills-edit-personal-info'
                    type='button'
                    role='tab'
                    aria-controls='pills-edit-profile'
                    aria-selected='true'
                  >
                    Edit Profile
                  </button>
                </li>
                <li className='nav-item' role='presentation'>
                  <button
                    className='nav-link d-flex align-items-center px-24'
                    id='pills-address-communication-tab'
                    data-bs-toggle='pill'
                    data-bs-target='#pills-address-communication'
                    type='button'
                    role='tab'
                    aria-controls='pills-change-passwork'
                    aria-selected='false'
                    tabIndex={-1}
                  >
                    Edit Address & Communication
                  </button>
                </li>
                <li className='nav-item' role='presentation'>
                  <button
                    className='nav-link d-flex align-items-center px-24'
                    id='pills-education-occupation-tab'
                    data-bs-toggle='pill'
                    data-bs-target='#pills-education-occupation'
                    type='button'
                    role='tab'
                    aria-controls='pills-notification'
                    aria-selected='false'
                    tabIndex={-1}
                  >
                    Education & Occupation
                  </button>
                </li>
                <li className='nav-item' role='presentation'>
                  <button
                    className='nav-link d-flex align-items-center px-24'
                    id='pills-others-tab'
                    data-bs-toggle='pill'
                    data-bs-target='#pills-others'
                    type='button'
                    role='tab'
                    aria-controls='pills-notification'
                    aria-selected='false'
                    tabIndex={-1}
                  >
                    Others
                  </button>
                </li>
              </ul>
              <div className='tab-content' id='pills-tabContent'>
                <PersonalInfoTab
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleFileUpload={handleFileUpload}
                  imagePreview={imagePreview}
                  handleSubmit={handleSubmit}
                  isPending={isPending}
                />

                <AddressCommunicationTab
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  states={states}
                  cities={cities}
                  handleSubmit={handleSubmit}
                  isPending={isPending}
                />

                <EducationOccupationTab
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleEducationChange={handleEducationChange}
                  handleEmploymentChange={handleEmploymentChange}
                  addEmploymentRow={addEmploymentRow}
                  removeEmploymentRow={removeEmploymentRow}
                  handleSubmit={handleSubmit}
                  isPending={isPending}
                />

                <OthersTab
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isPending={isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProfileLayer;
