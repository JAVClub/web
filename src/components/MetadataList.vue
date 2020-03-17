<template>
    <div>
        <div class="title">
            <h1>Metadatas</h1>
            <p> {{pageStatus}}</p>
        </div>
        <div>
            <div v-if="items.length === 0" class="loading">
                <a-spin />
            </div>
            <waterfall :line-gap="370" :align="'center'" :watch="items">
                <waterfall-slot
                    v-for="item in items"
                    :key="item.id"
                    :height="450"
                    :width="370"
                >
                    <MetadataListVideoCard 
                    :data="item"
                    />
                </waterfall-slot>
            </waterfall>
            <Pagination v-if="paginationReload" @pageChange="pageChange" :page="page" :pageSize="pageSize" :total="total" />
        </div>
    </div>
</template>

<script>
    import Pagination from './common/Pagination'
    import MetadataListVideoCard from './MetadataListVideoCard'
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

    export default {
        components: {
            Pagination,
            MetadataListVideoCard,
            Waterfall,
            WaterfallSlot
        },
        
        data: function() {
            return {
                items: [],
                page: 1,
                pageSize: 20,
                total: 50,
                type: 'default',
                metaId: null,
                metaName: '',
                routerParams: {
                    page: 1
                },
                paginationReload: true
            }
        },

        computed: {
            pageStatus: function() {
                return ` ${(this.type !== 'default') ? `Param: ${this.type[0].toUpperCase() + this.type.substring(1)}:${this.metaName} ` : ''}Page ${this.page}`
            }
        },

        methods: {
            pageChange: function(data) {
                this.page = data.page
                this.pageSize = data.pageSize
                this.$router.push(`/metadata/list/${this.page}${(this.routerParams.type) ? `/${this.routerParams.type}/${this.routerParams.metaId}` : ''}`)
                this.requestNew()
            },

            requestNew: function() {
                if (this.routerParams.type) {
                    this.type = this.routerParams.type
                    this.metaId = parseInt(this.routerParams.metaId)
                    this.metaName = this.routerParams.type
                } else {
                    this.type = 'default'
                    this.metaId = null
                    this.metaName = ''
                }

                this.page = this.routerParams.page ? parseInt(this.routerParams.page) : 1
                this.paginationReload = false
                this.$nextTick(() => {
                    this.paginationReload = true
                });
                

                this.items = []
                let apiUri = ''
                switch (this.type) {
                    case 'tag':
                    case 'star':
                    case 'series':
                        apiUri = `/api/metadata/getListByMeta/${this.type}/${this.metaId}/${this.page}/${this.pageSize}`
                        break
                    default:
                        apiUri = `/api/metadata/getList/${this.page}/${this.pageSize}`
                }

                this.axios.get(apiUri).then((res) => {
                    res = res.data
                    this.total = res.data.total
                    this.items = res.data.data
                    if (res.data.metaInfo) this.metaName = res.data.metaInfo.name
                    document.getElementsByTagName('h1')[0].scrollIntoView()
                })
            }
        },

        created: function() {
            document.title = 'Metadata List | JAVClub'
            this.routerParams = this.$route.params
            this.requestNew()
        },

        beforeRouteUpdate: function(to, from, next) {
            this.routerParams = to.params
            if (to.params.type !== from.params.type ||
            to.params.metaId !== from.params.metaId) this.routerParams.page = 1
            this.requestNew()
            next()
        }
    }
</script>

<style scoped>
    .loading {
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        margin-bottom: 20px;
        padding: 30px 50px;
        margin: 20px 0;
    }

    .title > h1, .title > p {
        display: inline;
    }
</style>