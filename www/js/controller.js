angular.module('starter.controllers', [])
/*
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


})*/

.controller('multasCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', function($scope, factoryAutorizado, $state, tipificaService){
      $scope.titulo = 'INSC. MUNICIPAL: ' + factoryAutorizado.getIM();
      $scope.lista = '';
      $scope.multa = '';

      //{artigo: '47', inciso: 'I',   texto: 'mercadejar sem autorização: dez', valor: 'R$ 783,00', pontos: 2}

      $scope.add = function(){
          var artigo = document.getElementById("artigo").value;
          var inciso = document.getElementById("inciso").value;
          var informa = tipificaService.listar(artigo, inciso);
          if(informa.length > 0){
            $scope.multa = {artigo: artigo, inciso: inciso}
            $scope.lista = 
            {
                artigo: 'Artigo: ' + artigo + ' Inciso: ' + inciso,
                texto: informa[0].texto,
                valor: 'Valor: ' + informa[0].valor,
                pontos: 'Pontos: ' + informa[0].pontos
            }
          }
          

      }

      $scope.clear = function(){
           $scope.multa = '';
           $scope.lista = '';
      }

      $scope.confirm = function(){
          factoryAutorizado.setMulta($scope.multa);
          alert("Inseridas com sucesso.");
          $scope.clear();         

      }

      $scope.exit = function(){
        return navigator.app.exitApp()
      }


}])

.controller('loginCtrl', ['$scope', 'factoryAgente', '$state', function($scope, factoryAgente, $state){
  var agentes = 
     [
        {nome: 'nieraldo', matricula: '2436723', ordem: 9560, dia: '04/04/2016', senha: '244265'},
        {nome: 'augusto', matricula: '2436582', ordem: 9561, dia: '04/04/2016', senha: '102442'}
     ];

     var login = function(value){
          if ((value.matricula === document.getElementById('usuario').value) && (value.senha === document.getElementById('senha').value))
          {
            return true;
          }
     }//fim do método login



    $scope.entrar = function(){
      var logado = agentes.filter(login);
                
          if(logado.length)
          {
            factoryAgente.set(logado[0].nome, logado[0].matricula, logado[0].ordem, logado[0].dia);
            $state.go('assentamento');

          }else{
            alert('usuario ou senha incorretos!')
          }
      }//fim do método entrar
  
}])

.controller('assentamentoCtrl', ['$scope', 'factoryAgente', 'factoryAutorizado', '$state', 'tipificaService', function($scope, factoryAgente, factoryAutorizado, $state, tipificaService){
      $scope.titulo = factoryAgente.getOrdem();
      $scope.clickInconformidade = false;
      $scope.clickConformidade = false;
      $scope.clickEncerrar = true;
      

    $scope.buscar = function(){

        document.getElementById('titular').value = 'carregando...'
        document.getElementById('situacao').value = 'carregando... '                     
        document.getElementById('preposto').value =  'carregando...'

          factoryAutorizado.extrair(document.getElementById('im').value);
          $scope.proteger = true;


    }//fim do método buscar

    $scope.limpar = function(){
      $scope.proteger = false;
      document.getElementById("im").value = '';
      document.getElementById("titular").value = '';
      document.getElementById("preposto").value = '';
      document.getElementById('situacao').value = '';
      console.log(factoryAutorizado.get());
    };//fim do método limpar

    $scope.selecionar = function(){
        if (document.getElementById('status').value == 'CONFORMIDADE') {
            $scope.clickConformidade = true;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
        }else{
            $scope.clickConformidade = false;
            $scope.clickInconformidade = true;
            $scope.clickEncerrar = false;
        }

        if (!document.getElementById('status').value){
            $scope.clickInconformidade = false;
            $scope.clickConformidade = false;
            $scope.clickEncerrar = true;
        }
    };//fim do método selecionar

    $scope.novaFiscalizacao = function(){
      $scope.clickInconformidade = false;
      $scope.clickConformidade = false;
      $scope.status = 'cal';
      $scope.limpar();
    };//fim do método novaFiscalização

    $scope.multar = function(){
      //teste
      $state.go('multas');      
    };//fim do método multar

    $scope.testar = function(){
      //teste
        console.log(tipificaService.listar('47', 'XIII'))
    };//fim do método testar

    $scope.encerrar = function(){
      ionic.Platform.exitApp();
    }

}])


.factory('factoryAgente', function(){
 
    var agente = {nome: '', matricula: '', ordem: 0, dia: ''};
     
    var get = function(){
      return agente;
    };

    var getOrdem = function(){
      return agente.ordem;
    }

    var set = function(nome, matricula, ordem, data){
      return agente =  {nome: nome, matricula: matricula, ordem: ordem, data: data};
    };

    return {
        get: get,
        set: set,
        getOrdem: getOrdem
    }
})

.factory('factoryAutorizado', function(){
   var autorizado = 
    {
      im: '',
      titular: 'cuzetao',
      preposto: '',
      cpf: '',
      local: '',
      situacao: '',
      conformidade: false,
      multas: []
    }

    var extrair = function(value){
      $.ajax(
            {
                    url: 'http://scca.rio.rj.gov.br/index.php/online?im=' + value,
                    type: 'GET',
                    success: function(res)
                      {
                                var headline = $(res.responseText).text();
                                var regexTitular = /Nome(\D)+(\s)+Data/g;
                                var regexCPF = /CPF(\w)+/g;
                                var regexLocal = /Local(\D)+(nº)?/g;
                                var regexStatus = /Situa(.)+(\s)+TITULAR/g
                                var nome = headline.match(regexTitular);
                                var cpfTitular = headline.match(regexCPF)
                                var localTitular = headline.match(regexLocal);
                                var statusTitular = headline.match(regexStatus);
                                  if(nome){
                                      document.getElementById('titular').value = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var titular = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var cpf = cpfTitular[0].replace('CPF', '').trim();
                                      var local = localTitular[0].replace('Local', '').replace('nº', '').trim();
                                      var situacao = statusTitular[0].replace('Situação', '').replace('TITULAR', '').trim();
                                      document.getElementById('situacao').value = situacao;
                                      
                                           if(nome[01]){
                                            var preposto =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                            set(value, titular, preposto, cpf, local, situacao,'');
                                            document.getElementById('preposto').value =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                          }else{
                                            var preposto = 'SEM PREPOSTO';
                                            set(value, titular, preposto, cpf, local, situacao, false);
                                            document.getElementById('preposto').value = 'SEM PREPOSTO';
                                          }
                                    }else{
                                      alert('IM não localizada!\nClique em Limpar para prosseguir.');
                                    }                                                           
                    }//fim do callback sucess
           });//fim do método ajax
    }//fim mo método extrair


    var set = function(im, titular, preposto, cpf, local, situacao, conformidade){
      return autorizado = {im: im, titular: titular, preposto: preposto, cpf: cpf, local: local, situacao: situacao, conformidade: conformidade, multas: []}
    }

    var setEstado = function(value){
      return autorizado.conformidade = value;
    }

    var setMulta = function(value){
      return autorizado.multas.push(value);
    }

    var get = function(){
      return autorizado;
    }

    var getIM = function(){
      return autorizado.im;
    }

    var getStatus = function(){
      return autorizado.situacao;
    }

    return {
      get: get,
      set: set,
      extrair: extrair,
      setEstado: setEstado,
      setMulta: setMulta,
      getIM: getIM,
      getStatus: getStatus
    }

});

