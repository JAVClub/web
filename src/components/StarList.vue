<template>
    <div>
        <h1>Stars</h1>
        <div v-if="items.length === 0">
            <a-empty />
        </div>
        <waterfall :line-gap="130" :align="'center'" :watch="items">
            <waterfall-slot
            v-for="item in items"
            :key="item.id"
            :height="200"
            :width="130"
            >
                <a-card hoverable style="width: 120px">
                <img
                alt="cover"
                :src="item.photoURL"
                slot="cover"
                style="width: 120px"
                />
                <a :href="`/#/metadata/list/1/star/${item.id}`"><a-card-meta :title="item.name"></a-card-meta></a>
            </a-card>
            </waterfall-slot>
        </waterfall>
        <Pagination @pageChange="pageChange" :page="page" :pageSize="pageSize" :total="total" />
    </div>
</template>

<script>
    import Pagination from './common/Pagination'
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

    export default {
        components: {
            Pagination,
            Waterfall,
            WaterfallSlot
        },

        data: function() {
            return {
                items: [],
                page: 1,
                pageSize: 50,
                total: 100
            }
        },

        methods: {
            requestNew: function() {
                this.axios.get(this.apiHost + `/metadata/getMetaList/star/${this.page}/${this.pageSize}`).then((res) => {
                    res = res.data
                    this.total = res.data.total
                    this.items = res.data.data
                    document.getElementsByTagName('h1')[0].scrollIntoView()
                })
            },

            pageChange: function(data) {
                this.page = data.page
                this.pageSize = data.pageSize
                this.$router.push(`/star/list/${this.page}`)
                this.requestNew()
            },
        },

        created: function() {
            document.title = 'Stars List | JAVClub'
            this.page = (this.$route.params.page) ? parseInt(this.$route.params.page) : 1
            this.requestNew()
        }
    }
</script>