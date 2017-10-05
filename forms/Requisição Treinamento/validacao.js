function validaCampos(atividade, proximaAtividade) {
	/** Life Cycle Workflow */
	
	if ( atividade == 0 || atividade == 4 || activity == 17 ) {
		addHasFree('areaOrcamento');
		addHasFree('anoVigencia')
		addHasFree('departamento');
		addHasFree('treinamentoSolicitado');
		addHasFree('entidadeSugerida');
		addHasFree('cargaHorariaEstimada');
		addHasFree('participantes');
		addHasFree('totalParticipantes');
		addHasFree('classificacaoCurso');
		addHasFree('justificativa');
		addHasFree('origemVerba');
		addHasFree('valorEstimado');
		var origemVerba = $("input[type=radio][name='origemVerba']:checked").val();
		if ( origemVerba == "Solicitação de verba" ) {
			addHasFree("numSolicitacaoVerba");
			$("#nomeCanvas").removeClass("has-free");
			$("#contaContabil").removeClass("has-free");
			validateProcess($("#numSolicitacaoVerba").val());
		}
		
		if ( origemVerba == "Canvas" ) {
			addHasFree("nomeCanvas");
			$("#numSolicitacaoVerba").removeClass("has-free");
			$("#contaContabil").removeClass("has-free");
		}
		if ( origemVerba == "Transposição de verba" ) {
			addHasFree("contaContabil");
			$("#nomeCanvas").removeClass("has-free");
			$("#numSolicitacaoVerba").removeClass("has-free");
		}
	}

	if ( atividade == 5) {
		addHasFree('treinamentoAprovadoGRA');
		if ( getValue('treinamentoAprovadoGRA') == "Não" || getValue('treinamentoAprovadoGRA') == "Cancelar" ){
			addHasFree('obsHistorico');
		}
	}

	if ( atividade == 15 ) {
		addHasFree('treinamentoAprovadoRH');
		if ( getValue('treinamentoAprovadoRH') == "Não" || getValue('treinamentoAprovadoRH') == "Cancelar" ){
			addHasFree('obsHistorico');
		}
	}

	if ( atividade == 32 ) {
		addHasFree("valorUtilizado");
	}

	if ( atividade == 41 ) {
		addHasFree("consideracoes");
	}

	if ( atividade == 43 ) {
		addHasFree("dl");
		addHasFree("sc");
	}

	if( atividade == 45 ) {
		addHasFree("valorUtilizado");
		addHasFree('obsHistorico');
	}

	/** Fim Life Cycle Workflow */
}

/** Services */

function validateProcess(numProcess) {
	var c1 = DatasetFactory.createConstraint("active", true, true, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("processInstanceId", numProcess, numProcess, ConstraintType.MUST);
	var consulta = DatasetFactory.getDataset('workflowProcess', null, [c1, c2], null);
	if ( consulta.values.length > 0 ) {
		return 0;
	} else {
		var consulta2 = DatasetFactory.getDataset("processTask", null, [c2], null);
		if ( consulta2.values.length > 0 ) {
			for (var i = 0; i < consulta2.values.length; i++) {
				if (consulta2.values[i].status == 4){
					throw("Solicitação informada está cancelada.");
				}
			}
		} else {
			throw("Solicitação informada não existe.");
		}
	}
}