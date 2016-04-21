angular.module('starter.controllers', [])

.controller('multasCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', 'factoryPontos', function($scope, factoryAutorizado, $state, tipificaService, loginFactory, factoryPontos){
      $scope.titulo = 'INSC. MUNICIPAL: ' + factoryAutorizado.getIM();
      $scope.lista = '';
      $scope.multa = '';

      $scope.add = function(){
          var artigo = document.getElementById("artigo").value;
          var inciso = document.getElementById("inciso").value;
          var informa = tipificaService.listar(artigo, inciso);
          if(informa.length > 0){
            $scope.pontos = informa[0].pontos;
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

      $scope.clear = function(){//atual savalr()
          loginFactory.criar(factoryAutorizado.get());
          $scope.multa = '';
          $scope.lista = '';
          document.getElementById('artigo').selectedIndex = 0;
          document.getElementById('inciso').selectedIndex = 0;
          $state.go('assentamento');
          
      }

      $scope.confirm = function(){
          var artigo = document.getElementById("artigo").value;
          var inciso = document.getElementById("inciso").value;
          var informa = tipificaService.listar(artigo, inciso);
          if(informa.length > 0){
            $scope.pontos += factoryPontos.getPontos();
            factoryPontos.setPontos($scope.pontos);
            factoryAutorizado.setMulta($scope.multa);
            factoryAutorizado.setPontos($scope.pontos);
            alert("Inseridas com sucesso.");       
          }
      }

      $scope.exit = function(){
        return navigator.app.exitApp()
      }


}])

.controller('vistoriaCtrl', ['$http','factoryVistoria', '$scope', 'factoryAgente', 'factoryLocaliza', '$cordovaCamera', function($http, factoryVistoria, $scope, factoryAgente, factoryLocaliza, $cordovaCamera){
  $scope.testar = function(){
    var agente = factoryAgente.get();
    var local = factoryLocaliza.get();
    var numero = document.getElementById('numero').value;
    var servico = document.getElementById('servico').value;
    var acao = document.getElementById('acao').value;
    var comentario = document.getElementById('comentarios').value;


    vistoria = 
    {
      numero: (numero || ''),
      servico: (servico || ''),
      acao: (acao || ''),
      comentario: (comentario || ''),
      hora: (local.hora || ''),
      latitude: (local.latitude || 0),
      longitude: (local.longitude || 0)
    }
    
    factoryVistoria.set(agente.ordem, agente.nome, agente.matricula, vistoria.numero, vistoria.servico, vistoria.acao, vistoria.comentario, vistoria.hora, vistoria.latitude, vistoria.longitude);
    factoryVistoria.save(factoryVistoria.get());
  }

  $scope.tirarFoto = function(){
     var options =
    {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation: false
    };


    $cordovaCamera.getPicture(options)
    .then(function(data){
     var agente = factoryAgente.get();
     var documento = document.getElementById('numero').value;

      var foto = 
        {
          agente: agente.nome,
          ordem: agente.ordem,
          data: agente.data,
          documento: documento,
          foto: data
        }

      var promisse = $http.post('https://ccuanexos.herokuapp.com/imagem', foto);
      promisse.then(function(data){
      })

    }, function(err){
      alert('Não foi possível salvar a foto, tente novamente.')
    })
  }

}])

.controller('loginCtrl', ['$scope',  '$state', 'loginFactory', function($scope, $state, loginFactory){
    $scope.entrar = function(){
      loginFactory.logar();             
    }//fim do método entrar
  
}])


.controller('assentamentoCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', 'factoryAgente', 'factoryLocaliza', 'factoryPontos', function($scope,  factoryAutorizado, $state, tipificaService, loginFactory, factoryAgente, factoryLocaliza, factoryPontos){
      $scope.titulo = factoryAgente.getOrdem();
      $scope.clickInconformidade = false;
      $scope.clickConformidade = false;
      $scope.clickEncerrar = true;
      
    $scope.buscar = function(){

        document.getElementById('titular').value = 'carregando...'
        document.getElementById('situacao').value = 'carregando... '                     
        document.getElementById('preposto').value =  'carregando...'

          factoryAutorizado.extrair(document.getElementById('im').value);
          factoryLocaliza.localiza();
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
        if (document.getElementById('status').value == 'INCONFORMIDADE') {
            $scope.clickConformidade = false;
            $scope.clickInconformidade = true;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
        }else if (document.getElementById('status').value == 'VISTORIA'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = true
        }else if (!document.getElementById('status').value){
            $scope.clickInconformidade = false;
            $scope.clickConformidade = false;
            $scope.clickEncerrar = true;
            $scope.clickVistoria = false;

        }else{
            $scope.clickConformidade = true;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
        }
    };//fim do método selecionar

    var conformidade = function(){
      //vou aproveitar e atualizar o logado no objeto autorizado
      
      var flag;
      if(document.getElementById('status').value === 'INCONFORMIDADE'){
        flag = 'INCONFORME';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'CONFORMIDADE'){
        flag = 'CONFORME';
        factoryAutorizado.setEstado(flag);
      }else {
        flag = 'AUSENTE';
        factoryAutorizado.setEstado(flag);
      }

    }//fim dda função conformidade

    var logado = function(){
        var local = factoryLocaliza.get();
        var usuario = factoryAgente.get();
        factoryAutorizado.setNome(usuario.nome);
        factoryAutorizado.setMatricula(usuario.matricula);
        factoryAutorizado.setOrdem(usuario.ordem);
        factoryAutorizado.setData(usuario.data);
        factoryAutorizado.setLatitude(local.latitude);
        factoryAutorizado.setLongitude(local.longitude);
        factoryAutorizado.sethoraAutuacao(local.hora);

    }

    $scope.novaFiscalizacao = function(){
      logado();
      conformidade();
      $scope.limpar();
      loginFactory.criar(factoryAutorizado.get());
    };//fim do método novaFiscalização

    $scope.multar = function(){
      $scope.multas = 0;
      factoryPontos.setPontos(0);
      logado();
      conformidade();
      $state.go('multas');      
    };//fim do método multar

    $scope.testar = function(){
      //teste
        //loginFactory.logar();
    };//fim do método testar

    $scope.vistoriar = function(){
    factoryLocaliza.localiza();
    $state.go('vistoria')

  }//fim do método vistoriar

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
      multas: '',
      latitude: '',
      longitude: '',
      horaAutuacao: '',
      pontos: 0
    }

    var setLatitude = function(value){
      return autorizado.latitude = value;
    }

    var setLongitude = function(value){
      return autorizado.longitude = value;
    }

    var sethoraAutuacao = function(value){
      return autorizado.horaAutuacao = value;
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
                                var regexTuap = /[0-9]{2}-[0-9]{2}-[0-9]{4}[0-9]{2}-[0-9]{2}-[0-9]{4}/g
                                var nome = headline.match(regexTitular);
                                var cpfTitular = headline.match(regexCPF)
                                var localTitular = headline.match(regexLocal);
                                var statusTitular = headline.match(regexStatus);
                                var tuap = headline.match(regexTuap);
                                  if(nome){
                                      document.getElementById('titular').value = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var titular = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var cpf = cpfTitular[0].replace('CPF', '').trim();
                                      var local = localTitular[0].replace('Local', '').replace('nº', '').trim();

                                      if(tuap){
                                        var situacao = statusTitular[0].replace('Situação', '').replace('TITULAR', '').trim() + ' (ÚLT. TUAP PAGA: ' + (tuap[0].substring(10,20) || '') +')';
                                      }else{
                                        var situacao = statusTitular[0].replace('Situação', '').replace('TITULAR', '').trim()
                                      }
                                      
                                      


                                      document.getElementById('situacao').value = situacao;
                                      
                                           if(nome[01]){
                                            var preposto =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                            set(value, titular, preposto, cpf, local, situacao,'');
                                            document.getElementById('preposto').value =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                          }else{
                                            var preposto = 'SEM PREPOSTO';
                                            set(value, titular, preposto, cpf, local, situacao, '');
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
        multas: '',
        latitude: '',
        longitude: '',
        horaAutuacao: '',
        pontos: 0
      }
    }

    var setPontos = function(value){
      return autorizado.pontos = value;
    }

    var getPontos = function(){
      return autorizado.pontos;
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
      getStatus: getStatus,
      setLatitude: setLatitude,
      setLongitude: setLongitude,
      sethoraAutuacao: sethoraAutuacao,
      getPontos: getPontos,
      setPontos: setPontos
    }

});

