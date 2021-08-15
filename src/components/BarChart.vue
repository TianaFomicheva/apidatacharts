<script>
import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  name: 'BarChart',
  props: {
    labels: {
      type: Array,
    },
    counts: {
      type: Array,
    },

  },

  mounted() {
    this.renderChart(
      {
        labels: Object.values(this.labels),
        datasets: [
          {
            data: this.counts,
            backgroundColor: '#00cb9a',
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
      }
    )
  },
}
</script>