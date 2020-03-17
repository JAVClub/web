<template>
    <div>
        <a-pagination
        showQuickJumper
        :defaultCurrent="page"
        :pageSize="pageSize"
        :total="total"
        v-on="newListener"
        />
        <br />
    </div>
</template>
<script>
    export default {
        props: [ 'total', 'pageSize', 'page' ],

        data: () => {
            return {}
        },

        computed: {
            newListener: function() {
                let vm = this

                return Object.assign({}, this.$listeners, {
                    change: (page, pageSize) => {
                        vm.$emit('pageChange', {
                            page,
                            pageSize
                        })
                    }
                })
            }
        }
    };
</script>
<style scoped>
    div {
        display: inline;
        text-align: center;
    }
</style>