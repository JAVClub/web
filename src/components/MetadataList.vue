<template>
    <div>
        <div class="title">
            <h1>Metadatas</h1>
            <p> {{pageStatus}}</p>
        </div>
        <div>
            <a-input-search placeholder="Search title/JAVID(split by space)" style="width: 300px" :defaultValue="searchStr" @search="onSearch" />
        </div>
        <div>
            <div v-if="loading" class="loading">
                <a-spin />
            </div>
            <br v-else>
            <div v-if="!loading && items.length === 0">
                <a-empty />
            </div>
            <waterfall :line-gap="313" :align="'center'" :watch="items">
                <waterfall-slot
                    v-for="item in items"
                    :key="item.id"
                    :height="405"
                    :width="300"
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
                pageSize: 21,
                total: 50,
                type: 'default',
                metaId: null,
                metaName: '',
                routerParams: {
                    page: 1
                },
                paginationReload: true,
                loading: false
            }
        },

        computed: {
            pageStatus: function() {
                let status = ' '
                if (this.type === 'search') {
                    status += `Search: ${this.metaId}`
                } else if (this.type !== 'default') {
                    status += `Param: ${this.type[0].toUpperCase() + this.type.substring(1)}:${this.metaName}`
                }

                return status + ` Page ${this.page}`
            },

            searchStr: function() {
                if (this.type !== 'search') return ''
                    
                return this.metaId
            }
        },

        methods: {
            pageChange: function(data) {
                this.page = data.page
                this.pageSize = data.pageSize
                this.$router.push(`/metadata/list/${this.page}${(this.routerParams.type) ? `/${this.routerParams.type}/${this.routerParams.metaId}` : ''}`)
                this.requestNew()
            },

            onSearch: function(str) {
                if (str) {
                    this.$router.push(`/metadata/list/1/search/${str}`)
                    return
                } else {
                    this.$router.push(`/metadata/list/1`)
                }
            },

            getApiUrl: function() {
                let apiUri = ''
                switch (this.type) {
                    case 'tag':
                    case 'star':
                    case 'series':
                        apiUri = `/metadata/getListByMeta/${this.type}/${this.metaId}/${this.page}/${this.pageSize}`
                        break
                    case 'search':
                        apiUri = `/metadata/search/${this.metaId}/${this.page}/${this.pageSize}`
                        break
                    default:
                        apiUri = `/metadata/getList/${this.page}/${this.pageSize}`
                }

                return apiUri
            },

            requestNew: function() {
                this.loading = true
                if (this.routerParams.type) {
                    this.type = this.routerParams.type
                    this.metaId = this.routerParams.metaId
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
                const apiUri = this.getApiUrl()

                this.axios.get(this.apiHost + apiUri).then((res) => {
                    res = res.data
                    this.total = res.data.total
                    this.items = res.data.data
                    if (res.data.metaInfo) this.metaName = res.data.metaInfo.name
                    document.getElementsByTagName('h1')[0].scrollIntoView()
                    this.loading = false
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