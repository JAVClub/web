<template>
    <a-table :columns="columns" :rowKey="'id'" :dataSource="data">
        <a slot="name" slot-scope="text">{{text}}</a>
        <span slot="url" slot-scope="_url">
            <a :href="_url" target="_blank">Link</a>
        </span>
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
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            ellipsis: true
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
            key: 'updateTime',
            ellipsis: true
        },
        {
            title: 'Download',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            scopedSlots: { customRender: 'url' }
        }
    ];

    export default {
        props: ['text', 'data'],

        data: function() {
            return {
                columns
            };
        }
    };
</script>