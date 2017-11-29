function inputFields(form) {
    var activity = getValue('WKNumState');
    var numProcess = getValue("WKNumProces");
    
    form.setValue('campoDescritor', form.getValue('departamento') + " - " + form.getValue('treinamentoSolicitado'));

    /** Life Cycle */
    if ( activity == 0 || activity == 4 ) {
        form.setValue("numProcess", numProcess);
	}
	
	form.setValue('custom_0', form.getValue('treinamentoSolicitado') );
	form.setValue('custom_1', form.getValue('departamento') );
	form.setValue('custom_2', getClassificacaoCameoCase( form.getValue('classificacaoCurso') ) );
	form.setValue('custom_3', form.getValue('cargaHorariaEstimada') );
	form.setValue('custom_4', form.getValue('anoVigencia') );
	form.setValue('custom_5', form.getValue('totalParticipantes') );

	form.setValue('fato_0', getInvestimentoParticipante( form.getValue('valorUtilizado'), form.getValue('totalParticipantes') ) );
	form.setValue('fato_1', converteParaFloat( form.getValue('valorEstimado') ) );
	form.setValue('fato_2', converteParaFloat( form.getValue('valorUtilizado') ) );
}

function getClassificacaoCameoCase(classificacao) {
	if ( classificacao == "legislacao_obrigatorio" ) return "Legislação/obrigatório";
	if ( classificacao == "projeto_implantacao" ) return "Projeto/implantação";
	if ( classificacao == "aprimoramento_profissional" ) return "Aprimoramento Profissional";
	return "";
}

function getInvestimentoParticipante(valorInvestido, qtdParticipante ) {
	if ( qtdParticipante != "" && valorInvestido != "" ) {
		var valorParticipante = converteParaFloat(valorInvestido) / parseFloat(qtdParticipante);
		return valorParticipante;
	}
	return 0;
}

function converteParaFloat(variavel) {
	if (variavel == "") {
		return parseFloat(0);
	}
	if (variavel.indexOf("R$") > -1) {
		variavel = variavel.replace("R$ ", "");
	}
	while (variavel.indexOf(".") != -1) {
		variavel = variavel.replace(".", "");
	}

	return parseFloat(variavel.replace(",", "."));
}
