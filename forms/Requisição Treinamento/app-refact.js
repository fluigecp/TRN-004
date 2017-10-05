    /** Global Variables */
    var activity = 0,
        modo = '',
        currentLocation = '';


    // Lifecycle module
    var lifecycle = {
        windowLoadEvents: function () {
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

            /* DECLARA O OBJETO ZOOM ÁREA ORÇAMENTO */
            function setAreaOrcamento() {
                var $areaOrcamento = FLUIGC.autocomplete('input#areaOrcamento');
                var $areaOrcamentoTagData = {
                    areaOrcamento: $('input#guardaArea').val()
                };
                $areaOrcamento.add($areaOrcamentoTagData);
            }

            /* DECLARA O OBJETO ZOOM DEPARTAMENTO */
            function setAreaDepartamento() {
                var $eventoNome = FLUIGC.autocomplete('input#departamento');
                var $eventoTagData = {
                    segmentoExecutivo: $('input#guardaDpto').val()
                };
                $eventoNome.add($eventoTagData);
            }
        },

        init: function () {
            lifecycle.setup();
            lifecycle.logActivityInformation();
            lifecycle.control();
        },

        setup: function () {
            activity = getAtividade();
            modo = getFormMode();
            currentLocation = document.location.origin;
        },

        logActivityInformation: function () {
            console.log("Activity: ", activity);
            console.log("Modo: ", modo);
        },

        control: function () {
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
        }
    }

    // Date functions module
    /*var dateFunctions = {
        calendar: {
            get: function (obj, data) {
                var pkDate = false,
                    pkTime = false,
                    pkMinutes = false;

                if (data == 'date') {
                    pkDate = true;

                    FLUIGC.calendar('#' + obj.id, {
                        pickDate: pkDate,
                        pickTime: pkTime,
                        useMinutes: pkMinutes,
                        useSeconds: false,
                        useCurrent: true,
                        minuteStepping: 1,
                        minDate: '1/1/2010',
                        maxDate: '1/1/2215',
                        showToday: true,
                        language: 'pt-br',
                        defaultDate: "",
                        disabledDates: dateFunctions.arrayDates.get(),
                        useStrict: false,
                        sideBySide: false,
                        daysOfWeekDisabled: [0]
                    });
                } else if (data == 'hour') {
                    pkTime = true;
                    pkMinutes = true;
                    FLUIGC.calendar('#' + obj.id, {
                        pickDate: pkDate,
                        pickTime: pkTime,
                    });
                }
            },

            today: function () {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }
                return {
                    "date": dd + '/' + mm + '/' + yyyy,
                    "day": dd,
                    "month": mm,
                    "year": yyyy
                };
            }
        },
        arrayDates: {
            get: function () {
                var date = new Date();
                var day = date.getDate() - 1;
                var month = date.getMonth() + 1;
                var ano = date.getFullYear();
                var arrayDate = [];

                for (var i = ano; i > 2009; i--) {
                    var months = (i > ano - 1) ? month : 12;
                    for (var j = months; j > 0; j--) {
                        var days = (i > ano - 1) && month == j ? day : 31;
                        for (var k = days; k > 0; k--) {
                            var dayFinish = k < 10 ? '0' + k : k;
                            var monthFinish = j < 10 ? '0' + j : j;
                            arrayDate.push(dayFinish + '/' + monthFinish + '/' + i);
                        }
                    }
                }
                return arrayDate;
            }
        }
    };*/

    // Numbers and currency module
    /*var numbersAndCurrency = {
        convert: {
            currencyStringToFloat: function (variavel) {
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
            },
            numberToCurrency: function (n, c, d, t) {
                //no final de cada linha é virgula mesmo, pois todas as variaveis sao do mesmo tipo
                c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
                return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
            }
        }
    };*/

    // DOM Manipulation module 

    var manipulateDOM = {
        actions4Listeners: {
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
                        manipulateDOM.expandTextarea(this.id);
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
                manipulateDOM.setVisibilityArrayElements(obj);
            }


        },

        setVisibilityArrayElements: function (obj) {
            $.each(obj, function (index, value) {
                $(value.field).css("display", value.property)
            });
        },

        expandTextarea: function (id) {
            var element = document.getElementById(id);
            if (element.scrollHeight != null) {
                var altura = element.scrollHeight + 'px';
                $(element).animate({
                    overflow: 'hidden',
                    height: 0,
                    height: altura
                });
            }
        },

        updateAutoCompleteWithLimit: function () {
            var autoCompleteFieldId = 'participantes';
            var maxTag = $('#totalParticipantes').val() == "" ? "0" : $('#totalParticipantes').val();
            var autoComplete = FLUIGC.autocomplete("#" + autoCompleteFieldId);
            autoComplete.destroy();
            autoComplete = FLUIGC.autocomplete("#" + autoCompleteFieldId, {
                maxTags: maxTag,
                onMaxTags: manipulateDOM.actions4Listeners.customMaxTagEvent
            });
            /**
             * @description Máscara para o campo de Nome(apenas letras) - Matrícula(apenas número). 
             */
            autoComplete.input().on({
                "blur": manipulateDOM.removeAlertDanger,
                "keypress": manipulateDOM.customMaskAutoComplete
            });

        },

        removeAlertDanger: function () {
            $(".alert-danger").remove();
        },

        changeToBreakLine: function () {
            var textWithComma = $(this).val();
            var textWithSpace = textWithComma.replace(/,/g, '\n');
            $("#participantesView").val(textWithSpace);
        },

        enablePopOvers: function () {
            FLUIGC.popover('.bs-docs-popover-hover', {
                trigger: 'hover',
                placement: 'auto'
            });
        },

        customMaskAutoComplete: function (e) {
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
        },

        expandTextareaHistorico: function (id) {
            var objTextArea = document.getElementById(id);
            if (objTextArea.scrollHeight > objTextArea.offsetHeight) {
                objTextArea.rows += 1;
            }
        },

        mostraHistorico: function () {
            var historico = 'historico';
            document.getElementById(historico).style.display = 'inline';
            manipulateDOM.expandTextarea(historico);
        }


    }

    // método do campo zoom de departamentos
    function setSelectedZoomItem(selectedItem) {
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
                cleanAllFieldsRelatedArea();
            });
        }
        /**
         * @description Limpa todos os campos de controle e seta o filtro do campo zoom de departamentos para não retornar nenhum valor.
         */
        function cleanAllFieldsRelatedArea() {
            $('[data-field-name="departamento"] [data-role=remove]').trigger('click');
            $("#guardaArea").val("");
            reloadZoomFilterValues('departamento', 'areaOrcamento,areaOrcamento');
        }
    }


    // CHECK IF WINDOW LOADED
    window.addEventListener("load", function () {
        window.loaded = true;
    });

    function logLoaded() {
        console.log("loaded");
    }

    (function listen() {
        if (window.loaded) {
            lifecycle.windowLoadEvents();
        } else {
            console.log("notLoaded");
            window.setTimeout(listen, 50);
        }
    })();




    // IIFE - Immediately Invoked Function Expression
    (function (init) {

        init(window.jQuery, window, document);

    }(function ($, window, document) {

        $(lifecycle.init);

    }));
    