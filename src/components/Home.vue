<template>
    <div>
        <h1>JAVClub</h1>
        <div>
            
        </div>
        <a-row>
            <a-col :span="6">
                <a-statistic title="Metadatas" :value="numbers.metadatas" style="margin-right: 50px" />
                <a-statistic title="Videos" :value="numbers.videos" style="margin-right: 50px" />
            </a-col>
            <a-col :span="6">
                <a-statistic title="Stars" :value="numbers.stars" style="margin-right: 50px" />
                <a-statistic title="Tags" :value="numbers.tags" style="margin-right: 50px" />
            </a-col>
            <a-col :span="6">
                <a-statistic title="Series" :value="numbers.series" style="margin-right: 50px" />
                <a-statistic title="Files" :value="numbers.files" style="margin-right: 50px" />
            </a-col>
            <a-col :span="6">
                <a-statistic title="Drivers" :value="numbers.drivers" style="margin-right: 50px" />
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {


    data: () => {
        return {
            numbers: {
                metadatas: 0,
                files: 0,
                drivers: 0,
                series: 0,
                stars: 0,
                tags: 0,
                videos: 0
            }
        }
    },

    created: function() {
        this.axios.get(this.apiHost + '/statistic/getData').then((res) => {
            res = res.data
            this.numbers = res.data
        })

        document.title = 'Homepage | JAVClub'
    }
}
</script>