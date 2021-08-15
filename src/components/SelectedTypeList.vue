<template>
  <v-simple-table>
    <template v-slot:default>
      <thead></thead>
      <tbody>
        <tr v-for="item in filteredList" :key="item.name">
          <td>{{ item.code }}</td>
          <td class="text-left">{{ item.name }}</td>
          <td class="text-center">{{ item.region_code }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>





<script>
export default {
  name: "SelectedTypeList",
  props: {
    list: {
      type: Array,
    },
    filter: {
      type: String,
    },
  },
  computed: {
    filteredList() {
      return this.list.filter((item) => item.name.indexOf(this.filter) !== -1)
    },
  },
  methods: {
    filterData(filter) {
      this.filter = filter
    },
  },
}
</script>
<style scoped>
table {
  width: 100%;
}
td {
  padding-left: 25px;
  padding-right: 25px;
}
</style>