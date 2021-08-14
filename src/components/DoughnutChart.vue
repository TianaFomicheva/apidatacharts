<script>
import { Doughnut } from 'vue-chartjs'
export default {
    extends: Doughnut,
   name: 'DoughnutChart',
   props:{
       labels:{
           type: Array
       },
       percents:{
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
               data: this.percents,
               backgroundColor: this.colors,
           }]
           

       }, {
            responsive: true,
            maintainAspectRatio: false
       })
   }
}
</script>