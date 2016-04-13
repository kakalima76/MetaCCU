angular.module('starter.service', [])

.service('tipificaService', function (){

	this.listar = function(artigo, inciso){

            var multas = 
          [
            {artigo: '47', inciso: 'II', 	texto: 'Mercadejar em desacordo com os termos de sua autorização.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'III', 	texto: 'Não se apresentar em rigorosas condições de asseio.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'IV', 	texto: 'Apresentar-se em veículo ou unidade autorizada em mau estado de conservação ou em condições precárias de higiene.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'V', 	texto: 'Não manter limpo o local de estacionamento.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'VI', 	texto: 'Utilizar buzinas, campainhas e outros meios ruidosos de propaganda.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'VII', 	texto: 'Não apresentar, quando exigidos, quaisquer dos documentos a que se refere o artigo 56 desta Lei.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'VIII', 	texto: 'Não manter, em local visível, a tabela de preços dos produtos comercializados exigida pelo art. 57 desta Lei.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'IX', 	texto: 'Comercializar produtos proibidos por esta Lei.', valor: 'R$ ', pontos: 5},
            {artigo: '47', inciso: 'X', 	texto: 'Perturbação da ordem pública, falta de urbanidade, incontinência pública.', valor: 'R$ 1566,00', pontos: 5},
            {artigo: '47', inciso: 'XI', 	texto: 'Uso de caixotes como assento ou para exposição de mercadoria sobre o passeio.', valor: 'R$ 391,50', pontos: 5},
            {artigo: '47', inciso: 'XII', 	texto: 'Prejuízo do fluxo de pedestre na calçada.', valor: 'R$ 783,0', pontos: 5},
            {artigo: '47', inciso: 'XIII', 	texto: 'Ocupação não autorizada de área pública por qualquer equipamento fixo ou móvel diferente de tabuleiro, carrocinha e triciclo.', valor: 'R$ 3915,00', pontos: 2},
            {artigo: '54', inciso: 'I', 	texto: 'Perturbação da ordem pública, falta de urbanidade, incontinência pública, prática de crime ou contravenção no local do ponto fixo.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'II', 	texto: 'Permanência em local diferente do autorizado.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'III', 	texto: 'Mudança do ponto fixo sem prévia autorização.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'IV', 	texto: 'Inobservância do Regulamento Sanitário.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'V', 	texto: 'Uso de caixotes como assento ou para exposição de mercadorias sobre o passeio.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'VI', 	texto: 'Impedimento do livre trânsito nos passeios.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'VII', 	texto: 'Venda de mercadoria não permitida nesta Lei.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'VIII', 	texto: 'Venda de mercadoria não autorizada.', valor: 'R$ R$ 391,50', pontos: 5}
          ];


          	var selecionar = function(value){
          	if((value.artigo === artigo) && (value.inciso === inciso)){
          		return true;
          	}
          	}//fim fa função selecionar   


          	var multa = multas.filter(selecionar);

			return multa;
        }

})

.factory('loginFactory', ['$http', 'factoryAgente', '$state', function($http, factoryAgente, $state){
    var agentes = '';
    var get = function(){
      return agentes;
    }

    var set = function(value){
      return agentes = value;
    }

    var logar = function(){
      var agentes;
      var logado;


      $http.get('http://ccuanexos.herokuapp.com/agentes/').then(function(res){
      var agentes = res.data;
      var data = new Date();
      var dia = data.getDate();
      var mes = data.getMonth();
      var ano = data.getFullYear().toString();

      if(dia < 10){
        var dia = '0' + data.getDate().toString();
      }else{
        var dia = data.getDate().toString();
      }

      if((mes + 1) < 10){
        var mes = '0' + (data.getMonth() + 1).toString();
      }else{
        var mes = (data.getMonth() + 1).toString();
      }

      var dia = (dia+mes+ano);

      var login = function(value){
          if ((value.matricula === document.getElementById('usuario').value) 
            && (value.senha === document.getElementById('senha').value)
            && (value.data === dia))
          {
            return true;
          }
     }//fim do método login

     logado = agentes.filter(login);
     if(logado.length)
      {
        factoryAgente.set(logado[0].nome, logado[0].matricula, logado[0].ordem, logado[0].data);
        $state.go('assentamento');
        }else{
        alert('usuario ou senha incorretos!')
      }

      }), function(err){
        console.error('Erro');
      }

    }//fim do método logar

    var criar = function(data){
      $http.post('http://ccuanexos.herokuapp.com/autorizado/', data).then(function(res){
        //console.log(res.data)
      }), function(err){
        alert('Sem conexão!!!');
      }
    }//fim do método criar

    return {
      logar: logar,
      get: get,
      set: set,
      criar: criar
    }
}])

.factory('factoryLocaliza', ['$cordovaGeolocation', function($cordovaGeolocation){
  var local = 
  {
      latitude: '',
      longitude: '',
      hora: ''
  }

  var set = function(latitude, longitude, hora){
      return local = 
      {
        latitude: latitude,
        longitude: longitude,
        hora: hora
      }
  }

  var get = function(){
    return local;
  }

  var localiza = function(){
      var posOptions = {timeout: 10000, enableHighAccuracy: true}
      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position)
      {
          var lat  = position.coords.latitude
          var long = position.coords.longitude
          var data = Date();
          set(lat, long, data);
         
      }, function(err) {alert('Impossível geolocalizar.');})
  }

  return {
    set: set,
    get: get,
    localiza: localiza
  }


}])

.factory('factoryPontos', [function(){
    var pontos = 0;

    var setPontos = function(value){
      return pontos = value;
    }

    var getPontos = function(){
      return pontos;
    }

    return {
      setPontos: setPontos,
      getPontos: getPontos
    }

}])

.factory('factoryVistoria', ['$http', '$state', function($http, $state){


  var vistoria = 
{
  ordem: '',
  agente: '',
  matricula: '',
  numero: '',
  servico: '',
  acao: '',
  comentario: '',
  hora: '',
  latitude: 0,
  longitude: 0
}


var set = function(ordem, agente, matricula, numero, servico, acao, comentario, hora,  latitude, longitude){
    return vistoria = 
    {
      ordem: (ordem || ''),
      agente: agente,
      matricula: matricula,
      numero: (numero || ''),
      servico: (servico || ''),
      acao: (acao || ''),
      comentario: (comentario || ''),
      hora: (hora || ''),
      latitude: (latitude || 0),
      longitude: (longitude || 0)
    }
  
}


var get = function(){
  return vistoria;
}

var save = function(data){
  $http.post('http://ccuanexos.herokuapp.com/vistoria/', data).then(function successCallback(response) {
    $state.go('assentamento');
  }, function errorCallback(response) {
    alert('Não foi possível salvar, tente novamente.');
  });
}

return {
  get: get,
  set: set,
  save: save
}

}])