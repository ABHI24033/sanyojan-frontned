import { useQuery } from "@tanstack/react-query";
import { getNoticeByIdApi } from "../api/notice";

export const useNoticeById = (noticeId) => {
    return useQuery({
        queryKey: ["notice", noticeId],
        queryFn: () => getNoticeByIdApi(noticeId),
        enabled: !!noticeId, // prevents running until an ID exists
    });
};
