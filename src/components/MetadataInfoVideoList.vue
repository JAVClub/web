<template>
    <a-table :columns="columns" :rowKey="'id'" :dataSource="data">
        <a slot="name" slot-scope="text">{{text}}</a>
        <span slot="open" slot-scope="_url">
            <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                Open In <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                <a-menu-item>
                    <a :href="`iina://weblink?url=${_url}`" target="_blank">IINA</a>
                </a-menu-item>
                <a-menu-item>
                    <a :href="`potplayer://${_url}`" target="_blank">PotPlayer</a>
                </a-menu-item>
                <a-menu-item>
                    <a :href="`vlc://${_url}`" target="_blank">VLC</a>
                </a-menu-item>
                <a-menu-item>
                    <a :href="`nplayer-${_url}`" target="_blank">nPlayer</a>
                </a-menu-item>
                </a-menu>
            </a-dropdown>
        </span>
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
            key: 'id'
        },
        {
            title: 'Episode',
            dataIndex: 'episode',
            key: 'episode',
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
            title: 'Native Player',
            dataIndex: 'url',
            key: 'openIn',
            ellipsis: false,
            scopedSlots: { customRender: 'open' }
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