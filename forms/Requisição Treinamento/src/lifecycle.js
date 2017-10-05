"use strict";
/** Global Variables */
var activity = 0,
    modo = '',
    currentLocation = '';

// Lifecycle module
var lifecycle = (function () {
    var windowLoadEvents = function () {
        /** Events onload, zoomFields etc.. */
        var filters = 'areaOrcamento,' + $('input#guardaArea').val();
        var act = getAtividade();
        if (act == 0 || act == 4) {
            if ($('input#guardaArea').val() !== '' && modo !== 'VIEW') {
                reloadZoomFilterValues('departamento', filters);
                setAreaOrcamento();
            }
            if ($('input#guardaDpto').val() !== '' && modo !== 'VIEW') {
                setAreaDepartamento();
            }
        }

    };

    var init = function () {
        setup();
        logActivityInformation();
        control();
    };

    var setup = function () {
        activity = getAtividade();
        modo = getFormMode();
        currentLocation = document.location.origin;
    };

    var logActivityInformation = function () {
        console.log("Activity: ", activity);
        console.log("Modo: ", modo);
    };

    var control = function () {
        /** Início - Life Cycle */

        if (activity == 0 || activity == 4 || activity == 17) {

            if (activity == 0 || activity == 4) {
                $("#anoVigencia").val(parseInt(dateFunctions.calendar.today().year));
            }
            manipulateDOM.updateAutoCompleteWithLimit();
            $("#totalParticipantes").on("change blur", manipulateDOM.updateAutoCompleteWithLimit);
            $('#participantes').on('blur change focusout', manipulateDOM.changeToBreakLine);
            $("input[type=radio][name='origemVerba']").on("change", manipulateDOM.actions4Listeners.origemVerbaListener);
            manipulateDOM.enablePopOvers();

        }

        if (activity == 5) {
            $("input[name='treinamentoAprovadoGRA']").attr('checked', false);
        }

        if (activity == 15) {
            $("input[name='treinamentoAprovadoRH']").attr('checked', false);
        }

        if (activity == 17) {
            $("input[name='cancelarSolicitacao']").attr('checked', false);


        }

        /** Modo VIEW  */
        if (modo == "VIEW") {

        }
        /** Fim - Life Cycle */
    };

    /* DECLARA O OBJETO ZOOM ÁREA ORÇAMENTO */
    var setAreaOrcamento = function () {
        var $areaOrcamento = FLUIGC.autocomplete('input#areaOrcamento');
        var $areaOrcamentoTagData = {
            areaOrcamento: $('input#guardaArea').val()
        };
        $areaOrcamento.add($areaOrcamentoTagData);
    };

    /* DECLARA O OBJETO ZOOM DEPARTAMENTO */
    var setAreaDepartamento = function () {
        var $eventoNome = FLUIGC.autocomplete('input#departamento');
        var $eventoTagData = {
            segmentoExecutivo: $('input#guardaDpto').val()
        };
        $eventoNome.add($eventoTagData);
    };

    return {
        init: init,
        windowLoadEvents: windowLoadEvents
    };
})();
