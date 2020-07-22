<template>
    <div>
      <p id="limit"></p>
      <a-button class="margin" type="primary" @click="createInvitation">
        Create Invitation
      </a-button>
      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
      </a-table>
    </div>
</template>

<script>
const columns = [
  {
    title: '#',
    dataIndex: 'id'
  },
  {
    title: 'Creator(UID)',
    dataIndex: 'creator'
  },
  {
    title: 'Code',
    dataIndex: 'code'
  },
  {
    title: 'Used By(UID)',
    dataIndex: 'useBy',
  },{
    title: 'Permission Group Id',
    dataIndex: 'permission_group',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime'
  },
  {
    title: 'Used Time',
    dataIndex: 'useTime'
  }
]

export default {
    data: function() {
        return {
          data: [],
          pagination: {},
          loading: false,
          columns,
        }
    },

    mounted() {
      this.fetch()
      this.checkLimit()
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

      fetch(params = {}) {
        this.loading = true

        this.axios.get(this.apiHost + `/invitation/getInvitationList/${params.page || 1}/${params.size || 10}`).then((res) => {
          res = res.data.data
          for (const i in res.data) {
            res.data[i].createTime = this.genTimeStr(parseInt(res.data[i].createTime))
            res.data[i].useTime = this.genTimeStr(parseInt(res.data[i].useTime), '')
          }

          this.data = res.data
          const pagination = { ...this.pagination }
          if (res.total) pagination.total = res.total
          this.pagination = pagination
          this.loading = false
        })
      },

      genTimeStr(time, msg = '') {
        if (!time) return msg
        const date = new Date(time)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
      },

      createInvitation() {
        this.axios.post(this.apiHost + '/invitation/createInvitation', {}).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }

            this.fetch()
            this.checkLimit()
        })
      },

      checkLimit() {
        this.axios.get(this.apiHost + '/invitation/getInvitationLimit').then((res) => {
            res = res.data.data

            document.getElementById('limit').innerHTML = `Your monthly limitation is <b>${res.invitationNum}</b> and you have already created <b>${res.codeNum}</b> this month.`
        })
      }
    }
}
</script>

<style scoped>
.margin {
  margin-bottom: 22px;
}
</style>
