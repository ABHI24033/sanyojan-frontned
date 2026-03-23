import Breadcrumb from "../../components/common/Breadcrumb";
import DashBoardLayer from "../../components/dashboard/Dashboard";
import MasterLayout from "../../masterLayout/MasterLayout";

const HomePage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title='Home' />
        <DashBoardLayer />
      </MasterLayout>
    </>
  );
};

export default HomePage;
