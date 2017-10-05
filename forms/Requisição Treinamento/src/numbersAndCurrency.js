    "use strict";
    /**
     * @module  mumbersAndCurrency
     */
    var numbersAndCurrency = (function () {
            var convert = {
                /**
                 * @description Converte uma string monetária para um número float
                 * @param variavel String com o valor a ser convertido
                 * @return Número float já convertido
                 */
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
                /**
                 * @description Converte um número em um objeto monerário string
                 * @param n  número a converter
                 * @param c  numero de casas decimais
                 * @param d  separador decimal
                 * @param t  separador milhar
                 */
                numberToCurrency: function (n, c, d, t) {
                    //no final de cada linha é virgula mesmo, pois todas as variaveis sao do mesmo tipo
                    var s, i, j;
                    c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
                    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
                }
        };
        return {
            convert: convert
        }
    })();
