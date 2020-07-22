<template>
    <div>
        <h1>Sign Up</h1>

        <div style="max-width: 350px; display: inline-block;">
            <a-input v-model="username" placeholder="Username" />
            <br /><br />
            <a-input v-model="password" type="password" placeholder="Password" @keyup.enter="handleSubmit" />
            <br /><br />
            <a-input v-model="code" placeholder="Invitation Code" />
            <br /><br />
            <a-button v-on:click="handleSubmit" type="primary">Sign up</a-button>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => {
            return {
                username: '',
                password: '',
                code: ''
            }
        },

        methods: {
            handleSubmit: function() {
                this.axios.post(this.apiHost + '/auth/signup', {
                    username: this.username,
                    password: this.password,
                    code: this.code
                }).then((res) => {
                    res = res.data

                    if (res.code === 0) {
                        this.$message.success('Success')
                        this.$router.push({ name: 'login' })
                        return
                    }

                    this.$message.error(res.msg)
                })
            }
        },

        created: () => {
            document.title = 'Sign Up | JAVClub'
        }
    }
</script>