<template>
  <div>
    <div v-if="filteredList.length>0">
      <input v-model="filter" @keydown.enter="filterData(filter)" />
    </div>
    <div v-for="item in filteredList" :key="item.name">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectedTypeList",
  data() {
    return {
      filter: "",
    };
  },
  props: {
    list: {
      type: Array,
    },
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