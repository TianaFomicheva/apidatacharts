<template>
  <v-app id="app" style="display:flex" row>

    <v-layout row>
   <div id="sidebar" class="grey lighten-3" style="width: 15%;">
      <div
        v-for="(group, name) in typeGroupsArr"
        :key="name"
        @click="selectGroup(group)"
      >
        <p>{{ $options.OPTIONS_CODES[name].short }}</p>
      </div>
    </div >
    <div id="content" style="width: 85%">
      <div v-if="!selectedGroup">
        <div>
          <v-text-field v-model="filter" @keydown.enter="loadData(filter)" ></v-text-field>
        </div>
        <div
          id="commonDataField"
          style="width: 100%; display: flex; background: #ddd"
        >
          <div
            v-for="(group, name) in typeGroupsArr"
            :key="name"
            style="width: calc(25% - 5px); display: inline-block"
            @click="selectGroup(group)"
          >
            <p>{{ group.length }}</p>
            <p>{{ $options.OPTIONS_CODES[name].long }}</p>
          </div>
        </div>
        <div style="height: 200px; width: auto">
          <PieChart
            v-if="apiData.length > 0"
            :labels="typeLongNames"
            :percents="typePercents"
            style="height: 100%"
            :key="JSON.stringify(apiData)"
          />
        </div>
         </div>
      <SelectedTypeList v-if="selectedGroup" :list="selectedGroup" />
    </div>
    </v-layout>

  </v-app>
</template>

<script>
import { getData } from "./api/api.js";
import PieChart from "./components/PieChart.vue";
import SelectedTypeList from "./components/SelectedTypeList.vue";

export default {
  name: "App",
  components: {
    PieChart,
    SelectedTypeList,
  },
  data() {
    return {
      filter: "",
      apiData: [],
      typeGroupsArr: [],
      typePercents: [],
      selectedGroup: null,
    };
  },

  created() {
    getData((data) => {
      this.apiData = [];

      this.apiData.push(data);

      this.formatData(data);
    });
  },
  OPTIONS_CODES: {
    0: { short: "ФМС", long: "подразделений ФМС" },
    1: { short: "ГУВД или МВД", long: "ГУВД или МВД региона" },
    2: { short: "УВД или ОВД", long: "УВД или ОВД района или города" },
    3: { short: "отделений полиции", long: "отделений полиции" },
  },
  computed: {
    typeLongNames() {
      return Object.values(this.$options.OPTIONS_CODES).map(
        (item) => item.long
      );
    },
  },
  methods: {
    loadData(filter) {
      console.log(filter)
      getData((data) => {
        this.apiData = [];
        (this.typeGroupsArr = []), (this.typePercents = []);
        this.apiData.push(data);
        this.formatData(data);
      }, filter);
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
      const parsedData = data.map((data) => data.data);
      parsedData.map((item) => {
        Object.entries(typeGroups).forEach(([key, value]) => {
          if (key === item.type.toString()) {
            value.push(item);
          }
        });
      });
      this.typePercents = Object.entries(typeGroups).map(
        (item) => item[1].length
      );
      this.typeGroupsArr = typeGroups;
    },
    selectGroup(group) {
      this.selectedGroup = group;
    },
  },
};
</script>
<style scoped>
.layout{
  margin:0
}
</style>
