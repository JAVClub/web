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

        <div v-if="playerShow" style="overflow-x: scroll">
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
                <img style="max-height: 140px; max-width: 240px;" :src="item" @click="showPic(fileId)" alt="screenshoot">
            </waterfall-slot>
        </waterfall>
        <previewer v-if="fileURLLoadStatus" ref="previewer" :list="screenshootList"></previewer>
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
    import vuePicturePreview from 'vue-picture-preview'

    export default {
        components: {
            MetadataInfoVideoList,
            MetadataInfoVideoInfo,
            Waterfall,
            WaterfallSlot,
            'd-player': VueDPlayer,
            Previewer: vuePicturePreview
        },

        computed: {
            screenshootList: function() {
                const list = []
                for (const i in this.fileURLs) {
                    const url = this.fileURLs[i]
                    list.push({
                        src: url
                    })
                }

                return list
            }
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
                version: 0,
                fileURLs: [],
                fileURLLoadStatus: false,
                playerShow: false,
                playerOptions: {},
                addToBookmarkModal: false,
                bookmarks: {},
                selectBookmark: 0
            }
        },

        methods: {
            showPic: function(index) {
                this.$refs.previewer.show(index)
            },

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
            },

            renderStoryboard: function(data) {
                let result = data
                for (let i in result) {
                    this.fileURLs.push(result[i])
                }

                this.fileURLLoadStatus = true

                let retryTimes = {}

                setTimeout(() => {
                    const trackError = (img) => {
                        if (!img.addEventListener) return
                        img.addEventListener('error', (event) => {
                            if (retryTimes[event.target.src] && retryTimes[event.target.src] > 10) img.removeEventListener('error', trackError)
                            retryTimes[event.target.src] = (Number.isInteger(retryTimes[event.target.src])) ? retryTimes[event.target.src] : 0
                            retryTimes[event.target.src] += 1
                            event.target.src = event.target.src + '?retry'
                        })
                    }

                    let imgs = document.getElementsByTagName('img')
                    for (let i in imgs) {
                        let img = imgs[i]
                        trackError(img)
                    }
                }, 20)
            }
        },

        created: async function() {
            document.title = 'Metadata Info | JAVClub'

            await this.axios.get(this.apiHost + `/metadata/getInfo/${this.$route.params.id}`).then((res) => {
                res = res.data.data
                this.videoId = res.id
                this.title = res.title
                this.JAVID = res.JAVID
                this.releaseDate = res.releaseDate
                this.cover = res.posterFileURL
                this.tags = res.tags
                this.stars = res.stars
                this.series = res.series
                this.version = res.version

                if (this.version === 2) {
                    this.renderStoryboard(res.screenshotFilesURL)
                }
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
                        version: item.version,
                        bitRate: item.videoMetadata.metadata.video.bitRate,
                        duration: item.videoMetadata.metadata.video.duration,
                        updateTime: (new Date(parseInt(item.updateTime))).toUTCString()
                    })
                }

                processed = _.orderBy(processed, ['episode'], ['asc'])

                this.videos = processed

                if (this.version === 1) {
                    let fileIds = []
                    for (const k in this.videos) {
                        const item = this.videos[k]

                        if (item.version !== 1) continue
                        for (const i in item.storyboardFileIdSet) {
                            fileIds.push(item.storyboardFileIdSet[i])
                        }

                        break
                    }

                    this.axios.get(this.apiHost + `/file/getURL/${fileIds.join(',')}`).then((res) => {
                        const arr = Array.from(Object.values(res.data.data))
                        this.renderStoryboard(arr.reverse())
                    })
                }

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
                            defaultQuality: 0
                        },
                        preload: 'auto'
                    }

                    for (let i in res) {
                        let url = res[i]
                        let video = videoMap[i]
                        video.url = url
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
        }
    }
</script>
