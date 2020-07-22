<template>
    <div>
        <h1>Admin</h1>
        <AdminUser></AdminUser>
        <a-divider dashed />
        <AdminGroup></AdminGroup>
        <a-divider dashed />
        <AdminAnnouncement></AdminAnnouncement>
    </div>
</template>

<script>
import AdminUser from './AdminUser'
import AdminGroup from './AdminGroup'
import AdminAnnouncement from './AdminAnnouncement'

export default {
  components: {
    AdminUser,
    AdminGroup,
    AdminAnnouncement
  },
  created: () => {
      document.title = 'Admin | JAVClub'
  }
}
</script>
