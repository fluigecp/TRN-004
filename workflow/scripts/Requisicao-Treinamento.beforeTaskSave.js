function beforeTaskSave(colleagueId,nextSequenceId,userList){
    var atividade = getValue('WKNumState');
    
    //HISTÓRICO NO EVENTO
	if( getValue("WKCompletTask") == "true" ){
		atualizaHistorico("obsHistorico");
        log.info("HISTÓRICO ATUALIZADO");
	} else {
        log.info("HISTÓRICO NÃO ATUALIZADO");
    }

}

/** Funções utilizadas no histórico */

function atualizaHistorico(name) {
    if( name == "" ){
        return;
    }
    var mensagem = hAPI.getCardValue(name);

    if(mensagem == null || mensagem == ""){
        return;
    }

    var ultimaAtualizacao = hAPI.getCardValue("ultimaAtualizacao") == "" ? " " : hAPI.getCardValue("ultimaAtualizacao");
    var historico = hAPI.getCardValue("historico")== "" ? " " : hAPI.getCardValue("historico");
    
    var usuarioLogado = "";
    try {
        usuarioLogado = usuario();
    } catch(err){
        usuarioLogado = "Erro ao buscar usuário";
    }

    var htmlHistoricoNovo = dataHoraAtual()+" - "+usuarioLogado+"  \r\n" + mensagem +"\r\n \r\n";
    
    hAPI.setCardValue("ultimaAtualizacao", htmlHistoricoNovo );           
    hAPI.setCardValue("historico", ultimaAtualizacao + historico );
    hAPI.setCardValue(name, "" );
}


function dataHoraAtual() {
    var dt = new Date();
    var txtData = (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()) + "/" + ((dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + "/" + dt.getFullYear() + " - " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":" + (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes());
    return txtData;
}


function usuario(){
    var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",getValue("WKUser"),getValue("WKUser"),ConstraintType.MUST);
    var dsUser = DatasetFactory.getDataset("colleague",["colleagueName"],[c1],null);
    return dsUser.getValue(0,"colleagueName");
}

