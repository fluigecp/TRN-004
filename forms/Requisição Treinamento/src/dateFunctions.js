    "use strict";
    /**
     * @module  DateFunctions
     */
    var dateFunctions = (function () {
        var calendar = {
            /**
             * @description Gera um objeto calendário e atribui a um objeto.
             * @param obj Objeto que receberá o calendário.
             * @param data O modo que o calendário será retornado, podendo ser 'date' ou 'hour'
             * 
             */
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
                        disabledDates: arrayDates.get(),
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
            /**
             * @description Retorna um objeto com informações relacionadas a data atual.
             */
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
        };
        var arrayDates = {
            /**
             * @description Retorna um array de datas. 
             * @return arrayDate[]: array de datas
             */
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
        };
        return {
            calendar: calendar,
            arrayDates: arrayDates
        }
    })();
    