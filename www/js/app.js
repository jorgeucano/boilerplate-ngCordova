// Ionic Starter App

var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngRoute'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($routeProvider){
  $routeProvider
    .when("/", {
      controller: "MyCtrl",
      templateUrl:"templates/main.html"
    })
    .when("/drop",{
      controller: "DropCtrl",
      templateUrl:"templates/drop.html"
    })
    .when("/create",{
      controller: "CreateCtrl",
      templateUrl:"templates/create.html"
    })
    .when("/list",{
      controller: "listCtrl",
      templateUrl:"templates/list.html"
    })
    .when("/add",{
      controller: "AddCtrl",
      templateUrl:"templates/add.html"
    })
    .otherwise({ redirectTo: '/' })
})


.controller('MyCtrl', function($scope, $ionicPlatform, $cordovaSQLite, $http, $location) {

  //inicializacion
  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser or mobile



  //create de table 
  var query = "CREATE TABLE cuestionario(ID INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, opcion TEXT NOT NULL, sync INT NOT NULL);";
  $cordovaSQLite.execute(db, query).then(function(res) {
    $scope.test = "create table";
  }, function (err) {
    //if exist
    console.log(err);

    //sync to server
      var query = "select * from cuestionario where sync = 0";
      $cordovaSQLite.execute(db, query, []).then(function(res) {
        $scope.test = "";
        for (var i = 0; i < res.rows.length; i++) {
            
            var data = {email : res.rows.item(i).email, opcion : res.rows.item(i).opcion };
            $http.post("myserver.php", data, function(response){
              if (response == 1){
                  var update = "update cuestionario set sync = 1 where ID = " + res.rows.item(i).ID;
                  $cordovaSQLite.execute(db, update).then(function(res) {
                    console.log("insert fine");
                  }, function (err) {
                    console.log(err);
                  });
                }
            });
        }
      }, function (err) {
        //fail execute query
        console.log(err);
      });
    //sync 

  });


  $scope.redirectTo = function (redirect){
      $location.path(redirect);
  };


})

.controller('DropCtrl', function($scope, $ionicPlatform, $cordovaSQLite, $http) {

  //inicializacion
  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser or mobile
  $scope.dropTable = function (){
    var query = "DROP TABLE test_table";
    $cordovaSQLite.execute(db, query).then(function(res) {
      $scope.test ="drop tablecorrect";
    }, function (err) {
      console.log(err);
    });
  }
})

.controller('CreateCtrl', function($scope, $ionicPlatform, $cordovaSQLite, $http) {

  //inicializacion
  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser or mobile

  $scope.createTable = function(){
    var query = "CREATE TABLE test_table(ID INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, opcion TEXT NOT NULL, sync INT NOT NULL);";
    $cordovaSQLite.execute(db, query).then(function(res) {
      $scope.test = "create table";
    }, function (err) {
      $scope.test = err;
    });
  }

})

.controller('listCtrl', function($scope, $ionicPlatform, $cordovaSQLite, $http) {

  //inicializacion
  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser or mobile

  $scope.list = function(){
    var query = "select * from test_table";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      $scope.test = "";
      for (var i = 0; i < res.rows.length; i++) {
          console.log(res.rows.item(i));
      }
      $scope.test = res.rows;
    }, function (err) {
      console.log(err);
    });
  }
})

.controller('AddCtrl', function($scope, $ionicPlatform, $cordovaSQLite, $http) {

  //inicializacion
  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser or mobile

  $scope.insert = function(){
    var query = "INSERT INTO test_table (email, opcion, sync) VALUES (?,?, 0)";
    $cordovaSQLite.execute(db, query, [$scope.campo1, $scope.campo2]).then(function(res) {
      $scope.test = "insert fine";
      $scope.email = "";
      $scope.opcion = "";
    }, function (err) {
      console.log(err);
    });
  }
  
})
;