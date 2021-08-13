var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit";
var token = "2aeccb75933c65d7264bca4a522c2d6ba91e8970";
var query = "772 053";

var options = {
    method: "POST",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + token
    },
    body: JSON.stringify({query: query})
}

export const getData = (cb, filter = null)=> {
 fetch(url, options)
.then(response => response.json())
.then(data=>{return filter ? data.suggestions.filter(item=> item.data.type == filter.toString() || item.data.name.indexOf(filter) !== -1 ) : data.suggestions})
.then(result => {console.log(result);cb(result)})
.catch(error => console.log("error", error))
}