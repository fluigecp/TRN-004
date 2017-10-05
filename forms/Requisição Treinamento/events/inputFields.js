function inputFields(form) {
    var activity = getValue('WKNumState');
    var numProcess = getValue("WKNumProces");
    
    form.setValue('campoDescritor', form.getValue('departamento') + " - " + form.getValue('treinamentoSolicitado'));

    /** Life Cycle */
    if ( activity == 0 || activity == 4 ) {
        form.setValue("numProcess", numProcess);
    }
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
