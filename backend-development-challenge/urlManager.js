

module.exports.getUrlForPage = function(pageNumber){
    return 'https://backend-challenge-fall-2017.herokuapp.com/orders.json?page='+pageNumber;
}