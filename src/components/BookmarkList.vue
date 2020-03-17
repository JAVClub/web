<template>
    <div>
        <div style="display: inline-table;">
            <h1>Bookmarks</h1>
            <a-input-search
            style="width: 300px;"
            placeholder="Bookmark name here"
            @search="createBookmark"
            enterButton="Create"
            />
        </div>
        <br /><br />
        <waterfall :line-gap="320" :align="'center'" :watch="items">
            <waterfall-slot
            v-for="item in items"
            :key="item.id"
            :height="140"
            :width="320"
            >
            <a-card hoverable style="width: 300px">
                <template class="ant-card-actions" slot="actions">
                    <a-icon type="delete" key="delete" v-on:click="deleteBookmark(item.id)" />
                </template>
                <a :href="`/#/bookmark/list/${item.id}`"><a-card-meta :title="item.name"></a-card-meta></a>
            </a-card>
            </waterfall-slot>
        </waterfall>
    </div>
</template>

<script>
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

    export default {
        components: {
            Waterfall,
            WaterfallSlot
        },

        data: function() {
            return {
                items: [],
            }
        },

        methods: {
            requestNew: function() {
                this.axios.get('/api/bookmark/getList').then((res) => {
                    res = res.data
                    this.items = res.data
                    document.getElementsByTagName('h1')[0].scrollIntoView()
                })
            },

            createBookmark: function(name) {
                if (name.length < 1) {
                    this.$message.error('Name cant be empty!')
                    return
                } else {
                    this.axios.post(`/api/bookmark/createBookmark`, {
                        name: name
                    }).then((res) => {
                        res = res.data
                        this.requestNew()
                        if (res.code === 0) {
                            this.$message.success('Created!')
                        } else {
                            this.$message.error('Error!')
                        }
                    })
                }
            },

            deleteBookmark: function(bookmarkId) {
                this.$confirm({
                    title: 'Are you sure delete this bookmark?',
                    content: 'This operation is irreversible',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        this.axios.post(`/api/bookmark/removeBookmark`, {
                            bookmarkId: bookmarkId
                        }).then((res) => {
                            res = res.data
                            this.requestNew()
                            if (res.code === 0) {
                                this.$message.success('Removed!')
                            } else {
                                this.$message.error('Error!')
                            }
                        })
                    },
                    onCancel: () => {}
                })
            }
        },

        created: function() {
            document.title = 'Bookmark List | JAVClub'
            this.requestNew()
        }
    }
</script>