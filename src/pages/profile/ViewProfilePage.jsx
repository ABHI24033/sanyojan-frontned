import { Icon } from "@iconify/react/dist/iconify.js";
import Breadcrumb from "../../components/common/Breadcrumb";
import ViewProfileLayer from "../../components/profile/view/ViewProfileLayer";
import MasterLayout from "../../masterLayout/MasterLayout";
import { useNavigate } from "react-router-dom";

const ViewProfilePage = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        <button className="btn btn-link d-flex align-items-center text-decoration-none ps-0 text-muted fw-medium inner-shadow-sm" onClick={() => navigate(-1)}>
          <Icon icon="mdi:arrow-left" className="me-2" width="28" height="28" /> Back
        </button>
        {/* Breadcrumb */}
        <Breadcrumb title='Edit Profile' />

        {/* ViewProfileLayer */}
        <ViewProfileLayer />
      </MasterLayout>
    </>
  );
};

export default ViewProfilePage;
