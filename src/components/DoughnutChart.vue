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
                position: 'bottom',
                align: 'start'
            }
       })
       const sum = this.percents.reduce((a, b) => a + b, 0)
       var resTable = '<p>Всего: '+ sum +'</p><table style="width:100%">'
       for(let i=0; i<Object.values(this.labels).length; i++){
           resTable +='<tr><td>'+ Object.values(this.labels)[i] +'</td><td>'+(Object.values(this.percents)[i] !== 0 ? sum/Object.values(this.percents)[i]*100 : 0 )+'%</td><td>'+ Object.values(this.percents)[i] +'</td></tr>'
       }
resTable += '</table>'
let g=document.createElement('div')
g.setAttribute("id", "tableWrapper");
document.getElementById('pieChartImg').after(g)
g.innerHTML = resTable

   },
   beforeDestroy(){
       document.getElementById('tableWrapper').remove()
   }
}
</script>
