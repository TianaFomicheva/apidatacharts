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
            maintainAspectRatio: false,
            legend:{
                display: false               
            }
       })
//        const sum = this.percents.reduce((a, b) => a + b, 0)



   },

}
</script>
