var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit"
var token = "2aeccb75933c65d7264bca4a522c2d6ba91e8970"
var query = "772 053"

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
.then(data=>{return filter ? data.suggestions.filter(item=> item.data.code.search(new RegExp(filter, "i")) !== -1 || item.data.name.search(new RegExp(filter, "i")) !== -1 ) : data.suggestions})
.then(result =>JSON.parse(JSON.stringify(result)))
.then(result => {cb(result)})
.catch(error => console.log("error", error))
}