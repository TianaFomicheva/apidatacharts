<template>
  <v-app id="app" flex row>
    <v-layout row>
      <div id="sidebar" class="grey lighten-3">
        <div
          v-for="(group, name) in typeGroupsArr"
          :key="name"
          @click="selectGroup(group)"
        >
          <p>{{ $options.OPTIONS_CODES[name].short }}</p>
        </div>
      </div>
      <div id="content">
        <div id="searchRow">
          <span>Поиск</span>
          <v-text-field
            prepend-icon="mdi-clipboard-text-search-outline"
            label="Поиск по названия и коду отделения"
            outlined
            v-model="filter"
            @input="filterData(filter)"
          ></v-text-field>
        </div>
        <div v-if="!selectedGroup" id="mainPage">
          <div id="mainColumn">
            <div id="commonDataField">
              <div
                v-for="(group, name) in typeGroupsArr"
                :key="name"
                @click="selectGroup(group)"
              >
                <p>{{ group.length }}</p>
                <p>{{ $options.OPTIONS_CODES[name].long }}</p>
              </div>
            </div>

            <div style="height: 200px; width: auto">
              <BarChart
                v-if="apiData.length > 0"
                :labels="typeShortNames"
              :percents="typePercents"
              :colors="typeColors"
               
                class="chartImg"
                :key="JSON.stringify(apiData)"
              />
            </div>
          </div>
          <div id="pieChartColumn">
            <DoughnutChart
              v-if="apiData.length > 0"
              :labels="typeLongNames"
              :percents="typePercents"
              :colors="typeColors"
              class="chartImg"
              :key="JSON.stringify(apiData)"
            />
          </div>
        </div>
        <SelectedTypeList
          v-if="selectedGroup"
          :list="selectedGroup"
          :filter="filter"
          :key="filter"
        />
      </div>
    </v-layout>
  </v-app>
</template>

<script>
import { getData } from "./api/api.js";
import { DoughnutChart, BarChart, SelectedTypeList } from "./components";

export default {
  name: "App",
  components: {
    DoughnutChart,
    BarChart,
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
    0: { short: "ФМС", long: "подразделений ФМС", color: "pink" },
    1: { short: "ГУВД или МВД", long: "ГУВД или МВД региона", color: "grey" },
    2: {
      short: "УВД или ОВД",
      long: "УВД или ОВД района или города",
      color: "blue",
    },
    3: {
      short: "отделений полиции",
      long: "отделений полиции",
      color: "yellow",
    },
  },
  computed: {
    typeLongNames() {
      return Object.values(this.$options.OPTIONS_CODES).map(
        (item) => item.long
      );
    },
    typeShortNames() {
      return Object.values(this.$options.OPTIONS_CODES).map(
        (item) => item.short
      );
    },
    typeColors() {
      return Object.values(this.$options.OPTIONS_CODES).map(
        (item) => item.color
      );
    },
  },
  methods: {
    filterData(filter) {
      !this.selectedGroup ? this.loadData(filter) : this.setFilter(filter);
    },
    setFilter(filter) {
      this.filter = filter;
    },
    loadData(filter) {
      console.log(filter);
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
      this.filter = "";
    },
  },
};
</script>

<style scoped>
.layout {
  margin: 0;
}
#commonDataField {
  display: flex;
  justify-content: space-between;
  background: #ddd;
}
.chartImg {
  height: 100%;
}
#sidebar {
  width: 15%;
  padding: 10px;
}
#content {
  width: 85%;
}
#mainColumn {
  width: 70%;
  display: inline-block;
}
#pieChartColumn {
  width: 30%;
  display: inline-block;
}
#mainPage {
  display: flex;
}
#searchRow {
  display: flex;
  align-items: center;
}
</style>
<style>
.v-text-field__details {
  display: none !important;
}
</style>
