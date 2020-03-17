<template>
    <div>
        <h1>Bookmark: {{name}}</h1>
         <a-empty v-if="items.length === 0" />
        <waterfall :line-gap="370" :align="'center'" :watch="items">
            <waterfall-slot
            v-for="item in items"
            :key="item.id"
            :height="480"
            :width="370"
            >
            <BookmarkInfoVideoCard :data="item" v-on:metadataDelete="deleteMetadata" />
            </waterfall-slot>
        </waterfall>
        <Pagination @pageChange="pageChange" :page="page" :pageSize="pageSize" :total="total" />
    </div>
</template>

<script>
    import Pagination from './common/Pagination'
    import BookmarkInfoVideoCard from './BookmarkInfoVideoCard'
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

    export default {
        components: {
            Pagination,
            BookmarkInfoVideoCard,
            Waterfall,
            WaterfallSlot
        },

        data: function() {
            return {
                items: [],
                page: 1,
                pageSize: 20,
                total: 100,
                bookmarkId: 0,
                name: ''
            }
        },

        methods: {
            requestNew: function() {
                this.axios.get(`/api/bookmark/getInfo/${this.bookmarkId}/${this.page}/${this.pageSize}`).then((res) => {
                    res = res.data
                    this.total = res.data.total
                    this.items = res.data.metadatas
                    this.name = res.data.name
                    document.getElementsByTagName('h1')[0].scrollIntoView()
                })
            },

            pageChange: function(data) {
                this.page = data.page
                this.pageSize = data.pageSize
                this.$router.push(`/bookmark/list/${this.bookmarkId}/${this.page}`)
                this.requestNew()
            },

            deleteMetadata: function(id) {
                this.$confirm({
                    title: 'Are you sure delete this metadata?',
                    content: 'This operation is irreversible',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        this.axios.post(`/api/bookmark/removeMetadata/${this.bookmarkId}`, {
                            metadataId: id
                        }).then((res) => {
                            res = res.data
                            this.requestNew()
                            if (res.code === 0) {
                                this.$message.success('Success')
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    },
                    onCancel: () => {}
                })
            }
        },

        created: function() {
            document.title = 'Bookmark Info | JAVClub'
            this.page = (this.$route.params.page) ? parseInt(this.$route.params.page) : 1
            this.bookmarkId = this.$route.params.id
            this.requestNew()
        }
    }
</script>