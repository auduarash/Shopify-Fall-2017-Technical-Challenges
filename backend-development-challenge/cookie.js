

module.exports.orderHasCookie =  function(order){
    var hasCookie = false;
    if (order.products && order.products.length){
        order.products.forEach(product => { 
            if (product.title === 'Cookie' && product.amount > 0) {
                hasCookie = true;
            }
        });
    }
    return hasCookie;
}

module.exports.getOrderCookieCount =  function(order){
    var cookieCount = 0;
    if (order.products && order.products.length){
        order.products.forEach(product => { 
            if (product.title === 'Cookie' && product.amount > 0) {
                cookieCount += product.amount;
            }
        });
    }
    return cookieCount;
}