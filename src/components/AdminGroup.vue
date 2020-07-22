<template>
    <div>
        <a-button class="margin" type="primary" @click="cgVisible=true">
          Create Group
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
            <a @click="changeGroup" :data-id="item.id" :data-name="item.name" :data-rule="item.rule">Change Group</a>
            <a-divider type="vertical" />
            <a @click="removeGroup" :data-id="item.id">Remove</a>
          </span>
        </a-table>
        <a-modal
          title="Create Group"
          :visible="cgVisible"
          @ok="cgOk"
          @cancel="cancel"
        >
          <a-input class="margin" v-model="groupName" placeholder="Group Name" />
          <a-textarea
            v-model="rule"
            placeholder="Rule"
            :auto-size="{ minRows: 3, maxRows: 8 }"
          />
        </a-modal>
        <a-modal
          title="Change Group"
          :visible="cgrVisible"
          @ok="cgrOk"
          @cancel="cancel"
        >
          <a-input class="margin" v-model="groupName" placeholder="Group Name" />
          <a-textarea
            v-model="rule"
            placeholder="Rule"
            :auto-size="{ minRows: 3, maxRows: 8 }"
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
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Rule',
    dataIndex: 'rule',
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
          cgVisible: false,
          cgrVisible: false,
          groupName: '',
          rule: '',
          gid: 0
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

        this.axios.get(this.apiHost + `/group/getGroupList/${params.page || 1}/${params.size || 10}`).then((res) => {
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

      changeGroup(ele) {
        this.gid = ele.target.dataset.id
        this.groupName = ele.target.dataset.name
        this.rule = ele.target.dataset.rule
        this.cgrVisible = true
      },

      removeGroup(ele) {
        const gid = ele.target.dataset.id
        this.$confirm({
          title: 'Are you sure delete this group?',
          content: 'This operation is irreversible',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            await this.axios.post(this.apiHost + '/group/removeGroup', {
              id: gid
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

      cgrOk() {
        this.axios.post(this.apiHost + '/group/changeGroup', {
          id: this.gid,
          name: this.groupName,
          rule: this.rule
        }).then((res) => {
            res = res.data

            if (res.code === 0) {
                this.$message.success('Success')
            } else {
              this.$message.error(res.msg)
            }
            this.cgrVisible = false
            this.fetch()
        })
        this.groupName = ''
        this.rule = ''
      },

      cgOk() {
        this.axios.post(this.apiHost + '/group/createGroup', {
          name: this.groupName,
          rule: this.rule
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
        this.groupName = ''
        this.rule = ''
      },

      cancel() {
        this.cgVisible = false
        this.cgrVisible = false
      }
    }
}
</script>

<style scoped>
.margin {
  margin-bottom: 22px;
}
</style>