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

		var choosedState = 18;

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
			"instituicao", "dataRealizacao", "cargaHoraria", "matResponsavelSolic", "numSolicTreinamento",
			"classificacaoCurso", "campoDescritor"];
		for (var i = 0; i < participantesObj.length; i++) {
			var fieldsRequisicao = [];
			var currentMat = hAPI.getCardValue("matResponsavelDepartamento");
			if (searchUserMat(participantesObj[i].matricula)) {
				currentMat = participantesObj[i].matricula;
			}
			var classificacao = hAPI.getCardValue("classificacaoCurso");
			
			if ( classificacao == "legislacao_obrigatorio" ){ 
				classificacao = "Legislação/Obrigatório";
			}
			if ( classificacao == "projeto_implantacao" ){
				 classificacao = "Projeto/implantação";
			}
			if( classificacao == "aprimoramento_profissional" ){
				 classificacao = "Aprimoramento profissional";
			}
			log.warn("%%%%%% classificacao: "+classificacao);
			fieldsRequisicao.push(participantesObj[i].nome + "");
			fieldsRequisicao.push(currentMat + "");
			fieldsRequisicao.push(hAPI.getCardValue("departamento") + "");
			fieldsRequisicao.push(hAPI.getCardValue("treinamentoSolicitado") + "");
			fieldsRequisicao.push(hAPI.getCardValue("entidadeSugerida") + "");
			fieldsRequisicao.push(hAPI.getCardValue("anoVigencia") + "");
			fieldsRequisicao.push(hAPI.getCardValue("cargaHorariaEstimada") + "");
			fieldsRequisicao.push(currentMat + "");
			fieldsRequisicao.push(numSolicPai + "");
			fieldsRequisicao.push(classificacao + "");
			fieldsRequisicao.push(participantesObj[i].nome + " - " + hAPI.getCardValue("treinamentoSolicitado") + "");
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
 * Verifica se um usuário existe na base de usuários do Fluig
 * @param {string} mat - Matrícula do usuário
 */
function searchUserMat(mat) {
	var c2 = DatasetFactory.createConstraint("colleaguePK.colleagueId", mat, mat, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("colleague", null, [c2], null);
	if (dataset.values.length > 0) {
		return true;
	}
	return false;
}
