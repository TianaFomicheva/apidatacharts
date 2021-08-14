<script>
import { Bar } from 'vue-chartjs'
export default {
    extends: Bar,
   name: 'BarChart',
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
            },
            title: {
        display: true,
        text: 'Столбчатая диаграмма'
      }
    
       
   })
   }
}
</script>