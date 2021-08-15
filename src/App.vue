<template>
  <v-app id="app" flex row>
    <v-container>
    <v-layout row>
      <div id="sidebar" >
        <p class="sidebarItem" @click="selectedGroup = null">Главная<p>
        <div
          v-for="(group, name) in typeGroupsArr"
          :key="name"
          @click="selectGroup(group)"
        >
          <p class="sidebarItem">{{ $options.OPTIONS_CODES[name].short }}</p>
        </div>
      </div>
      <div id="content">
        <div id="searchRow">
          <span class="title">Поиск</span>
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
            <div id="commonDataFieldWrapper">
              <p class="title">Общие данные</p>
              <div id="commonDataField">
                <div
                  v-for="(group, name) in typeGroupsArr"
                  :key="name"
                  
                >
                  <p class="groupCount">{{ group.length }}</p>
                  <p>{{ $options.OPTIONS_CODES[name].long }}</p>
                  <div @click="selectGroup(group)" class="link"><v-icon>mdi-arrow-right</v-icon>Перейти</div>
                </div>
              </div>
            </div>
            <div id="barChartWrapper">
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
          <div id="doughnutChartColumn">
            <DoughnutChart
              v-if="apiData.length > 0"
              :labels="typeShortNames"
              :percents="typePercents"
              :colors="typeColors"
              class="chartImg"
              id="doughnutChartImg"
              :key="JSON.stringify(apiData)"
            />
            <TableData v-if="apiData.length > 0"   :colors="typeColors" :labels="typeShortNames" :percents="typePercents" :key="JSON.stringify(apiData).slice(-1,1)"/>
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
     </v-container>
  </v-app>
</template>

<script>
import { getData } from "./api/api.js"
import { DoughnutChart, BarChart, TableData, SelectedTypeList } from "./components"

export default {
  name: "App",
  components: {
    DoughnutChart,
    BarChart,
    TableData,
    SelectedTypeList,
  },
  data() {
    return {
      filter: "",
      apiData: [],
      typeGroupsArr: [],
      typePercents: [],
      selectedGroup: null,
    }
  },

  created() {
    getData((data) => {
      this.apiData = []

      this.apiData.push(data)

      this.formatData(data)
    })
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
      )
    },
    typeShortNames() {
      return Object.values(this.$options.OPTIONS_CODES).map(
        (item) => item.short
      )
    },
    typeColors() {
      return Object.values(this.$options.OPTIONS_CODES).map(
        (item) => item.color
      )
    },
  },
  methods: {
    filterData(filter) {
      !this.selectedGroup ? this.loadData(filter) : this.setFilter(filter)
    },
    setFilter(filter) {
      this.filter = filter
    },
    loadData(filter) {
      console.log(filter)
      getData((data) => {
        this.apiData = []
        this.typeGroupsArr = []
        this.typePercents = []
        this.apiData.push(data)
        this.formatData(data)
      }, filter)
    },
    formatData(data) {
      const types = Object.keys(this.$options.OPTIONS_CODES)
      const emptyArr = []
      const typeGroups = {}
      for (let i = 0; i < types.length; i++) {
        emptyArr.push([])
      }
      for (let i = 0; i < types.length; i++) {
        typeGroups[types[i]] = emptyArr[i]
      }
      const parsedData = data.map((data) => data.data)
      parsedData.map((item) => {
        Object.entries(typeGroups).forEach(([key, value]) => {
          if (key === item.type.toString()) {
            value.push(item)
          }
        })
      })
      this.typePercents = Object.entries(typeGroups).map(
        (item) => item[1].length
      )
      this.typeGroupsArr = typeGroups
    },
    selectGroup(group) {
      this.selectedGroup = group
      this.filter = ""
    },
  },
}
</script>

<style scoped>
.layout {
  margin-top: 10px;
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
  padding-top:70px;
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
}
.link{
  cursor: pointer;
}
.title{
  font-size: 20px;
  font-weight: bold;
}
#barChartWrapper{
  margin-top: 20px;
}

</style>
<style>
#app{
  background: #f5f5f5;
}
.v-text-field__details {
  display: none !important;
}
.chartImg, .v-input__slot,#doughnutChartColumn{
  background: #fff !important;
}
.v-input{
  margin-left: 10px !important;
}
#bar-chart{
  height:200px !important;
  width:100% !important;
}
</style>
