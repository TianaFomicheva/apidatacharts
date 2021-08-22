var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit"
var query = "772 053"

var options = {
    method: "POST",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + process.env.VUE_APP_TOKEN
    },
    body: JSON.stringify({query: query})
}

export  const getData = async ()=> {
    return fetch(url, options)
    .then(response=>response.json()
    .catch(e=>console.log(e)))
}