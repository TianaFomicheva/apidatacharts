<template>
  <div id="app">
  <div>
  <input v-model="filter" @keydown.enter="loadData(filter)">
  </div>
    <div
      id="commonDataField"
      style="width: 100%; display: flex; background: #ddd"
    >
      <div
        v-for="(group, name) in typeGroupsArr"
        :key="name"
        style="width: calc(25% - 5px); display: inline-block"
      >
        <p>{{ group.length }}</p>
        <p>{{ $options.OPTIONS_CODES[name] }}</p>
      </div>
    </div>
    <div style="height:200px;width:auto">
    <PieChart v-if="apiData.length>0"  :labels="typeNames" :percents="typePercents" style="height:100%" :key="JSON.stringify(apiData)" />
    </div>
  </div>
</template>

<script>
import { getData } from "./api/api.js";
import  PieChart  from "./components/PieChart.vue";

export default {
  name: "App",
  components: {
    PieChart
  },
  data() {
    return {
      filter: '',
      apiData: [],
      typeGroupsArr: [],
      typePercents:[]
    };
  },

  created() {
    
    getData((data) => {
      console.log(data) 
    this.apiData = []
    
      this.apiData.push(JSON.parse(JSON.stringify(data)));

      this.formatData(JSON.parse(JSON.stringify(data)));
    });
  },
  OPTIONS_CODES: {
    0: "подразделений ФМС",
    1: "ГУВД или МВД региона",
    2: "УВД или ОВД района или города",
    3: "отделений полиции",
  },
  computed: {
    typeNames(){
      return Object.values(this.$options.OPTIONS_CODES)
    },
   
  },
  methods: {
loadData(filter){
  getData( (data) => {
      this.apiData = []
     this.typeGroupsArr = [],
      this.typePercents =[]
    
      this.apiData.push(JSON.parse(JSON.stringify(data)));
      this.formatData(JSON.parse(JSON.stringify(data)));
    }, filter)
},
    formatData(data) {
      const types = Object.keys(this.$options.OPTIONS_CODES);
      const emptyArr = [];
      const typeGroups = {};
      for (var i = 0; i < types.length; i++) {
        emptyArr.push([]);
      }
      for (var j = 0; j < types.length; j++) {
        typeGroups[types[j]] = emptyArr[j];
      }
      const parsedData = data.map(
        (data) => data.data
      );
      parsedData.map((item) => {
        Object.entries(typeGroups).forEach(([key, value]) => {
          if (key === item.type.toString()) {
            value.push(item);
          }
        });
      });
this.typePercents = Object.entries(typeGroups).map(item=>item[1].length)
      this.typeGroupsArr = JSON.parse(JSON.stringify(typeGroups));      
    },
  },
};
</script>

