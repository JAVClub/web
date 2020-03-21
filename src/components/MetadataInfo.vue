<template>
    <div>
        <h1>{{title}}</h1>
        
        <a-row>
            <a-col :span="13">
                <div style="max-height: 330px; overflow-y: scroll;">
                    <MetadataInfoVideoInfo
                    :JAVID="JAVID"
                    :releaseDate="releaseDate"
                    :tags="tags"
                    :stars="stars"
                    :series="series"
                    v-on:addToBookmark="addToBookmark"
                    ></MetadataInfoVideoInfo>
                </div>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="10">
                <div style="overflow-x: scroll">
                    <img alt="cover" style="width: auto; max-height: 330px;" :src="cover">
                </div>
            </a-col>
        </a-row>

        <a-modal title="Add to bookmark" v-model="addToBookmarkModal" @ok="addToBookmark(true)">
            <div v-if="bookmarks.length === 0">
                <a-alert type="error" message="You don't have a folder yet, please create one first" banner />
                <br />
            </div>
            <p>Select your bookmark:</p>
            <a-select style="width: 120px" v-on:select="bookmarkSelected">
                <a-select-option v-for="value in bookmarks" :key="value.id" :value="value.id">{{value.name}}</a-select-option>
            </a-select>
        </a-modal>

        <a-divider />

        <div v-if="playerShow">
            <d-player :options="playerOptions"></d-player>
        </div>

        <a-divider />

        <div style="overflow-x: scroll">
            <MetadataInfoVideoList :text="'Video sources'" :data="videos"></MetadataInfoVideoList>
        </div>

        <a-divider />

        <waterfall :line-gap="250" :align="'center'" v-if="fileURLLoadStatus">
            <waterfall-slot
            v-for="(item, fileId) in fileURLs"
            :key="fileId"
            :height="150"
            :width="250"
            >
                <img style="width: 240px" :src="item" alt="screenshoot">
            </waterfall-slot>
        </waterfall>
    </div>
</template>

<script>
    import MetadataInfoVideoList from './MetadataInfoVideoList'
    import MetadataInfoVideoInfo from './MetadataInfoVideoInfo'
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
    import VueDPlayer from 'vue-dplayer'
    import 'vue-dplayer/dist/vue-dplayer.css'
    import _ from 'loadsh'

    export default {
        components: {
            MetadataInfoVideoList,
            MetadataInfoVideoInfo,
            Waterfall,
            WaterfallSlot,
            'd-player': VueDPlayer
        },

        data: function() {
            return {
                title: '',
                JAVID: '',
                cover: '',
                releaseDate: '',
                tags: [],
                stars: [],
                series: '',
                videos: [],
                fileURLs: {},
                fileURLLoadStatus: false,
                playerShow: false,
                playerOptions: {},
                addToBookmarkModal: false,
                bookmarks: {},
                selectBookmark: 0
            }
        },

        methods: {
            bookmarkSelected: function(id) {
                this.selectBookmark = parseInt(id)
            },

            addToBookmark: function(check = false) {
                if (!check) {
                    this.axios.get(this.apiHost + `/bookmark/getList`).then((res) => {
                        res = res.data.data
                        this.bookmarks = res
                        this.addToBookmarkModal = true
                    })
                    return
                }

                if (this.selectBookmark === 0) {
                    this.$message.error('Bookmark not selected')
                    return
                }

                this.axios.post(this.apiHost + `/bookmark/addMetadata/${this.selectBookmark}`, {
                    metadataId: this.$route.params.id
                }).then((res) => {
                    res = res.data
                    if (res.code === 0) {
                        this.$message.success('Success')
                    } else {
                        this.$message.error(res.msg)
                    }
                    this.addToBookmarkModal = false
                })
            }
        },

        created: function() {
            document.title = 'Metadata Info | JAVClub'

            this.axios.get(this.apiHost + `/metadata/getInfo/${this.$route.params.id}`).then((res) => {
                res = res.data.data
                this.videoId = res.id
                this.title = res.title
                this.JAVID = res.JAVID
                this.releaseDate = res.releaseDate
                this.cover = res.posterFileURL
                this.tags = res.tags
                this.stars = res.stars
                this.series = res.series
            })

            this.axios.get(this.apiHost + `/video/getList/${this.$route.params.id}`).then((res) => {
                res = res.data.data

                let processed = []

                for (let i in res) {
                    let item = res[i]
                    processed.push({
                        id: item.id,
                        metadataId: item.metadataId,
                        videoFileId: item.videoFileId,
                        episode: item.videoMetadata.episode,
                        storyboardFileIdSet: item.storyboardFileIdSet,
                        bitRate: item.videoMetadata.metadata.video.bitRate,
                        duration: item.videoMetadata.metadata.video.duration,
                        updateTime: (new Date(parseInt(item.updateTime))).toUTCString()
                    })
                }

                processed = _.orderBy(processed, ['episode'], ['asc'])

                this.videos = processed

                let fileIds = []
                for (let i in this.videos[0].storyboardFileIdSet) {
                    fileIds.push(this.videos[0].storyboardFileIdSet[i])
                    this.fileURLs[this.videos[0].storyboardFileIdSet[i]] = ''
                }

                this.axios.get(this.apiHost + `/file/getURL/${fileIds.join(',')}`).then((res) => {
                    let result = res.data.data
                    for (let i in result) {
                        let url = result[i]
                        this.fileURLs[i] = url
                    }

                    let retryTimes = {}

                    setTimeout(() => {
                        this.fileURLLoadStatus = true

                        const trackError = (img) => {
                            if (!img.addEventListener) return
                            img.addEventListener('error', (event) => {
                                if (retryTimes[event.target.src] || retryTimes[event.target.src] > 10) img.removeEventListener('error', trackError)
                                retryTimes[event.target.src] = retryTimes[event.target.src] || 0
                                retryTimes[event.target.src] += 1
                            })
                        }

                        setTimeout(() => {
                            let imgs = document.getElementsByTagName('img')
                            for (let i in imgs) {
                                let img = imgs[i]
                                trackError(img)
                            }
                        }, 50)
                    }, 200)

                    let videoIds = []
                    let videoMap = {}
                    for (let i in this.videos) {
                        let video = this.videos[i]
                        videoIds.push(video.videoFileId)
                        videoMap[video.videoFileId] = video
                    }

                    this.axios.get(this.apiHost + `/file/getURL/${videoIds.join(',')}`).then((res) => {
                        res = res.data.data

                        this.playerOptions = {
                            video: {
                                quality: [],
                                defaultQuality: 0,
                                pic: this.fileURLs[0]
                            },
                            preload: 'auto'
                        }

                        for (let i in res) {
                            let url = res[i]
                            let video = videoMap[i]
                            this.playerOptions.video.quality.push({
                                name: `Ep${video.episode} #${video.id}`,
                                url: url,
                                type: 'auto'
                            })
                        }

                        this.playerOptions.video.quality = _.orderBy(this.playerOptions.video.quality, ['name'], ['asc'])

                        this.playerShow = true
                    })
                })
            })
        }
    }
</script>
