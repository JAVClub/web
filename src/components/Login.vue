<template>
    <div>
        <h1>Login</h1>

        <div style="max-width: 350px; display: inline-block;">
            <a-input v-model="username" placeholder="Username" />
            <br /><br />
            <a-input v-model="password" type="password" placeholder="Password" @keyup.enter="handleSubmit" />
            <br /><br />
            <a-button v-on:click="handleSubmit" type="primary">Login</a-button>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => {
            return {
                username: '',
                password: ''
            }
        },

        methods: {
            handleSubmit: function() {
                this.axios.post(this.apiHost + '/auth/login', {
                    username: this.username,
                    password: this.password
                }).then((res) => {
                    res = res.data

                    if (res.code === 0) {
                        this.$message.success('Success')
                        this.$router.push({ name: 'homepage' })
                        window.location.reload()
                        return
                    }

                    this.$message.error(res.msg)
                })
            }
        },

        created: () => {
            document.title = 'Login | JAVClub'
        }
    }
</script>