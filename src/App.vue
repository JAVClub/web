<template>
    <a-layout id="components-layout-top" class="layout">
        <a-layout-header>
        <a-menu
        theme="dark"
        mode="horizontal"
        :defaultSelectedKeys="[routeName]"
        :style="{ lineHeight: '64px' }"
        >
        <template v-if="isLogin">
            <a-menu-item key="homepage">
                <a-icon type="home" />
                <span>Homepage</span>
                <router-link :to="{ name: 'homepage' }" />
            </a-menu-item>
            <a-menu-item key="metadataList">
                <a-icon type="bars" />
                <span>Metadatas</span>
                <router-link :to="{ name: 'metadataList' }" />
            </a-menu-item>
            <a-menu-item key="bookmarkList">
                <a-icon type="folder" />
                <span>Bookmarks</span>
                <router-link :to="{ name: 'bookmarkList' }" />
            </a-menu-item>
            <a-menu-item key="tagList">
                <a-icon type="tags" />
                <span>Tags</span>
                <router-link :to="{ name: 'tagList' }" />
            </a-menu-item>
            <a-menu-item key="starList">
                <a-icon type="star" />
                <span>Stars</span>
                <router-link :to="{ name: 'starList' }" />
            </a-menu-item>
            <a-menu-item key="seriesList">
                <a-icon type="number" />
                <span>Series</span>
                <router-link :to="{ name: 'seriesList' }" />
            </a-menu-item>
            <a-menu-item key="profile">
                <a-icon type="user" />
                <span>Profile</span>
                <router-link :to="{ name: 'profile' }" />
            </a-menu-item>
            <a-menu-item key="logout" v-on:click="logout">
                <a-icon type="logout" />
                <span>Logout</span>
            </a-menu-item>
        </template>
        <template v-else>
            <a-menu-item key="login">
                <a-icon type="login" />
                <span>Login</span>
            </a-menu-item>
        </template>
        </a-menu>
        </a-layout-header>

        <a-layout-content style="padding: 0 25px; align-items: center; text-align: center;">
            <div :style="{ background: '#fff', padding: '24px' }">
                <router-view></router-view>
            </div>
        </a-layout-content>
    </a-layout>
</template>
<script>
    export default {
        data: function() {
            return {
                collapsed: false,
                isLogin: true
            };
        },

        computed: {
            routeName: function() {
                return this.$route.name || 'homepage'
            }
        },

        methods: {
            logout: function() {
                this.axios.get(this.apiHost + '/auth/logout')
                this.isLogin = false
                window.location.reload()
            }
        },

        created: function() {
            this.axios.get(this.apiHost + '/auth/check').then((res) => {
                res = res.data

                this.isLogin = res.data.isLogin
                if (!this.isLogin) {
                    if (this.$route.name !== 'login') {
                        this.$router.push({ name: 'login' })
                        window.location.reload()
                    }
                    return
                }

                if (!this.$route.name) {
                    this.$router.push({ name: 'homepage' })
                    return
                }
            })
        }
    };
</script>
<style>

</style>