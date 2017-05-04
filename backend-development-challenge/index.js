var request = require('request');
var CookieMethods = require('./cookie');
var UrlManager = require('./urlManager');
let async = require('async');

async.waterfall([
    async.apply(getDataForPageNumber, 1, false),
    getAllPages

], function(err, results, totalAvailableCookies){
    var ordersToFulfill = [];
    results.forEach(function(result) {
        result.forEach(function(order) {
            if ( ! order.fulfilled && CookieMethods.orderHasCookie(order)){
                order.cookieCount = CookieMethods.getOrderCookieCount(order);
                ordersToFulfill.push(order);
            }

        })
    });
    sortOrders(ordersToFulfill);
    var fulfillementDetails = getFulfillmentDetails(ordersToFulfill, totalAvailableCookies);
    console.log(fulfillementDetails);
    process.exit(0);
});

function getFulfillmentDetails(ordersToFulfill, availableCookies){
    var ordersUnfulfilled = [];
    ordersToFulfill.forEach(order => {
        if (order.cookieCount > availableCookies) { 
            ordersUnfulfilled.push(order.id);
        } else {
            availableCookies -= order.cookieCount;
        }
    });
    return {
        unfulfilled_orders: ordersUnfulfilled.sort((a, b) => {return a < b ? -1 : 1;}),
        remaining_cookies: availableCookies
    };
}


function sortOrders(ordersToFulfill){

    ordersToFulfill.sort((a, b) => {
        var criteriaOne = b.cookieCount;
        var criteriaTwo = a.cookieCount;
        if (criteriaOne == criteriaTwo){
            criteriaOne = a.id;
            criteriaTwo = b.id;
        }
        return criteriaOne <= criteriaTwo ? -1 : 1;
    });
}

function getDataForPageNumber(number, onlyOrders, callback){
    var firstPageUrl = UrlManager.getUrlForPage(number);
    request(firstPageUrl, function(err, resp){
        if (err) callback(err);
        else {
            var body = resp.body;

            if (!body){
                callback(true);
            } else {
                body = JSON.parse(body);
                if (onlyOrders){
                    body = body.orders;
                }
                callback(null, body);
            }
        }
    });
}

function getAllPages(firstPage, callback){
    if (firstPage && firstPage.pagination){
        var totalNumberOfPages = firstPage.pagination.total;
        var totalAvailableCookies = firstPage.available_cookies;
        var resultsArray = [];
        //Over here I am creating a sort of fake array to use to make my async call
        for (var i = 0; i < totalNumberOfPages; i++){
            resultsArray.push(i+1);
        }

        async.map(resultsArray, function(index, cb) {
            getDataForPageNumber(index, true, cb);
        }, (err, results) => {
            callback(err, results, totalAvailableCookies);
        });
    } else {
        callback(null, []);
    }
}

