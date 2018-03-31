let HomeApp =  angular.module('HomeApp', ["ngRoute"]);
let labels = [new Date(new Date().setDate(new Date().getDate()-6)).toLocaleDateString("fr-CA"),new Date(new Date().setDate(new Date().getDate()-5)).toLocaleDateString("fr-CA"),new Date(new Date().setDate(new Date().getDate()-4)).toLocaleDateString("fr-CA"),new Date(new Date().setDate(new Date().getDate()-3)).toLocaleDateString("fr-CA"),new Date(new Date().setDate(new Date().getDate()-2)).toLocaleDateString("fr-CA"),new Date(new Date().setDate(new Date().getDate()-1)).toLocaleDateString("fr-CA"),new Date(new Date().setDate(new Date().getDate())).toLocaleDateString("fr-CA")]
let purchases = null;
let currPurchase = null;

HomeApp.config(($routeProvider) => {
    $routeProvider
        .when("/", {
            templateUrl : "/Home/ControllCash.htm"
        })
        .when("/operations", {
            templateUrl : "/Home/AllCashOps.htm"
        })
        .when("/singlePurchase",{
            templateUrl : "/Home/SingleOperationInfo.htm"
        })
});
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 600000
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

HomeApp.controller('addPurchase',($scope, $http) => {
 $scope.message = "added ur purchase! :)";
    $scope.addpurchase = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition,error, options);
        }
    }
    $scope.getCharts = function (){
        if(purchases) {
            getDates();
            getCountPurch();
        }
    }
    function showPosition(position) {
        $scope.latitude = position.coords.latitude;
        $scope.longtitude = position.coords.longitude;
        console.log( $scope.longtitude)
        $http.post("/api/addPurchase", {
            "title": $scope.title_purchase,
            "description": $scope.description_purchase,
            "type": $scope.type_purchase,
            "ammount": $scope.ammount_purchase,
            "latitude": $scope.latitude,
            "longtitude": $scope.longtitude

        }).then((response)=>{
            if(response.data == "failure"){
                $scope.message = "error on ading! :(";
            }
            else {
                $scope.message = "added ur purchase! :)";
            }
            getPurchase($http);
        });
    }
});

HomeApp.controller('userPurchase', ($scope, $http,$rootScope)=> {
    if (purchases == null) {
    angular.element(document).ready(function () {
        getPurchase($http);
        $http.get("/api/user",{
        }).then((response)=>{
            $rootScope.username = response.data;
        })
    });
    }
});

HomeApp.controller('allPurchase', ($scope, $location, $http) => {
    if(purchases!=null){
    purchases.sort(function (a,b) {
        return new Date(b.date) - new Date(a.date);
    })}
    $scope.purchases = purchases;
    $scope.sortBy = function(){

           if($scope.sort_by=="Ціна"){
               $scope.purchases.sort(function (a, b) {
                    return (b.ammount) - (a.ammount);
                });
            }
            else if($scope.sort_by=="Тип"){
               $scope.purchases.sort(function (a, b) {
                    return (b.type) - (a.type);
               });
            }
            else{
               $scope.purchases.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });
            }
    }

    $scope.getPurchasesUser = function(id){
        $location.path( "/singlePurchase" );
        purchases.forEach(item => {

            if(item._id == id) currPurchase = item;

        })




    }



});

HomeApp.controller('singlePurchase',($scope, $http) =>{

    $scope.img="https://cdn2.hubspot.net/hubfs/322787/Mychefcom/images/BLOG/Header-Blog/photo-culinaire-pexels.jpg";

    $scope.getSinglePurchase = function(){
        $scope.purchase = currPurchase;
        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: $scope.purchase.latitude, lng: $scope.purchase.longtitude},
            zoom: 15
        });
        var marker = new google.maps.Marker({
            position: {lat: $scope.purchase.latitude, lng: $scope.purchase.longtitude},
            map: map,
            title: 'purchase'
        });
        console.log($scope.purchase.latitude+ " " +$scope.purchase.longtitude)
        console.log($scope.purchase)
        switch($scope.purchase.type)    {
            case("Їжа"):{$scope.img="https://cdn2.hubspot.net/hubfs/322787/Mychefcom/images/BLOG/Header-Blog/photo-culinaire-pexels.jpg"; break;}
            case("Одяг"):{$scope.img="https://a.suitsupplycdn.com/image/upload/v1519740025/suitsupply/homepage/ss18/week09/v2/newarrivals_858.jpg"; break;}
            case("Розваги"):{$scope.img="https://www.partners-in-harvest.org/wp-content/uploads/2017/12/p1500669900108.jpg";break;}
            default:{$scope.img="https://cdn2.hubspot.net/hubfs/322787/Mychefcom/images/BLOG/Header-Blog/photo-culinaire-pexels.jpg"; break;}
        }

    }

})

