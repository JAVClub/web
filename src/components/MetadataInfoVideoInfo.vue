<template>
    <div>
        <a-table
            :rowKey="'name'"
            :columns="[{title: 'Key', dataIndex: 'name', width: '120px'},{title: 'Value', dataIndex: 'value', scopedSlots: { customRender: 'value' }}]"
            :dataSource="table" size="middle">
            <span slot="value" slot-scope="value, name">
                <div v-if="name.name === 'Tag(s)' || name.name === 'Star(s)'">
                    <a-tag
                    v-for="tag in value"
                    :color="name.name === 'Tag(s)' ? 'blue' : 'green'"
                    :key="tag.name"
                    >
                        <a :href="`/#/metadata/list/1/${name.name === 'Tag(s)' ? 'tag' : 'star'}/${tag.id}`">{{tag.name}}</a>
                    </a-tag>
                </div>
                <span v-else-if="name.name !== 'Operation'">
                    <a v-if="name.name === 'Series' && value !== null" :href="`/#/metadata/list/1/series/${value.id}`">{{value.name}}</a><span v-else>{{value}}</span>
                </span>
                <div v-else>
                    <a-button type="primary" v-on:click="addToBookmark()">Add to bookmark</a-button>
                </div>
            </span>
        </a-table>
    </div>
</template>

<script>
export default {
    props: ['JAVID', 'releaseDate', 'tags', 'stars', 'series'],

    computed: {
        table: function() {
            return [
                {
                    name: 'JAV ID',
                    value: this.JAVID
                },
                {
                    name: 'Release Data',
                    value: this.releaseDate
                },
                {
                    name: 'Tag(s)',
                    value: this.tags
                },
                {
                    name: 'Star(s)',
                    value: this.stars,
                },
                {
                    name: 'Series',
                    value: this.series
                },
                {
                    name: 'Operation',
                    value: null
                }
            ]
        }
    },
    
    methods: {
        addToBookmark: function() {
            this.$emit('addToBookmark', null)
        }
    }
}
</script>