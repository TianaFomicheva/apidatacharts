<template>
  <div id="app">
<div id="commonDataField">
  <div v-for="(group, name) in typeGroupsArr" :key="name"  >
<p>{{ group.length }}  {{ $options.OPTIONS_CODES[name] }}</p>
  </div>
</div>


  </div>
</template>

<script>
import { getData } from "./api/api.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      apiData: [],     
      typeGroupsArr : []
    };
  },

  created() {
    getData((data) => {
      this.apiData.push(data);
      this.formatData(data);
    });
  },
  OPTIONS_CODES: {
    0: "подразделений ФМС",
    1: "ГУВД или МВД региона",
    2: "УВД или ОВД района или города",
    4: "отделений полиции",
  },
  computed: {
   
  },
  methods: {
    formatData(data) {
      const types = Object.keys(this.$options.OPTIONS_CODES);
      const emptyArr = [];
      const typeGroups = {}
      for (var i = 0; i < types.length; i++) {
        emptyArr.push([]);
      }
      for (var j = 0; j < types.length; j++) {
        typeGroups[types[j]] = emptyArr[j];
      }
      const parsedData = JSON.parse(JSON.stringify(data)).map(
        (data) => data.data
      );
      parsedData.map((item) => {
        Object.entries(typeGroups).forEach(([key, value]) => {
          if (key === item.type.toString()) {
            value.push(item);
          }
        });
      });
      this.typeGroupsArr = JSON.parse(JSON.stringify(typeGroups))
    },
  },
  
};
</script>

