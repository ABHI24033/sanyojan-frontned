import React from 'react'
import MasterLayout from '../../masterLayout/MasterLayout'
import UserProfile from '../../components/feed/UserProfile'
import Breadcrumb from '../../components/common/Breadcrumb'

const UserProfilePage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb title='View Profile' />
        <UserProfile />
      </MasterLayout>
    </div>
  )
}

export default UserProfilePage