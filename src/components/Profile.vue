<template>
    <div>
        <h1>Profile</h1>
        <div class="inline">
            <p>Change your username</p>
            <a-input-search
            v-model="newUsername"
            placeholder="New username"
            @search="changeUsername"
            enterButton="Change"
            />
        </div>
        <a-divider dashed />
        <div class="inline">
            <p>Change your password</p>
            <a-input-search
            v-model="newPassword"
            placeholder="New password"
            @search="changePassword"
            enterButton="Change"
            />
        </div>
        <a-divider />
        <ProfileInvitation></ProfileInvitation>
    </div>
</template>

<script>
import ProfileInvitation from './ProfileInvitation'
export default {
    components: {
        ProfileInvitation
    },
    data: () => {
        return {
            newUsername: '',
            newPassword: ''
        }
    },

    methods: {
        changeUsername: function() {
            if (!this.newUsername) {
                this.$message.error('Please enter your new username')
                return
            }
            
            this.axios.post(this.apiHost + '/user/changeUsername', {
                newUsername: this.newUsername
            }).then((res) => {
                res = res.data

                if (res.code === 0) {
                    this.$message.success('Success')
                    return
                }

                this.$message.error(res.msg)
            })
        },

        changePassword: function() {
            if (!this.newPassword) {
                this.$message.error('Please enter your new password')
                return
            }

            this.axios.post(this.apiHost + '/user/changePassword', {
                newPassword: this.newPassword
            }).then((res) => {
                res = res.data

                if (res.code === 0) {
                    this.$message.success('Success')
                    this.axios.get(this.apiHost + '/auth/logout')
                    window.location.reload()
                    return
                }

                this.$message.error(res.msg)
            })
        }
    },

    created: () => {
        document.title = 'Profile | JAVClub'
    }
}
</script>

<style scoped>
    .inline {
        display: inline-block;
    }
</style>