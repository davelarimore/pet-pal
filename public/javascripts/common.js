function getQueryVariable(variable) {
    const params = window.location.search.substring(1).split("&");
    let param = "";
    params.forEach(element => {
        let pair = element.split("=");
        if (pair[0] == variable){param = pair[1];}
    });
    return(param);
}