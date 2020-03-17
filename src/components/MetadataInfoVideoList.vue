<template>
    <a-table :columns="columns" :rowKey="'id'" :dataSource="table">
        <a slot="name" slot-scope="text">{{text}}</a>
    </a-table>
</template>
<script>
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: 'Bit Rate',
            dataIndex: 'bitRate',
            key: 'bitRate',
            ellipsis: true
        },
        {
            title: 'Episode',
            dataIndex: 'episode',
            key: 'episode',
            ellipsis: true
        },
        {
            title: 'Video File Id',
            dataIndex: 'videoFileId',
            key: 'videoFileId',
            ellipsis: true
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            ellipsis: true
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
            key: 'updateTime',
            ellipsis: true
        },
    ];

    export default {
        props: ['text', 'data'],

        data: function() {
            return {
                columns
            };
        },

        computed: {
            table: function() {
                let data = this.data

                return data
            }
        }
    };
</script>