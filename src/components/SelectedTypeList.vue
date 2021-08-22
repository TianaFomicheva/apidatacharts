<template>
  <v-simple-table>
    <template v-slot:default>
      <thead><td>Код подразделения</td><td>Название</td><td>Код региона</td><td>Вид подразделения</td></thead>
      <tbody>
        <tr v-for="item in filteredList" :key="item.name">
          <td>{{ item.code }}</td>
          <td class="text-left">{{ item.name }}</td>
          <td class="text-left">{{ item.region_code }}</td>
          <td class="text-left">{{ typeName }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>





<script>
export default {
  name: 'SelectedTypeList',
  data(){
    return{
      typeName: ''
    }
  },
  props: {
    list: {
      type: Object,
    },
    filter: {
      type: String,
    },
  },
  created(){
    this.typeName = this.list.longName
  },
  computed: {
    filteredList() {
        return  this.list.options.filter(item => item.name.search(new RegExp(this.filter, 'i')) !== -1 || item.code.search(new RegExp(this.filter, 'i')) !== -1) 
    },
  },
  methods: {
    filterData(filter) {
      this.filter = filter
    },
  },
}
</script>
<style scoped>
thead{
  background: #f5f5f5;
  color: #aeaeae;
}
thead td{
  vertical-align: bottom;
  padding-left:16px;
}
.v-data-table{
  margin-top: 20px !important;
}
</style>
