<template>
    <div>
        <h1>Admin</h1>
        <AdminUser></AdminUser>
        <a-divider dashed />
        <AdminGroup></AdminGroup>
    </div>
</template>

<script>
import AdminUser from './AdminUser'
import AdminGroup from './AdminGroup'

export default {
  components: {
    AdminUser,
    AdminGroup
  },
  created: () => {
      document.title = 'Admin | JAVClub'
  }
}
</script>