HomeApp.controller('addIncome',($scope,$http) =>{
    $scope.message = "added ur income! :)";
    $scope.addincome = function () {
        $http.post("/api/addIncome", {
            "title": $scope.title_income,
            "description": $scope.description_income,
            "type": $scope.type_income,
            "ammount": $scope.ammount_income,
        }).then(function(response) {
            if(response.data == "failure"){
                $scope.message = "error on ading! :(";
            }
            else {
                $scope.message = "added ur income! :)";
            }
            getPurchase($http);

        });

    }

})

function getPurchase($http){
    $http.get("/api/userPurchase", {}).then(function (response) {
        purchases = response.data;
        purchases.forEach(function(x){
            if(x.date)x.date = x.date.substring(0,10)

            switch(x.type){
                case("Їжа"):{x.img="https://cdn2.hubspot.net/hubfs/322787/Mychefcom/images/BLOG/Header-Blog/photo-culinaire-pexels.jpg"; break;}
                case("Одяг"):{x.img="https://a.suitsupplycdn.com/image/upload/v1519740025/suitsupply/homepage/ss18/week09/v2/newarrivals_858.jpg"; break;}
                case("Розваги"):{x.img="https://www.partners-in-harvest.org/wp-content/uploads/2017/12/p1500669900108.jpg";break;}
                default:{x.img="https://cdn2.hubspot.net/hubfs/322787/Mychefcom/images/BLOG/Header-Blog/photo-culinaire-pexels.jpg"; break;}
            }
        });
        getDates();
        getCountPurch();
    });
}


function getDates(){
    let data  = [0,0,0,0,0,0,0];
    purchases.forEach(function(x){
        if(x.date){

        switch(x.date){
            case(new Date(new Date().setDate(new Date().getDate())).toLocaleDateString("fr-CA")):{data[6]+=parseInt(x.ammount);  break;}
            case(new Date(new Date().setDate(new Date().getDate()-1)).toLocaleDateString("fr-CA")):{data[5]+=parseInt(x.ammount); break;}
            case(new Date(new Date().setDate(new Date().getDate()-2)).toLocaleDateString("fr-CA")):{data[4]+=parseInt(x.ammount); break;}
            case(new Date(new Date().setDate(new Date().getDate()-3)).toLocaleDateString("fr-CA")):{data[3]+=parseInt(x.ammount); break;}
            case(new Date(new Date().setDate(new Date().getDate()-4)).toLocaleDateString("fr-CA")):{data[2]+=parseInt(x.ammount); break;}
            case(new Date(new Date().setDate(new Date().getDate()-5)).toLocaleDateString("fr-CA")):{data[1]+=parseInt(x.ammount); break;}
            case(new Date(new Date().setDate(new Date().getDate()-6)).toLocaleDateString("fr-CA")):{data[0]+=parseInt(x.ammount); break;}
        }}
    });
   createGraph(data,"myChart","Money spent");
}

function getCountPurch(){
    let data  = [0,0,0,0,0,0,0];
    purchases.forEach(function(x){
        if(x.date){
            switch(x.date){
                case(new Date(new Date().setDate(new Date().getDate())).toLocaleDateString("fr-CA")):{data[6]++; break}
                case(new Date(new Date().setDate(new Date().getDate()-1)).toLocaleDateString("fr-CA")):{data[5]++; break;}
                case(new Date(new Date().setDate(new Date().getDate()-2)).toLocaleDateString("fr-CA")):{data[4]++; break;}
                case(new Date(new Date().setDate(new Date().getDate()-3)).toLocaleDateString("fr-CA")):{data[3]++; break;}
                case(new Date(new Date().setDate(new Date().getDate()-4)).toLocaleDateString("fr-CA")):{data[2]++; break;}
                case(new Date(new Date().setDate(new Date().getDate()-5)).toLocaleDateString("fr-CA")):{data[1]++; break;}
                case(new Date(new Date().setDate(new Date().getDate()-6)).toLocaleDateString("fr-CA")):{data[0]++; break;}
            }}
    });
    createGraph(data,"myChartCount","Purchases Count");
}

function createGraph(data,elementName,title){
    try {
        let ctx = document.getElementById(elementName).getContext('2d');
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    backgroundColor: '#a624c2',
                    borderColor: '#c54cd6',
                    data: data,
                }]
            },

            options: {}
        });
    }
    catch(err){
        //log her :)
    }
}



