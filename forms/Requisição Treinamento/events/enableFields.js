function enableFields(form) {
	var activity = getValue('WKNumState');
    
    /** Life Cycle */
    
    if ( activity == 0 || activity == 4 ) {
		//form.setEnabled('fieldName',false, true);
		//disablePaiFilho();
    }

    if ( activity == 5 || activity == 15 || activity == 37 || activity == 41 || activity == 43 || activity == 45 ) {
        form.setEnabled('areaOrcamento',false, true);
        form.setEnabled('anoVigencia',false,true);
        form.setEnabled('participanteFluig',false,true);
        form.setEnabled('departamento',false, true);
        form.setEnabled('treinamentoSolicitado',false, true);
        form.setEnabled('entidadeSugerida',false, true);
        form.setEnabled('cargaHorariaEstimada',false, true);
        form.setEnabled('participantes',false, true);
        form.setEnabled('participantesView',false, true);
        form.setEnabled('totalParticipantes',false, true);
        form.setEnabled('classificacaoCurso',false, true);
        form.setEnabled('contaContribuicao',false, true);
        form.setEnabled('justificativa',false, true);
        form.setEnabled('valorEstimado',false, true);
        form.setEnabled('origemVerba',false, true);
        form.setEnabled('nomeCanvas',false, true);
        form.setEnabled('numSolicitacaoVerba',false, true);
        form.setEnabled('contaContabil',false, true);
    }

    if ( activity == 43 ) {
        form.setEnabled('valorEstimado',false, true);
        form.setEnabled('consideracoes',false, true);
    }

    if ( activity == 45 ) {
        form.setEnabled('valorEstimado',false, true);
        form.setEnabled('consideracoes',false, true);
        form.setEnabled('sc',false, true);
        form.setEnabled('dl',false, true);
    }

    /** Fim - Life Cycle */

}