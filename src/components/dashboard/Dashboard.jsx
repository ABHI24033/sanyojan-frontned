import SalesStatisticOne from "../common/SalesStatisticOne";
import UnitCountOne from "../common/UnitCountOne";

const DashBoardLayer = () => {
  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />

      <section className='row gy-4 mt-1'>
        {/* SalesStatisticOne */}
        <SalesStatisticOne />

      </section>
    </>
  );
};

export default DashBoardLayer;
