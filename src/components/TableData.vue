<template>
  <v-simple-table>
    <template  v-slot:top><div id="tableHeader">Всего: {{ sum }}</div></template>
    <template v-slot:default>
      <thead>        
      </thead>
      <tbody>
        <tr
          v-for="item in groupsList"
          :key="item.name"
        >
          <td>
            <div
              style="
                height: 12px;
                width: 12px;
                display: inline-block;
                margin-right: 4px;
              "
              :style="{ background: item.color }"
            ></div>
            {{ item.name }}
          </td>
          <td class="text-center">{{ item.percent }}%</td>
          <td class="text-center">{{ item.count }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'TableData',
  data() {
    return {  
      sum: 0,
    }
  },
  props: {
    labels: {
      type: Array,
    },
    counts: {
      type: Array,
    },
    colors: {
      type: Array,
    },
  },
  mounted() {
    this.sum = this.counts.length >0 ? this.counts.reduce((a, b) => a + b) : 0

  },
  computed:{
    groupsList(){
      const arr = []
      this.labels.map((item,ind)=>{
        arr[ind] = {}
        arr[ind].name = item
        arr[ind].count = this.counts[ind]
        arr[ind].percent = this.counts[ind] !== 0 ? (this.sum / this.counts[ind]) * 100 : 0
        arr[ind].color = this.colors[ind]
      })
      return arr
    },
  }
}
</script>
<style scoped>
#tableHeader{
   text-align:right;
   padding-right:24px;
}
table{
  font-size:9px;
  word-wrap:  break-word;
    overflow-wrap: anywhere;
}

</style>
<style >
@media screen and (max-width: 576px){
.v-data-table__wrapper, .v-data-table__wrapper td{
font-size: 14px;

}

}


</style>