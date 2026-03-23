import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import NoticeTable from "../../components/notice-board/NoticeTable";
import { useNoticeList } from "../../hooks/useNoticeList";
import MasterLayout from "../../masterLayout/MasterLayout";
import AlertBox from "../../components/ui/Alert";

export default function AdminNoticePage() {
    const {
        noticesQuery,
        page,
        setPage,
        search,
        setSearch,
        category,
        setCategory,
        sort,
        setSort,
        deleteMutation,
        updateMutation,
        openEditModal,
        pinMutation,
        closeEditModal,
        editModal,
        alert,
        setAlert
    } = useNoticeList("admin");

    const notices = noticesQuery.data?.notices || [];
    const data = noticesQuery?.data;

    if (noticesQuery?.isPending) {
        return <p>Loading...</p>
    }

    return (
        <>
            <MasterLayout>
                <div>
                    <NoticeTable
                        notices={notices}
                        onDelete={deleteMutation.mutate}
                        onEdit={updateMutation.mutate}
                        onTogglePin={pinMutation.mutate}
                        openEditModal={openEditModal}
                        closeEditModal={closeEditModal}
                        editModal={editModal}
                    />
                </div>
                <div className=" mt-5">
                    <Pagination
                        page={page}
                        setPage={setPage}
                        totalPages={data?.totalPages}
                    />
                </div>
            </MasterLayout>
            <AlertBox
                alert={alert}
                setAlert={setAlert}
            />
        </>
    );
}
