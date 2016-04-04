angular.module('starter.service', [])

.service('tipificaService', function (){

	this.listar = function(artigo, inciso){

            var multas = 
          [
            {artigo: '47', inciso: 'I', 	texto: 'Mercadejar sem autorização.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'II', 	texto: 'Mercadejar em desacordo com os termos de sua autorização.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'III', 	texto: 'Não se apresentar em rigorosas condições de asseio.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'IV', 	texto: 'Apresentar-se em veículo ou unidade autorizada em mau estado de conservação ou em condições precárias de higiene.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'V', 	texto: 'Não manter limpo o local de estacionamento.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'VI', 	texto: 'Utilizar buzinas, campainhas e outros meios ruidosos de propaganda.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'VII', 	texto: 'Não apresentar, quando exigidos, quaisquer dos documentos a que se refere o artigo 56 desta Lei.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'VIII', 	texto: 'Não manter, em local visível, a tabela de preços dos produtos comercializados exigida pelo art. 57 desta Lei.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'IX', 	texto: 'Comercializar produtos proibidos por esta Lei.', valor: 'R$ ', pontos: 2},
            {artigo: '47', inciso: 'X', 	texto: 'Perturbação da ordem pública, falta de urbanidade, incontinência pública.', valor: 'R$ 1566,00', pontos: 2},
            {artigo: '47', inciso: 'XI', 	texto: 'Uso de caixotes como assento ou para exposição de mercadoria sobre o passeio.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'XII', 	texto: 'Prejuízo do fluxo de pedestre na calçada.', valor: 'R$ 783,0', pontos: 2},
            {artigo: '47', inciso: 'XIII', 	texto: 'Ocupação não autorizada de área pública por qualquer equipamento fixo ou móvel diferente de tabuleiro, carrocinha e triciclo.', valor: 'R$ 3915,00', pontos: 2},
            {artigo: '54', inciso: 'I', 	texto: 'Perturbação da ordem pública, falta de urbanidade, incontinência pública, prática de crime ou contravenção no local do ponto fixo.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'II', 	texto: 'Permanência em local diferente do autorizado.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'III', 	texto: 'Mudança do ponto fixo sem prévia autorização.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'IV', 	texto: 'Inobservância do Regulamento Sanitário.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'V', 	texto: 'Uso de caixotes como assento ou para exposição de mercadorias sobre o passeio.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'VI', 	texto: 'Impedimento do livre trânsito nos passeios.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'VII', 	texto: 'Venda de mercadoria não permitida nesta Lei.', valor: 'R$ ', pontos: 5},
            {artigo: '54', inciso: 'VIII', 	texto: 'Venda de mercadoria não autorizada.', valor: 'R$ ', pontos: 5}
          ];


          	var selecionar = function(value){
          	if((value.artigo === artigo) && (value.inciso === inciso)){
          		return true;
          	}
          	}//fim fa função selecionar   


          	var multa = multas.filter(selecionar);

			return multa;
        }

}).

factory('loginFactory', ['$http', 'factoryAgente', '$state', function($http, factoryAgente, $state){
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
      var login = function(value){
          if ((value.matricula === document.getElementById('usuario').value) && (value.senha === document.getElementById('senha').value))
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
      $http.post('http://ccuanexos.herokuapp.com/vistorias/', data).then(function(res){
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
}]);

