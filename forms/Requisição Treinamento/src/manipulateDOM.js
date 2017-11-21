"use strict";
var manipulateDOM = (function () {
    var actions4Listeners = {
        expandTextAreaListener: function (event) {
            event.preventDefault();
            var type = $(this).prop('tagName');
            var classe = ($(this).attr('class')).indexOf('expand');
            $(this).css('resize', 'none');
            if (classe > -1) {
                $(this).show('slow', function () {
                    $(this).css({
                        'display': 'block',
                        'overflow-y': 'hidden'
                    });
                    expandTextarea(this.id);
                });
            }
        },
        customMaxTagEvent: function (item, tag) {
            if ($("#totalParticipantes").val() != "") {
                if (!($(".alert-danger").length > 0)) {
                    FLUIGC.toast({
                        message: 'Limite de participantes atingido.',
                        type: 'danger'
                    });
                    setTimeout(function () {
                        $(".alert-danger").remove();
                    }, 3000);
                }
            } else {
                if (!($(".alert-danger").length > 0) && document.readyState == "complete") {
                    FLUIGC.toast({
                        message: 'Favor preencher o campo total de participantes.',
                        type: 'danger'
                    });
                    setTimeout(function () {
                        $(".alert-danger").remove();
                    }, 3000);
                }
            }
        },

        onParticipantesAddedRemovedListener: function () {
            var myTagParticipantes = FLUIGC.autocomplete('#participantes');
            var myTagParticipantesArray = myTagParticipantes.items();
            var totalParticipantes = $("#totalParticipantes").val();
            var participantesObj = manipulateDOM.filterParticipantesObj(myTagParticipantesArray)
            var hasDepartamento = manipulateDOM.checkIfHasDepartamento(participantesObj);
            if ( hasDepartamento ) {
                $("#tagControl").val("Sim");
            } else {
                if ( myTagParticipantesArray.length < totalParticipantes ) {
                    $("#tagControl").val("Não");
                } else {
                    $("#tagControl").val("Sim");
                }
            }
        },

        origemVerbaListener: function () {
            var origemVerba = this.value;
            var obj = [];
            $(".numSolicitacaoVerbaContainer, .nomeCanvasContainer, .contaContabilContainer").find("input").val("");
            if (origemVerba == "Solicitação de verba") {
                obj.push({
                    "field": ".numSolicitacaoVerbaContainer",
                    "property": "block"
                }, {
                    "field": ".contaContabilContainer",
                    "property": "none"
                }, {
                    "field": ".nomeCanvasContainer",
                    "property": "none"
                });
            }

            if (origemVerba == "Canvas") {
                obj.push({
                    "field": ".numSolicitacaoVerbaContainer",
                    "property": "none"
                }, {
                    "field": ".contaContabilContainer",
                    "property": "none"
                }, {
                    "field": ".nomeCanvasContainer",
                    "property": "block"
                });
            }
            if (origemVerba == "Transposição de verba") {
                obj.push({
                    "field": ".numSolicitacaoVerbaContainer",
                    "property": "none"
                }, {
                    "field": ".contaContabilContainer",
                    "property": "block"
                }, {
                    "field": ".nomeCanvasContainer",
                    "property": "none"
                });
            }
            setVisibilityArrayElements(obj);
        }


    };

    var zoomFields = {
        eventZoom: function (selectedItem) {
            if (selectedItem.inputName == 'departamento') {
                if (event.type != 'load') {
                    $("#guardaDpto").val(selectedItem.segmentoExecutivo);
                    $("#responsavelDepartamento").val(selectedItem.responsavel);
                    $("#matResponsavelDepartamento").val(selectedItem.matResponsavel);
                }
            }

            if (selectedItem.inputName == 'areaOrcamento') {
                if (event.type != 'load') {
                    $("#guardaArea").val(selectedItem.areaOrcamento);

                    /**
                     * Seta o filtro para o zoom de departamentos, para filtrar todos os segmentos/departamentos
                     * relacionados a área selecionada especificamente.
                     */
                    reloadZoomFilterValues('departamento', 'areaOrcamento,' + $("#guardaArea").val());
                }
                $('[data-field-name="areaOrcamento"] [data-role=remove]').on('click', function () {
                    zoomFields.cleanAllFieldsRelatedArea();
                });
            }

            if (selectedItem.inputName == 'participanteFluig') {
                var participantes = FLUIGC.autocomplete("#participantes");
                var thisField = FLUIGC.autocomplete("#"+selectedItem.inputName);
                var tagData = selectedItem.colleagueId + " - " + selectedItem.colleagueName;
                participantes.add(tagData);
                thisField.removeAll();
                thisField.destroy();
            }
        },
        /**
         * @description Limpa todos os campos de controle e seta o filtro do campo zoom de departamentos
         * para não retornar nenhum valor.
         */
        cleanAllFieldsRelatedArea: function () {
            $('[data-field-name="departamento"] [data-role=remove]').trigger('click');
            $("#guardaArea").val("");
            reloadZoomFilterValues('departamento', 'areaOrcamento,areaOrcamento');
        }
    }

    var setVisibilityArrayElements = function (obj) {
        $.each(obj, function (index, value) {
            $(value.field).css("display", value.property)
        });
    };

    var expandTextarea = function (id) {
        var element = document.getElementById(id);
        if (element.scrollHeight != null) {
            var altura = element.scrollHeight + 'px';
            $(element).animate({
                overflow: 'hidden',
                height: 0,
                height: altura
            });
        }
    };

    /**
     * Verifica se existe departamentos na lista de participantes
     * @param {Object} participantesObj 
     * @returns {Boolean} true, caso haja departamento.
     */
    var checkIfHasDepartamento = function (participantesObj) {
        for (var i = 0; i < participantesObj.length; i++) {
            if ( participantesObj[i].matricula == "00000" ) {
                return true;
            }
        }
        return false;
    };

    /**
     * retorna um array de objetos com nome e matricula de todos os participantes.
     * @param {string} strArray - Parâmetro array com todos os participantes. 
     */
    var filterParticipantesObj = function (strArray) {
        var participantesObj = [];
        for (var i = 0; i < strArray.length; i++) {
            participantesObj.push({
                nome: strArray[i].substring(strArray[i].indexOf("-") + 2),
                matricula: strArray[i].substring(0, strArray[i].indexOf("-") - 1)
            });
        }
        return participantesObj;
    };


    var updateAutoCompleteWithLimit = function () {
        var autoCompleteFieldId = 'participantes';
        var maxTag = $('#totalParticipantes').val() == "" ? "0" : $('#totalParticipantes').val();
        var autoComplete = FLUIGC.autocomplete("#" + autoCompleteFieldId);
        autoComplete.destroy();
        autoComplete = FLUIGC.autocomplete("#" + autoCompleteFieldId, {
            maxTags: maxTag,
            onMaxTags: actions4Listeners.customMaxTagEvent
        });
        /**
         * @description Máscara para o campo de Nome(apenas letras) - Matrícula(apenas número). 
         */
        autoComplete.input().on({
            "blur": removeAlertDanger,
            "keypress": customMaskAutoComplete
        });

    };

    var removeAlertDanger = function () {
        $(".alert-danger").remove();
    };

    var changeToBreakLine = function () {
        var textWithComma = $(this).val();
        var textWithSpace = textWithComma.replace(/,/g, '\n');
        $("#participantesView").val(textWithSpace);
    };

    var enablePopOvers = function () {
        FLUIGC.popover('.bs-docs-popover-hover', {
            trigger: 'hover',
            placement: 'auto'
        });
    };

    var customMaskAutoComplete = function (e) {
        e = e || window.event;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        var numberSide = $(this).val().indexOf("- ");
        var charStr = String.fromCharCode(charCode);
        var obj = $(this);
        if (numberSide == -1) {
            if (obj.val().length > 14 || charCode == 45) {
                obj.val(obj.val() + " - ");
                return false;
            }
            if (charCode > 47 && charCode < 58) {
                return true;
            } else {
                return false;
            }
        } else {
            if (charCode > 47 && charCode < 58) {
                return false;
            }
        }
    };

    var expandTextareaHistorico = function (id) {
        var objTextArea = document.getElementById(id);
        if (objTextArea.scrollHeight > objTextArea.offsetHeight) {
            objTextArea.rows += 1;
        }
    };

    var mostraHistorico = function () {
        var historico = 'historico';
        document.getElementById(historico).style.display = 'inline';
        expandTextarea(historico);
    };
    return {
        actions4Listeners: actions4Listeners,
        setVisibilityArrayElements: setVisibilityArrayElements,
        expandTextarea: expandTextarea,
        updateAutoCompleteWithLimit: updateAutoCompleteWithLimit,
        changeToBreakLine: changeToBreakLine,
        enablePopOvers: enablePopOvers,
        checkIfHasDepartamento: checkIfHasDepartamento,
        filterParticipantesObj: filterParticipantesObj,
        expandTextareaHistorico: expandTextareaHistorico,
        mostraHistorico: mostraHistorico,
        zoomFields: zoomFields
    }
})();
