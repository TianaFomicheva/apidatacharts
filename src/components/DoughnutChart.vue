<script>
import { Doughnut } from 'vue-chartjs'
export default {
    extends: Doughnut,
   name: 'DoughnutChart',
   props:{
       labels:{
           type: Array
       },
       counts:{
           type: Array
       
       },
       colors:{
           type: Array
       }
   },

   mounted(){
       this.renderChart({
           labels: Object.values(this.labels),
           datasets:[{
               data: this.counts,
               backgroundColor: this.colors,
           }]           
       }, {
            responsive: true,
            maintainAspectRatio: false,
            legend:{
                display: false               
            }
       })
   },
}
</script>
