<template>
  <v-simple-table>
    <template  v-slot:top><div style="text-align:right;padding-right:16px;">Всего: {{ sum }}</div></template>
    <template v-slot:default>
      <thead>        
      </thead>
      <tbody>
        <tr
          v-for="item in JSON.parse(JSON.stringify(groupsList))"
          :key="item.name"
        >
          <td>
            <div
              style="
                height: 12px;
                width: 12px;
                display: inline-block;
                margin-right: 4px;
              "
              :style="{ background: item.color }"
            ></div>
            {{ item.name }}
          </td>
          <td class="text-center">{{ item.percent }}%</td>
          <td class="text-center">{{ item.count }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'TableData',
  data() {
    return {
      groupsList: [],
      sum: 0,
    }
  },
  props: {
    labels: {
      type: Array,
    },
    counts: {
      type: Array,
    },
    colors: {
      type: Array,
    },
  },
  mounted() {
    this.sum = this.counts.reduce((a, b) => a + b, 0)
    for (let i = 0; i < this.labels.length; i++) {
      this.groupsList[i] = {}
      this.groupsList[i]['name'] = this.labels[i]
      this.groupsList[i]['percent'] =
        this.counts[i] !== 0 ? (this.sum / this.counts[i]) * 100 : 0
      this.groupsList[i]['count'] = this.counts[i]
      this.groupsList[i]['color'] = this.colors[i]
    }
  },
}
</script>