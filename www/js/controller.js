angular.module('starter.controllers', [])

.controller('chamadoCtrl', function($scope, $cordovaGeolocation) {

	$scope.hide = true;
  

  $scope.show = function(){
  $scope.hide = false;
  $scope.data = Date(); 
  document.getElementById("titulo").innerHTML = "<center>data e horário da fiscalização</center>";           

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function (position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
                var latLng = new google.maps.LatLng(lat, long);
                var mapOptions = {
                	center: latLng,
                	zoom: 15,
                	mapTypeId: google.maps.MapTypeId.ROADMAP
                }

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


              }, function(err) {
                // error
          });
    
     }//function show end


      $scope.reload = function(){
      $scope.hide = true;
      document.getElementById("map").innerHTML = "";
      document.getElementById("titulo").innerHTML = "";
      document.getElementById("chamado").value = "";
      $scope.data = '';

      }


})

.controller('multasCtrl', function($scope){
      

      $scope.lista = [];

      $scope.add = function(){
          var artigo = document.getElementById("artigo");
          var inciso = document.getElementById("inciso");
          var multa = 
          {
            artigo: artigo.value,
            inciso: inciso.value
          }
            $scope.lista.push(multa);
      }

      $scope.clear = function(){
           $scope.lista = [];
      }

      $scope.confirm = function(){
          alert("Inseridas com sucesso.");
          $scope.lista = [];
      }

      $scope.exit = function(){
        return navigator.app.exitApp()
      }

})

.controller('assentamentoCtrl', function($scope){
    var ambulante = document.getElementById("im");

    $scope.buscar = function(){
      if(ambulante.value === '08008080'){
         $scope.nome = 'FULANO DE TAL'
      }else{
        alert('Não localizado.');
      }
             
    }

    $scope.limpar = function(){
      document.getElementById("im").value = '';
      document.getElementById("nome").value = '';
    }
    
})


.controller('loginCtrl', function($scope){
  
})