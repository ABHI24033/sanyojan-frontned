import NoticeDetails from "../../components/notice-board/NoticeDetails";
import MasterLayout from "../../masterLayout/MasterLayout";
import { useNoticeById } from "../../hooks/useNoticeById";
import { useParams } from "react-router-dom";

const NoticeDetailsPage = () => {
    const { id } = useParams();
    const { data, isLoading } = useNoticeById(id);
    return (
        <div>
            <MasterLayout>
                <NoticeDetails notice={data?.notice} isLoading={isLoading} />
            </MasterLayout>
        </div>
    );
};

export default NoticeDetailsPage;
