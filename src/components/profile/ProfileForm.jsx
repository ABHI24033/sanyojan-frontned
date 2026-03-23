import { useSearchParams, useLocation } from "react-router-dom";
import Stepper from "./Stepper";
import PersonalInfo from "./steps/PersonalInfo";
import AddressInfo from "./steps/AddressInfo";
import OthersInfo from "./steps/OthersInfo";
import EducationInfo from "./steps/EducationInfo";
import { useProfileForm } from "../../hooks/useProfileForm";
import AlertBox from "../ui/Alert";

const ProfileForm = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const userId = searchParams.get("userId");
  const {
    step,
    form,
    errors,
    states,
    cities,
    handleChange,
    handleProfileImageChange,
    handleFileSelect,
    handleFileRemove,
    nextStep,
    prevStep,
    handleSubmit,
    isPending,
    alert,
    setAlert,
    handleEducationChange,
    handleEmploymentChange,
    addEmploymentRow,
    removeEmploymentRow,
    hasProfile,
  } = useProfileForm();

  const isUpdateMode = !!userId || location.pathname === "/update-profile" || hasProfile;

  return (
    <div
      className="my-5"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#f8f9fa",
      }}
    >
      <AlertBox alert={alert} setAlert={setAlert} />
      <div className="w-75 h-100">
        <div className="">
          <div className="d-flex flex-column w-100 justify-content-center align-items-center text-center">
            <img
              src="/assets/images/auth/logo.png"
              className="my-4"
              alt="Logo"
              style={{ width: "200px", height: "auto" }}
            />

            <h6 className="fw-semibold mt-3">
              {isUpdateMode ? "Update your profile" : "Complete your Sanyojan profile"}
            </h6>

            <p className="text-neutral-500 mb-4">
              Fill up your details and proceed to the next steps.
            </p>
          </div>

          {/* Stepper */}
          <Stepper currentStep={step} />

          {/* FORM */}
          <form>
            {/* STEP 1 */}
            {step === 1 && (
              <PersonalInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleFileUpload={handleProfileImageChange}
              />
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <AddressInfo
                form={form}
                errors={errors}
                states={states}
                cities={cities}
                handleChange={handleChange}
              />
            )}


            {/* STEP 3 */}
            {step === 3 && (
              <EducationInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleEducationChange={handleEducationChange}
                handleEmploymentChange={handleEmploymentChange}
                addEmploymentRow={addEmploymentRow}
                removeEmploymentRow={removeEmploymentRow}
              />
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <OthersInfo
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleFileSelect={handleFileSelect}
                handleFileRemove={handleFileRemove}
              />
            )}

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                gap: "30px",
                marginTop: "30px",
              }}
            >
              {/* PREVIOUS BUTTON */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </button>

              {/* NEXT / SUBMIT BUTTON */}
              {step < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="btn btn-primary"
                >
                  {isPending ? "Submitting" : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
