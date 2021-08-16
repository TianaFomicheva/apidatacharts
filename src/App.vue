<template>
  <v-app id="app" flex row>
    <v-container>
      <v-layout row>
        <div id="sidebar">
          <p class="sidebarItem" @click="selectedGroup = {}">Главная</p>
          <p></p>
          <div
            v-for="(group, name) in typeGroups"
            :key="name"
            @click="selectGroup(name)"
          >
            <p class="sidebarItem">{{ $options.TYPES_OPTIONS[name].short }}</p>
          </div>
        </div>
        <div id="content">
          <div id="searchRow">
            <span class="title">Поиск</span>
            <v-text-field
              prepend-icon="mdi-clipboard-text-search-outline"
              label="Поиск по названию и коду отделения"
              outlined
              v-model="filter"
              @input="filterData(filter)"
            ></v-text-field>
          </div>
          <div v-if="Object.values(selectedGroup).length === 0" id="mainPage">
            <div id="mainColumn">
              <div id="commonDataFieldWrapper">
                <p class="title">Общие данные</p>
                <div id="commonDataField">
                  <div
                    class="commonDataItem"
                    v-for="(group, type) in typeGroupsFiltered"
                    :key="type"
                  >
                    <p class="groupCount">{{ group.length }}</p>
                    <p>{{ $options.TYPES_OPTIONS[type].long }}</p>
                    <div @click="selectGroup(type)" class="link">
                      <v-icon>mdi-arrow-right</v-icon>Перейти
                    </div>
                  </div>
                </div>
              </div>
              <div id="barChartWrapper">
                <BarChart
                  v-if="apiData.length > 0"
                  :labels="typeShortNames"
                  :counts="typeCounts"
                  class="chartImg"
                  :key="JSON.stringify(typeGroupsFiltered)"
                />
              </div>
            </div>
            <div id="doughnutChartColumn">
              <DoughnutChart
                v-if="apiData.length > 0"
                :labels="typeShortNames"
                :counts="typeCounts"
                :colors="typeColors"
                class="chartImg"
                id="doughnutChartImg"
                :key="JSON.stringify(typeGroupsFiltered)"
              />
              <TableData
                v-if="apiData.length > 0"
                :colors="typeColors"
                :labels="typeShortNames"
                :counts="typeCounts"
                :key="JSON.stringify(typeGroupsFiltered).slice(1)"
              />
            </div>
          </div>
          <SelectedTypeList
            v-if="Object.entries(this.selectedGroup).length > 0"
            :list="selectedGroup"
            :filter="filter"
            :key="filter"
          />
        </div>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { getData } from './api/api.js';
import {
  DoughnutChart,
  BarChart,
  TableData,
  SelectedTypeList,
} from './components';

export default {
  name: 'App',
  components: {
    DoughnutChart,
    BarChart,
    TableData,
    SelectedTypeList,
  },
  data() {
    return {
      filter: '',
      apiData: [],
      filteredData: [],
      typeGroups: {},
      typeCounts: [],
      selectedGroup: {},
    };
  },

  created() {
    getData((data) => {
      this.apiData = [];
      this.apiData.push(data);
      this.formatData(data);
      this.typeCounts = Object.values(this.typeGroups).map(
        (item) => item.length
      );
    });
  },
  TYPES_OPTIONS: {
    //можно было вынести в отдельный файл и заимпортить, но т.к. данных немного, сделала здесь как $options
    0: { short: "ФМС", long: "подразделений ФМС", color: "#ff5a45" },
    1: {
      short: "ГУВД или МВД",
      long: "ГУВД или МВД региона",
      color: "#5264ff",
    },
    2: {
      short: "УВД или ОВД",
      long: "УВД или ОВД района или города",
      color: "#92cc6d",
    },
    3: {
      short: "отделений полиции",
      long: "отделений полиции",
      color: "#ffd970",
    },
  },
  computed: {
    typeShortNames() {
      return Object.values(this.$options.TYPES_OPTIONS).map(
        (item) => item.short
      );
    },
    typeColors() {
      return Object.values(this.$options.TYPES_OPTIONS).map(
        (item) => item.color
      )
    },
    typeGroupsFiltered() {
      const newObj = {}
      for (
        let i = 0;
        i < Object.entries(this.typeGroups).length;
        i++
      ) {
        newObj[Object.keys(this.typeGroups)[i]] =
          Object.values(this.typeGroups)[i].filter(
            (item) =>
              item.name.search(new RegExp(this.filter, 'i')) !== -1 ||
              item.code.search(new RegExp(this.filter, 'i')) !== -1
          );
      }
      return newObj
    },
  },

  methods: {    
    loadData() {
      getData((data) => {
        this.apiData = []
        this.typeGroups = []
        this.typeCounts = []
        this.apiData.push(data)
        this.formatData(this.apiData)
      });
    },
    formatData(data) {
      //преобразует пришедшие данные в формат {{type:[options]}, {type:[options]}}
      const types = Object.keys(this.$options.TYPES_OPTIONS)
      const typeGroupsObj = {}
      // //создаем объект с пустыми массивами, по количеству элементов TYPES_OPTIONS     
      for (let i = 0; i < types.length; i++) {
        typeGroupsObj[types[i]] = []
      }
      //заполняем объект значениями
      data.map((data) => data.data)
        .map((item) => {
          Object.entries(typeGroupsObj).forEach(([key, value]) => {
            if (key === item.type.toString()) {
              value.push(item)
            }
          });
        });
      this.typeGroups = typeGroupsObj
    },
    filterData(filter) {
      this.filter = filter
      this.typeCounts = Object.values(this.typeGroupsFiltered).map(
        (item) => item.length
      )
    },
    selectGroup(type) {
      this.selectedGroup = {}
      //создаем структуру, чтобы передать и данные из апи, и данные из TYPES_OPTIONS
      this.selectedGroup[this.$options.TYPES_OPTIONS[type].long] = this.typeGroups[type]      
    },
  },
}
</script>

<style scoped>
.layout {
  margin-top: 5px;
}
#commonDataFieldWrapper {
  background: #ebebeb;
  padding: 10px;
}

#commonDataField {
  display: flex;
  justify-content: space-between;
}
#sidebar {
  width: 15%;
  padding: 10px;
  padding-top: 90px;
}
#content {
  width: 85%;
}
#mainColumn {
  width: calc(70% - 20px);
  display: inline-block;
}
#doughnutChartColumn {
  width: 30%;
  display: inline-block;
}
#mainPage {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
#searchRow {
  display: flex;
  align-items: center;
}
.sidebarItem {
  cursor: pointer;
  padding-bottom: 15px;
}
.groupCount {
  font-size: 24px;
  font-weight: bold;
}
.link {
  cursor: pointer;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
#barChartWrapper {
  margin-top: 30px;
}
.commonDataItem {
  padding-right: 10px;
}
.commonDataItem:last-child {
  padding-right: 0;
}
</style>
<style>
#app {
  background: #f5f5f5;
}
.v-text-field__details {
  display: none !important;
}
.chartImg,
.v-input__slot,
#doughnutChartColumn {
  background: #fff !important;
}
.v-input {
  margin-left: 10px !important;
}
#bar-chart {
  height: 200px !important;
  width: 100% !important;
}
</style>
