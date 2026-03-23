import React from 'react'
import NoticeList from '../../components/notice-board/NoticeList'
import MasterLayout from '../../masterLayout/MasterLayout'

const NoticeBoardListPage = () => {
    return (
        <div>
            <MasterLayout>
                <NoticeList />
            </MasterLayout>
        </div>
    )
}

export default NoticeBoardListPage