function servicetask67(attempt, message) {
	try {
		var numSolicPai = getValue('WKNumProces');

		//var documentId = ( hAPI.getCardData( getValue( "WKNumProcess" ) ) ).get( "documentid" );
		var documentId = hAPI.getCardValue( "documentid" );
		log.warn("%%%%%% documentId : " + documentId);

		var servico = ServiceManager.getService("ECMWorkflowEngineService").getBean();
		log.warn("%%%%%% servico : " + servico);

		var locator = servico.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
		log.warn("%%%%%% locator : " + locator);

		var WorkflowEngineService = locator.getWorkflowEngineServicePort();
		log.warn("%%%%%% WorkflowEngineService : " + WorkflowEngineService);

		var username = hAPI.getAdvancedProperty("loginUserWS");
		log.warn("%%%%%% username : " + username);

		var password = hAPI.getAdvancedProperty("passwdUserWS");
		log.warn("%%%%%% password : " + password);

		var companyId = parseInt(getValue("WKCompany"));
		log.warn("%%%%%% companyId : " + companyId);

		var processId = "TRN-006";

		var choosedState = 29;

		var comments = "Solicitação aberta por: Nº " + numSolicPai;
		log.warn("%%%%%% comments : " + comments);

		var userId = hAPI.getAdvancedProperty("matUserWS");
		log.warn("%%%%%% userId : " + userId);

		var completeTask = true;
		log.warn("%%%%%% completeTask : " + completeTask);

		var attachments = servico.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");
		log.warn("%%%%%% attachments : " + attachments);

		var appointment = servico.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");
		log.warn("%%%%%% appointment : " + appointment);

		var managerMode = false;
		log.warn("%%%%%% managerMode : " + managerMode);

		var novaSolic;

		var colleagueIds = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		colleagueIds.getItem().add('System:Auto');
		log.warn("%%%%%% colleagueIds");

		var participantesObj = filterParticipantesObj(hAPI.getCardValue("participantes"));
		var fieldsAvaliacao = ["nomeParticipante", "matricula", "area", "cursoTreinamento",
			"instituicao", "dataRealizacao", "cargaHoraria", "avaliadorMat", "numSolicTreinamento",
			"classificacaoCurso", "campoDescritor", "matResponsavelArea", "aberturaAutomatica"];

		/* Checa se existem departamento entre os participantes,
		 	caso sim, abre solitações em branco a serem preenchidas. */
		if ( checkIfHasDepartamento(participantesObj) ) {
			var fieldsAvaliacaoWithDepartamento = ["area", "cursoTreinamento", "instituicao", "dataRealizacao", "cargaHoraria", 
													"numSolicTreinamento", "classificacaoCurso", 
													 "matResponsavelArea", "aberturaAutomatica"];
			var fieldsRequisicaoWithDepartamento = [];
			fieldsRequisicaoWithDepartamento.push( hAPI.getCardValue("departamento") + "" );
			fieldsRequisicaoWithDepartamento.push( hAPI.getCardValue("treinamentoSolicitado") + "" );
			fieldsRequisicaoWithDepartamento.push( hAPI.getCardValue("entidadeSugerida") + "" );
			fieldsRequisicaoWithDepartamento.push( hAPI.getCardValue("anoVigencia") + "" );
			fieldsRequisicaoWithDepartamento.push( hAPI.getCardValue("cargaHorariaEstimada") + "" );
			fieldsRequisicaoWithDepartamento.push( numSolicPai + "" );
			fieldsRequisicaoWithDepartamento.push( validateClassificacao( hAPI.getCardValue("classificacaoCurso") ) );
			fieldsRequisicaoWithDepartamento.push( hAPI.getCardValue("matResponsavelDepartamento") + "" );
			fieldsRequisicaoWithDepartamento.push( "Sim" );
			var qtdeParticipantes = parseInt( hAPI.getCardValue("totalParticipantes") );
			for (var y = 0; y < qtdeParticipantes; y++) {
				var cardData = servico.instantiate("net.java.dev.jaxb.array.StringArrayArray");
				for (var j = 0; j < fieldsAvaliacaoWithDepartamento.length; j++) {
					var objField = servico.instantiate("net.java.dev.jaxb.array.StringArray");
					objField.getItem().add(fieldsAvaliacaoWithDepartamento[j]);
					objField.getItem().add(fieldsRequisicaoWithDepartamento[j]);
					cardData.getItem().add(objField);
				}
				novaSolic = WorkflowEngineService.startProcess(username, password, companyId, processId, choosedState, colleagueIds, comments, userId,
					completeTask, attachments, cardData, appointment, managerMode);
			}
		} else {

			for (var i = 0; i < participantesObj.length; i++) {
				var fieldsRequisicao = [];
				var responsavelArea = hAPI.getCardValue("matResponsavelDepartamento");
				var currentMat = responsavelArea;
				if (searchUserMat(participantesObj[i].matricula)) {
					currentMat = participantesObj[i].matricula;
				}
				var classificacao = validateClassificacao( hAPI.getCardValue("classificacaoCurso") );
				
				log.warn("%%%%%% classificacao: "+classificacao);
				fieldsRequisicao.push(participantesObj[i].nome + "");
				fieldsRequisicao.push(participantesObj[i].matricula + "");
				fieldsRequisicao.push(hAPI.getCardValue("departamento") + "");
				fieldsRequisicao.push(hAPI.getCardValue("treinamentoSolicitado") + "");
				fieldsRequisicao.push(hAPI.getCardValue("entidadeSugerida") + "");
				fieldsRequisicao.push(hAPI.getCardValue("anoVigencia") + "");
				fieldsRequisicao.push(hAPI.getCardValue("cargaHorariaEstimada") + "");
				fieldsRequisicao.push(currentMat + "");
				fieldsRequisicao.push(numSolicPai + "");
				fieldsRequisicao.push(classificacao + "");
				fieldsRequisicao.push(participantesObj[i].nome + " - " + hAPI.getCardValue("treinamentoSolicitado") + "");
				fieldsRequisicao.push(responsavelArea + "");
				fieldsRequisicao.push("Sim");
				var cardData = servico.instantiate("net.java.dev.jaxb.array.StringArrayArray");
				for (var x = 0; x < fieldsAvaliacao.length; x++) {
					var objField = servico.instantiate("net.java.dev.jaxb.array.StringArray");
					objField.getItem().add(fieldsAvaliacao[x]);
					objField.getItem().add(fieldsRequisicao[x]);
					cardData.getItem().add(objField);
				}
				novaSolic = WorkflowEngineService.startProcess(username, password, companyId, processId, choosedState, colleagueIds, comments, userId,
					completeTask, attachments, cardData, appointment, managerMode);
			}
		}


	} catch (error) {
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

function validateClassificacao(classificacao) {
	if ( classificacao == "legislacao_obrigatorio" ){ 
		return "Legislação/Obrigatório";
	}
	if ( classificacao == "projeto_implantacao" ){
		 return "Projeto/implantação";
	}
	if( classificacao == "aprimoramento_profissional" ){
		 return "Aprimoramento profissional";
	}
	return classificacao;
}
/**
 * Verifica se um usuário existe na base de usuários do Fluig e se ele está ativo.
 * @param {string} mat - Matrícula do usuário
 * @returns {Boolean} - true, caso exista o usuário informado e se ele estiver ativo.
 */
function searchUserMat(mat) {
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", mat, mat, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("active", true, true, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("colleague", null, [c1,c2], null);
	if (dataset.values.length > 0) {
		return true;
	}
	return false;
}
