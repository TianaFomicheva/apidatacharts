<template>
  <div>   
    <table>
    <tr v-for="item in filteredList" :key="item.name">
     <td> {{ item.code }} </td> <td> {{ item.name }} </td> <td> {{ item.region_code }} </td>
    </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "SelectedTypeList",
  props: {
    list: {
      type: Array,
    },
    filter:{
      type: String
    }
  },
  computed:{
      filteredList(){
          return  this.list.filter(item=>item.name.indexOf(this.filter) !== -1 )
      }
  },
  methods:{      
      filterData(filter){
          this.filter = filter
      }
  }
};
</script>
<style scoped>
table{
  width:100%;
}
td{
  padding-left: 25px;
  padding-right: 25px;
}
</style>