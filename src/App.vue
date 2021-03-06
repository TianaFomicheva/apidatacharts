<template>
  <v-app id="app" flex row>
    <v-container>
      <v-layout row>
        <div class="sidebar">
          <p class="sidebar__item" @click="selectedGroup = {}">Главная</p>
          <p></p>
          <div
            v-for="(group, name) in typeGroups"
            :key="name"
            @click="selectGroup(name)"
          >
            <p class="sidebar__item">{{ typesOptions[name].short }}</p>
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
              <div class="commonData__wrapper">
                <p class="title">Общие данные</p>
                <div class="commonData__field">
                  <div
                    class="commonData__item"
                    v-for="(group, type) in typeGroupsFiltered"
                    :key="type"
                  >
                    <p class="count">{{ group.length }}</p>
                    <p>{{ typesOptions[type].long }}</p>
                    <div @click="selectGroup(type)" class="link">
                      <v-icon>mdi-arrow-right</v-icon>Перейти
                    </div>
                  </div>
                </div>
              </div>
              <div id="barChartWrapper">
                <BarChart
                  :labels="typeShortNames"
                  :counts="typeCounts"
                  class="chartImg"
                  :key="JSON.stringify(typeGroupsFiltered)"
                />
              </div>
            </div>
            <div id="doughnutChartColumn">
              <DoughnutChart
                :labels="typeShortNames"
                :counts="typeCounts"
                :colors="typeColors"
                class="chartImg"
                :key="JSON.stringify(typeGroupsFiltered)"
              />
              <TableData
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
import { types_options } from "./data/types_options.js";
import {
  DoughnutChart,
  BarChart,
  TableData,
  SelectedTypeList,
} from "./components";
import { getData } from "./api/api.js";

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
      apiData: {},
      filteredData: [],
      typeGroups: {},
      selectedGroup: {},
    };
  },

  created() {
    const rsData = async () => {
      try {
        let response = await getData();
        this.setData(response);
      } catch (e) {
        console.log(e);
      }
    };
    rsData();
  },

  computed: {
    typesOptions() {
      return types_options ? types_options : false;
    },
    typeShortNames() {
      return Object.values(types_options).map((item) => item.short);
    },
    typeColors() {
      return Object.values(types_options).map((item) => item.color);
    },
    typeGroupsFiltered() {
      const newObj = {};
      for (let [key, val] of Object.entries(this.typeGroups)) {
        newObj[key] = val.filter(
          (item) =>
            item.name.search(new RegExp(this.filter, "i")) !== -1 ||
            item.code.search(new RegExp(this.filter, "i")) !== -1
        );
      }
      return newObj;
    },
    typeCounts() {
      return Object.values(this.typeGroupsFiltered).map((item) => item.length);
    },
  },

  methods: {
    setData(data) {
      this.typeGroups = [];
      this.apiData = Object.assign({}, data.suggestions);
      this.formatData(this.apiData);
    },
    formatData(data) {
      //преобразует пришедшие данные в формат {{type:[options]}, {type:[options]}}
      const types = Object.keys(types_options);
      const typeGroupsObj = {};
      // //создаем объект с пустыми массивами, по количеству элементов TYPES_OPTIONS
      for (let i of types) {
        typeGroupsObj[i] = [];
      }
      //заполняем объект значениями
      Object.values(data)
        .map((data) => data.data)
        .map((item) => {
          Object.entries(typeGroupsObj).forEach(([key, value]) => {
            if (key === item.type.toString()) {
              value.push(item);
            }
          });
        });
      this.typeGroups = typeGroupsObj;
    },
    filterData(filter) {
      this.filter = filter;
    },
    selectGroup(type) {
      this.selectedGroup = Object.assign(
        {},
        { longName: types_options[type].long, options: this.typeGroups[type] }
      );
    },
  },
};
</script>

<style scoped>
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
.title {
  font-size: 20px;
  font-weight: bold;
}
#barChartWrapper {
  margin-top: 30px;
}


@media screen and (max-width: 576px) {
  #content {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  }
  #mainPage {
    display: block;
  }
  #mainColumn, #doughnutChartColumn {
    width: 100%;
  }

}
</style>

