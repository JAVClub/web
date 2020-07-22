<template>
    <div>
        <a-button class="margin" type="primary" @click="cuVisible=true">
          Create User
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
            <a @click="changeUsername" :data-id="item.id">Change Username</a>
            <a-divider type="vertical" />
            <a @click="changePassword" :data-id="item.id">Change Password</a>
            <a-divider type="vertical" />
            <a @click="changeGroup" :data-id="item.id">Change Group</a>
            <a-divider type="vertical" />
            <a @click="changeComment" :data-id="item.id">Change Comment</a>
            <a-divider type="vertical" />
            <a @click="removeUser" :data-id="item.id">Remove</a>
          </span>
        </a-table>
        <a-modal
          title="Create User"
          :visible="cuVisible"
          @ok="cuOk"
          @cancel="cancel"
        >
          <a-input class="margin" v-model="username" placeholder="Username" />
          <a-input class="margin" v-model="password" placeholder="Password" />
          <a-input class="margin" v-model="groupId" placeholder="Group Id" />
          <a-input class="margin" v-model="comment" placeholder="Comment" />
          <a-input class="margin" v-model="from" placeholder="From" />
        </a-modal>
        <a-modal
          title="Change Username"
          :visible="cusVisible"
          @ok="cusOk"
          @cancel="cancel"
        >
          <a-input v-model="username" placeholder="Username" />
        </a-modal>
        <a-modal
          title="Change Password"
          :visible="cpVisible"
          @ok="cpOk"
          @cancel="cancel"
        >
          <a-input v-model="password" placeholder="Password" />
        </a-modal>
        <a-modal
          title="Change Group"
          :visible="cgVisible"
          @ok="cgOk"
          @cancel="cancel"
        >
          <a-input v-model="groupId" placeholder="Group Id" />
        </a-modal>
        <a-modal
          title="Change Comment"
          :visible="ccVisible"
          @ok="ccOk"
          @cancel="cancel"
        >
          <a-input v-model="comment" placeholder="Comment" />
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
    title: 'Username',
    dataIndex: 'username'
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
  },{
    title: 'Permission Group Id',
    dataIndex: 'permission_group',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime'
  },
  {
    title: 'Last Seen',
    dataIndex: 'lastSeen'
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
          cpVisible: false,
          cgVisible: false,
          ccVisible: false,
          cuVisible: false,
          cusVisible: false,
          username: '',
          password: '',
          comment: '',
          groupId: '',
          from: '',
          uid: 0
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

        this.axios.get(this.apiHost + `/user/getUserList/${params.page || 1}/${params.size || 10}`).then((res) => {
          res = res.data.data
          for (const i in res.data) {
            res.data[i].action = res.data[i].id
            res.data[i].createTime = this.genTimeStr(parseInt(res.data[i].createTime))
            res.data[i].lastSeen = this.genTimeStr(parseInt(res.data[i].lastSeen))
          }

          this.data = res.data
          const pagination = { ...this.pagination }
          if (res.total) pagination.total = res.total
          this.pagination = pagination
          this.loading = false
        })
      },

      changeUsername(ele) {
        this.uid = ele.target.dataset.id
        this.cusVisible = true
      },

      changePassword(ele) {
        this.uid = ele.target.dataset.id
        this.cpVisible = true
      },

      changeGroup(ele) {
        this.uid = ele.target.dataset.id
        this.cgVisible = true
      },

      changeComment(ele) {
        this.uid = ele.target.dataset.id
        this.ccVisible = true
      },

      removeUser(ele) {
        const uid = ele.target.dataset.id
        this.$confirm({
          title: 'Are you sure delete this user?',
          content: 'This operation is irreversible',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            await this.axios.post(this.apiHost + '/user/removeUser', {
              uid
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

      cusOk() {
        this.axios.post(this.apiHost + '/user/changeUsername', {
          newUsername: this.username,
          uid: this.uid
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.cusVisible = false
            this.fetch()
        })
        this.username = ''
      },

      cpOk() {
        this.axios.post(this.apiHost + '/user/changePassword', {
          newPassword: this.password,
          uid: this.uid
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.cpVisible = false
        })
        this.password = ''
      },

      cgOk() {
        this.axios.post(this.apiHost + '/user/changeGroup', {
          newGroup: this.groupId,
          uid: this.uid
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.cgVisible = false
            this.fetch()
        })
        this.groupId = ''
      },

      ccOk() {
        this.axios.post(this.apiHost + '/user/changeComment', {
          newComment: this.comment,
          uid: this.uid
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.ccVisible = false
            this.fetch()
        })
        this.comment = ''
      },

      cuOk() {
        this.axios.post(this.apiHost + '/user/createUser', {
          username: this.username,
          password: this.password,
          comment: this.comment,
          groupId: this.groupId,
          from: this.from
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.cuVisible = false
            this.fetch()
        })
        this.username = ''
        this.password = ''
        this.comment = ''
        this.groupId = ''
        this.from = ''
      },

      cancel() {
        this.cpVisible = false
        this.cgVisible = false
        this.ccVisible = false
        this.cuVisible = false
        this.cusVisible = false
      }
    }
}
</script>

<style scoped>
.margin {
  margin-bottom: 22px;
}
</style>