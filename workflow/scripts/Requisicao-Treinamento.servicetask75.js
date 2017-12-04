function servicetask75(attempt, message) {
 try {
	var Service = ServiceManager.getService('ECMCardService');
	log.warn('%%%%%% Service: ' + Service);

	var serviceHelper = Service.getBean();
	log.warn('%%%%%% serviceHelper: ' + serviceHelper);

	var serviceInstance = serviceHelper.instantiate("com.datasul.technology.webdesk.dm.ws.CardServiceServiceLocator");
	log.warn('%%%%%% serviceInstance: ' + serviceInstance);

	var cardFieldDtoArray = serviceHelper.instantiate("com.datasul.technology.webdesk.dm.ws.CardFieldDtoArray");
	log.warn('%%%%%% cardFieldDtoArray: ' + cardFieldDtoArray);

	var portServico = serviceInstance.getCardServicePort();
	log.warn('%%%%%% portServico: ' + portServico);

	var user = hAPI.getAdvancedProperty("loginUserWS");
	log.warn('%%%%%% user: ' + user);

	var password = hAPI.getAdvancedProperty("passwdUserWS");
	log.warn('%%%%%% password: ' + password);

	var empresa = parseInt(getValue("WKCompany"));
	log.warn('%%%%%% empresa: ' + empresa + ' TypeOf: ' + typeof empresa);
	
	 // Array com o nome de todos os campos a serem populados na ficha(participante e treinamento, respectivamente).
	var fieldsFichaParticipante = ['matricula', 'participante', 'lotacao', 'departamento'];
	var fieldsFichaTreinamento = ['numero_solicitacao_tb1', 'titulo_do_treinamento_tb1', 'classificacao_treinamento_tb1',
							 'instituicao_treinamento_tb1', 'justificativa_treinamento_tb1', 'carga_horaria_tb1',
							  'ano_realizacao_tb1'];
	var cardFieldDto = serviceHelper.instantiate("com.datasul.technology.webdesk.dm.ws.CardFieldDto");
	// obtém quantidade de participantes
	var qtdeParticipantes = parseInt( hAPI.getCardValue("totalParticipantes") );
	// obtem um objetivo com nome e matricula de todos os participantes
	var participantesObj = filterParticipantesObj( hAPI.getCardValue("participantes") );
	// verifica se há algum departamento entre os participantes
	if ( !checkIfHasDepartamento(participantesObj) ) {
		//caso não houver, itera os participantes
		for (var i = 0; i < qtdeParticipantes; i++) {
			// Obtém os dados do participante no humanus
			var humanusData = getParticipanteHumanusData(participantesObj[i].matricula);
			// verifica se o participante possui ficha de treinamentos
			var ficha = checkIfHasFicha(participantesObj[i].matricula);
			if ( ficha != null ) {
				// se houver, cria a ficha. 
				var cardDto = serviceHelper.instantiate("com.datasul.technology.webdesk.dm.ws.CardDto"); // container com os dados de formulário e metadados
				cardDto.setVersion(1000); //metadado que representa a versão do formulário      
				cardDto.setParentDocumentId(167); // metadado que representa a pasta referente ao formulário
				//array que irá encapsular o cardDto
				var vetCardDto = new Array();
				// get departamento by lotacao
				var departamento = getDepartamentoByLotacao(humanusData[0].lotacao);
				// Array que armazena os valores de cada campo de participante
				var arrayCardValuesParticipante = [
					humanusData[0].matricula,
					humanusData[0].nome,
					humanusData[0].lotacao,
					departamento
				];
				// Array que armazena os valores de cada campo de treinamento
				var arrayCardValuesTreinamento = [
					hAPI.getCardValue("numProcess"),
					hAPI.getCardValue("treinamentoSolicitado"),
					hAPI.getCardValue("classificacaoCurso"),
					hAPI.getCardValue("entidadeSugerida"),
					hAPI.getCardValue("justificativa"),
					hAPI.getCardValue("cargaHorariaEstimada")
				];
				//vetor que irá armazenar todos os campos e os respectivos valores
				var vetCardFields = new Array();
				// objeto array que irá armazenar objetos CardFieldDto
				var cardFieldDtoArray = serviceHelper.instantiate("com.datasul.technology.webdesk.dm.ws.CardFieldDtoArray");
				// execução do laço que irá popular o cardFieldDtoArray com os valores do participante
				for ( var y = 0; y < fieldsFichaParticipante.length; y++ ) {
					// instanciando um cardFieldDto para representar um campo do formulário(chave e valor)
					var cardFieldDto = serviceHelper.instantiate("com.datasul.technology.webdesk.dm.ws.CardFieldDto");
					//atribuindo a chave do campo
					cardFieldDto.setField(fieldsFichaParticipante[i]);
					//atribuindo valor ao campo
					cardFieldDto.setValue(arrayCardValuesParticipante[i]);
					// adicionando no array de valores
					vetCardFields.push(cardFieldDto);
				}

				for ( var z = 0; z < fieldsFichaTreinamento.length; z++) {
					// lógica para atribuir todos os valores de treinamento na tabela pai-filho de treinamentos do formulário.
					// https://forum.fluig.com/650-ecmcardservice---create---nao-cria-campos-de-tabela-paixfilho
				}

			}
		}
	}

  //var serviceLocator = serviceHelper.instantiate('classe.locator');
 } catch(error) { 
	log.error(error);
	throw error;
 }
}

/**
 * retorna um array de objetos com nome e matricula de todos os participantes.
 * @param {string} str - Parâmetro string com o nome de todos os participantes, separados com virgula 
 */
function filterParticipantesObj(str) {
	var strArray = str.split(",");
	var participantesObj = [];
	for (var i = 0; i < strArray.length; i++) {
		participantesObj.push({
			nome: strArray[i].substring(strArray[i].indexOf("-") + 2),
			matricula: strArray[i].substring(0, strArray[i].indexOf("-") - 1)
		});
	}
	return participantesObj;
}

/**
 * Verifica se existe departamentos na lista de participantes
 * @param {Object} participantesObj 
 * @returns {Boolean} true, caso haja departamento.
 */
function checkIfHasDepartamento(participantesObj) {
	for (var i = 0; i < participantesObj.length; i++) {
		if ( participantesObj[i].matricula == "00000" ) {
			return true;
		}
	}
	return false;
}

function checkIfHasFicha(mat) {
	var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("matricula", mat, mat, ConstraintType.MUST);
	var fichaReg = DatasetFactory.getDataset("participante_x_treinamento", null, [c1,c2], null);
	if ( fichaReg.values.length > 0 ) {
		return fichaReg.values;
	}
	return null;
}

function getParticipanteHumanusData(mat) {
	var c1 = DatasetFactory.createConstraint("matricula", mat, mat, ConstraintType.MUST);
	var humanusData = DatasetFactory.getDataset("wsFuncionarios", null, [c1], null);
	if ( humanusData.values.length > 0 ) {
		return humanusData.values;
	}
	return null;
}

function getDepartamentoByLotacao(lotacao) {
	var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("codLotacao", lotacao, lotacao, ConstraintType.MUST);
	var lotacaoData = DatasetFactory.getDataset("cadastro_lotacao", null, [c1,c2], null);
	if ( lotacaoData.values.length > 0 ) {
		return lotacaoData.values[0].departamento;
	}
	return "";
}	