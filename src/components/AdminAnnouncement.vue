<template>
    <div>
        <a-button class="margin" type="primary" @click="caVisible=true">
          Create Announcements
        </a-button>
        <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="id, item">
            <a @click="changeAnnouncement" :data-id="item.id" :data-title="item.title" :data-content="item.content">Change Announcement</a>
            <a-divider type="vertical" />
            <a @click="removeAnnouncement" :data-id="item.id">Remove</a>
          </span>
        </a-table>
        <a-modal
          title="Create announcement"
          :visible="caVisible"
          @ok="caOk"
          @cancel="cancel"
        >
          <a-input class="margin" v-model="title" placeholder="Title" />
          <a-textarea
            v-model="content"
            placeholder="Content"
            :auto-size="{ minRows: 3, maxRows: 16 }"
          />
        </a-modal>
        <a-modal
          title="Change Announcement"
          :visible="canVisible"
          @ok="canOk"
          @cancel="cancel"
        >
          <a-input class="margin" v-model="title" placeholder="Title" />
          <a-textarea
            v-model="content"
            placeholder="Content"
            :auto-size="{ minRows: 3, maxRows: 16 }"
          />
        </a-modal>
    </div>
</template>

<script>
const columns = [
  {
    title: '#',
    dataIndex: 'id'
  },
  {
    title: 'Title',
    dataIndex: 'title'
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime'
  },
  {
    title: 'Update Time',
    dataIndex: 'updateTime'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }

]

export default {
    data: function() {
        return {
          data: [],
          pagination: {},
          loading: false,
          columns,
          caVisible: false,
          canVisible: false,
          title: '',
          content: '',
          aid: 0
        }
    },

    mounted() {
      this.fetch()
    },

    methods: {
      handleTableChange(pagination) {
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.fetch({
          size: pagination.pageSize,
          page: pagination.current
        });
      },

      genTimeStr(time, msg = '') {
        if (!time) return msg
        const date = new Date(time)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
      },

      fetch(params = {}) {
        this.loading = true

        this.axios.get(this.apiHost + `/announcement/getAnnouncementList/${params.page || 1}/${params.size || 10}`).then((res) => {
          res = res.data.data
          for (const i in res.data) {
            res.data[i].action = res.data[i].id
            res.data[i].createTime = this.genTimeStr(parseInt(res.data[i].createTime))
            res.data[i].updateTime = this.genTimeStr(parseInt(res.data[i].updateTime))
          }

          this.data = res.data
          const pagination = { ...this.pagination }
          if (res.total) pagination.total = res.total
          this.pagination = pagination
          this.loading = false
        })
      },

      changeAnnouncement(ele) {
        this.aid = ele.target.dataset.id
        this.title = ele.target.dataset.title
        this.content = ele.target.dataset.content
        this.canVisible = true
      },

      removeAnnouncement(ele) {
        const aid = ele.target.dataset.id
        this.$confirm({
          title: 'Are you sure delete this group?',
          content: 'This operation is irreversible',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            await this.axios.post(this.apiHost + '/announcement/removeAnnouncement', {
              id: aid
            }).then((res) => {
                res = res.data

                if (res.code === 0) {
                    this.$message.success('Success')
                } else {
                  this.$message.error(res.msg)
                }
                this.fetch()
            })
          }
        })
      },

      canOk() {
        this.axios.post(this.apiHost + '/announcement/changeAnnouncement', {
          id: this.aid,
          title: this.title,
          content: this.content
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.canVisible = false
            this.fetch()
        })
        this.title = ''
        this.content = ''
      },

      caOk() {
        this.axios.post(this.apiHost + '/announcement/createAnnouncement', {
          title: this.title,
          content: this.content
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.caVisible = false
            this.fetch()
        })
        this.title = ''
        this.content = ''
      },

      cancel() {
        this.caVisible = false
        this.canVisible = false
      }
    }
}
</script>

<style scoped>
.margin {
  margin-bottom: 22px;
}
</style>