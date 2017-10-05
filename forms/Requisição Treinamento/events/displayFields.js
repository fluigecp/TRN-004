function displayFields(form,customHTML) {
	var activity = getValue('WKNumState');
	form.setShowDisabledFields(true);
	var modo = form.getFormMode();
	customHTML.append("<script>");
	customHTML.append("function getAtividade(){return '" + getValue('WKNumState') + "'};");
	customHTML.append("function getFormMode(){return '" + form.getFormMode() + "'};");
	customHTML.append("function getGestor(){return '" + getValue('WKManagerMode') + "'};");
	customHTML.append("function getProcess(){return '" + getValue('WKNumProces') + "'};");
	customHTML.append("</script>");
	  
	function oculta(variavel){        
		customHTML.append('<script>                                       ');
		customHTML.append('$(\'[name="'+variavel+'"]\').css(\'display\', \'none\');                      ');
		customHTML.append('$([name="'+variavel+'"]).parent().css(\'display\', \'none\');                                     ');
		customHTML.append('var closers = $([name="'+variavel+'"]).closest(\'.form-field\').find(\'input, textarea, select, table\');');
		customHTML.append('var hideDiv = true;                                                                               ');
		customHTML.append('$.each(closers, function(i, close) {                                                              ');
		customHTML.append('  if (close.style.display != \'none\') {                                                          ');
		customHTML.append('    hideDiv = false;                                                                              ');
		customHTML.append('  }                                                                                               ');
		customHTML.append('});                                                                                               ');
		customHTML.append('                                                                                                  ');
		customHTML.append('if (hideDiv == true) {                                                                            ');
		customHTML.append('  $([name="'+variavel+'"]).closest(\'.form-field\').css(\'display\', \'none\');                   ');
		customHTML.append('}                                                                                                 ');
		customHTML.append('$(\'[name="'+variavel+'"]\').closest(".form-field").hide();                                       ');
		customHTML.append('</script>                                       ');
	}

	function ocultaClasse(classe){
		customHTML.append('<script>');
		customHTML.append('$(\'.'+classe+'\').css(\'display\', \'none\')');
		customHTML.append('</script>');
	}
	function ocultaId(id){
		customHTML.append('<script>');
		customHTML.append('$(\'#'+id+'\').css(\'display\', \'none\')');
		customHTML.append('</script>');
	}

	/** Life Cycle */


	if ( activity == 0 || activity == 4 || activity == 17 ) {
		//ocultaClasse("className");
		//ocultaId("fieldId");
		ocultaClasse("aprovacoesContainer");
		ocultaClasse("considerarContainer");
		ocultaClasse("numSolicitacaoVerbaContainer");
		ocultaClasse("nomeCanvasContainer");
		ocultaClasse("contaContabilContainer");
		ocultaId("valorUtilizadoContainer");
		ocultaId("SCContainer");
		ocultaId("DLContainer");
		if ( modo != "VIEW" ) {
			ocultaId("participantesView");
		} else {
			ocultaClasse("participantesContainer");
		}
	}
	
	if (activity == 5) {
		ocultaId("valorUtilizadoContainer");
		ocultaId("_participantes");
		ocultaClasse("considerarContainer");
		ocultaClasse("aprovacoesRHContainer");
		ocultaId("SCContainer");
		ocultaId("DLContainer");
	}

	if ( activity == 15 ) {
		ocultaId("valorUtilizadoContainer");
		ocultaId("_participantes");
		ocultaClasse("considerarContainer");
		ocultaClasse("aprovacoesGRAContainer");
		ocultaId("SCContainer");
		ocultaId("DLContainer");
	}

	if ( activity == 37 ) {
		ocultaId("valorUtilizadoContainer");
		ocultaId("_participantes");
		ocultaClasse("considerarContainer");
		ocultaClasse("aprovacoesRHContainer");
		ocultaClasse("aprovacoesGRAContainer");
		ocultaId("SCContainer");
		ocultaId("DLContainer");
	}

	if ( activity == 41 ) {
		ocultaClasse("aprovacoesContainer");
		ocultaId("valorUtilizadoContainer");
		ocultaId("SCContainer");
		ocultaId("DLContainer");
		ocultaId("_participantes");
	}

	if ( activity == 43 ) {
		ocultaClasse("aprovacoesContainer");
		ocultaId("valorUtilizadoContainer");
		ocultaId("_participantes");
	}

	if ( activity == 45 ) {
		ocultaClasse("aprovacoesContainer");
		ocultaId("_participantes");
	}

	if ( activity != 17 ) {
		ocultaClasse("cancelarSolicitacaoContainer");
	}

	if ( modo == "VIEW" ) {
		ocultaClasse("aprovacoesContainer");
		ocultaClasse("obsHistoricoContainer");
		ocultaClasse("bs-docs-popover-hover");
		ocultaId("participantes");
		ocultaId("_participantes");
		ocultaClasse("participantesContainer");
		form.setShowDisabledFields(false);
	}

	/** regras para todas as atividades */

	if ( form.getValue("origemVerba") == "Solicitação de verba" ) {
		ocultaClasse("nomeCanvasContainer");
		ocultaClasse("contaContabilContainer");
	}
	if ( form.getValue("origemVerba") == "Canvas" ) {
		ocultaClasse("numSolicitacaoVerbaContainer");
		ocultaClasse("contaContabilContainer");
	}
	if ( form.getValue("origemVerba") == "Transposição de verba" ) {
		ocultaClasse("numSolicitacaoVerbaContainer");
		ocultaClasse("nomeCanvasContainer");
	}

	/** FIM - Life Cycle */
    

}
