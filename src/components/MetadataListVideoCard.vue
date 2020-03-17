<template>
    <a-card hoverable style="width: 350px">
        <img
        alt="cover"
        :src="JAVinfo.posterFileURL"
        slot="cover"
        />
        <a :href="`/#/metadata/view/${JAVinfo.id}`"><a-card-meta :title="`[${JAVinfo.JAVID}]` + JAVinfo.title" /></a>
        <br />
        <div class="tags">
            <span>Star{{`${(JAVinfo.stars.length === 1) ? '' : 's'}`}}: </span>
            <a-tag
            v-for="star in getSplcedList(JAVinfo.stars)"
            :key="JAVinfo.JAVID + '_star_' + star.id"
            :star-id="star.id"
            color="green"
            >
                <a :href="`/#/metadata/list/1/star/${star.id}`">{{star.name}}</a>
            </a-tag>
            <span v-if="JAVinfo.stars.length > 5">...</span>
        </div>
        <br />
        <div class="tags">
            <span>Tag{{`${(JAVinfo.tags.length === 1) ? '' : 's'}`}}: </span>
            <a-tag
            v-for="tag in getSplcedList(JAVinfo.tags)"
            :key="JAVinfo.JAVID + '_tag_' + tag.id"
            :tag-id="tag.id"
            color="blue"
            >
                <a :href="`/#/metadata/list/1/tag/${tag.id}`">{{tag.name}}</a>
            </a-tag>
            <span v-if="JAVinfo.tags.length > 5">...</span>
        </div>
    </a-card>
</template>

<script>
export default {
    props: [ 'data' ],

    data: function() {
        return {
            JAVinfo: Object.assign({}, this.data)
        }
    },

    methods: {
        getSplcedList(items) {
            let processed = []
            
            processed = Array.from(items).splice(0, 5)
            
            return processed
        }
    }
}
</script>

<style scoped>
    .tags {
        display: inline;
    }
</style>