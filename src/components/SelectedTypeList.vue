<template>
  <div>   
    <div v-for="item in filteredList" :key="item.name">
      {{ item.name }}
    </div>
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