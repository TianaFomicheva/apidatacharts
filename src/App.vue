<template>
  <div id="app">
  </div>
</template>

<script>
import { getData } from './api/api.js'

export default {
  name: 'App',
  components: {

  },
  data(){
    return{
      apiData:[],
      typeGroups:{}
    }
  },

  
  created(){
    getData(data=>{this.apiData.push(data); this.formatData(data)})
    
    // console.log(this.apiData)
    
  },
  OPTIONS_CODES:{
    "0": "подразделений ФМС",
    "1": "ГУВД или МВД региона",
    "2":"УВД или ОВД района или города",
    "4": "отделений полиции"
  },
  computed:{
    itemsGroups(){

      console.log(this.apiData.filter(item => Object.keys(this.$options.OPTIONS_CODES).includes(item.data.type)))
      return this.apiData.filter(item => Object.keys(this.$options.OPTIONS_CODES).includes(item.data.type))

    }
  },
  methods:{
    formatData(data){
 const types = Object.keys(this.$options.OPTIONS_CODES)
  const emptyArr = []
  for(var i = 0; i<types.length; i++){
emptyArr.push([])
  }
 for(var j = 0; j<types.length; j++){
   this.typeGroups[types[j]] = emptyArr[j]
  
 }
 console.log( this.typeGroups)
    const parsedData = JSON.parse(JSON.stringify(data)).map(data=>data.data); 
    parsedData.map(item=>{
    Object.entries(this.typeGroups).forEach(([key,value])=>{if(key===item.type.toString()){value.push(item)}})

    })
     console.log(this.typeGroups)
   
    

    }
}
}
</script>

