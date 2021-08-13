<script>
import { Pie } from 'vue-chartjs'
export default {
    extends: Pie,
   name: 'PieChart',
   props:{
       labels:{
           type: Array
       },
       percents:{
           type: Array
       }
   },

   mounted(){
       console.log(JSON.parse(JSON.stringify(this.percents) ))
       this.renderChart({
           labels: Object.values((this.labels)),
           datasets:[{
               data: JSON.parse(JSON.stringify(this.percents))
           }]
           

       }, {
            responsive: true,
            maintainAspectRatio: false
       })
   }
}
</script>