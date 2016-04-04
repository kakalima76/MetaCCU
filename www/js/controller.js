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

.controller('multasCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', function($scope, factoryAutorizado, $state, tipificaService, loginFactory){
      $scope.titulo = 'INSC. MUNICIPAL: ' + factoryAutorizado.getIM();
      $scope.lista = '';
      $scope.multa = '';

      $scope.add = function(){
          var artigo = document.getElementById("artigo").value;
          var inciso = document.getElementById("inciso").value;
          var informa = tipificaService.listar(artigo, inciso);
          if(informa.length > 0){
            $scope.multa = '(artigo: ' + artigo   + ' inciso: ' + inciso + ')';
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
          loginFactory.criar(factoryAutorizado.get());
          $scope.multa = '';
          $scope.lista = '';
          $state.go('assentamento');
      }

      $scope.confirm = function(){
          factoryAutorizado.setMulta($scope.multa);
          alert("Inseridas com sucesso.");       
      }

      $scope.exit = function(){
        return navigator.app.exitApp()
      }


}])

.controller('loginCtrl', ['$scope',  '$state', 'loginFactory', function($scope, $state, loginFactory){
    $scope.entrar = function(){
      loginFactory.logar();             
    }//fim do método entrar
  
}])

.controller('assentamentoCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', 'factoryAgente', function($scope,  factoryAutorizado, $state, tipificaService, loginFactory, factoryAgente){
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

    var conformidade = function(){
      //vou aproveitar e atualizar o logado no objeto autorizado
      
      var flag;
      if(document.getElementById('status').value === 'INCONFORMIDADE'){
        flag = false;
        factoryAutorizado.setEstado(flag);
      }else{
        flag = true;
        factoryAutorizado.setEstado(flag);
        
      }

    }//fim dda função conformidade

    var logado = function(){
        var usuario = factoryAgente.get();
        factoryAutorizado.setNome(usuario.nome);
        factoryAutorizado.setMatricula(usuario.matricula);
        factoryAutorizado.setOrdem(usuario.ordem);
        factoryAutorizado.setData(usuario.data);

    }

    $scope.novaFiscalizacao = function(){
      logado();
      conformidade();
      $scope.limpar();
      loginFactory.criar(factoryAutorizado.get());
    };//fim do método novaFiscalização

    $scope.multar = function(){
      logado();
      conformidade();
      $state.go('multas');      
    };//fim do método multar

    $scope.testar = function(){
      //teste
        //loginFactory.logar();
    };//fim do método testar

    $scope.encerrar = function(){
      $state.go('login');
      ionic.Platform.exitApp();
    }

}])


.factory('factoryAgente', function(){
 
    var agente = {nome: '', matricula: '', ordem: 0, data: ''};
     
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
      nome: '', 
      matricula: '', 
      ordem: 0, 
      data: '',
      im: '',
      titular: '',
      preposto: '',
      cpf: '',
      local: '',
      situacao: '',
      conformidade: false,
      multas: []
    }

    var setNome = function(value){
      return autorizado.nome = value;
    }

    var setMatricula = function(value){
      return autorizado.matricula = value;
    }

    var setOrdem = function(value){
      return autorizado.ordem = value;
    }

    var setData = function(value){
      return autorizado.data = value;
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
      return autorizado =
      {
        nome: '',
        matricula: '',
        ordem: 0,
        data: '',
        im: im, 
        titular: titular, 
        preposto: preposto, 
        cpf: cpf, 
        local: local, 
        situacao: situacao, 
        conformidade: conformidade, 
        multas: ''}
    }

    var setEstado = function(value, nome, matricula, ordem, data){
      return  autorizado.conformidade = value;

    }

    var setMulta = function(value){
      var aux = get();
      return (aux.multas += value).trim();
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
      setNome: setNome,
      setMatricula: setMatricula,
      setOrdem: setOrdem,
      setData: setData,
      extrair: extrair,
      setEstado: setEstado,
      setMulta: setMulta,
      getIM: getIM,
      getStatus: getStatus
    }

});

