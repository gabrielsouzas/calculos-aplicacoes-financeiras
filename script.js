/* Seta as datas inicial para 30 dias atrás e a final para a atual */
const dataInicial = document.querySelector('#data-inicial')
const dataFinal = document.querySelector('#data-final')

const dataAtual = new Date(Date.now()).toLocaleString().split(',')[0];
//const dataFormatada = dataAtual.split('/');

var data = new Date();
data.setDate(data.getDate() - 30);
dataInicial.value = colocarDataInput(data.toLocaleString().split(',')[0]);

dataFinal.value = colocarDataInput(dataAtual);

function colocarDataInput(data) {
    let dataArray = data.split('/');
    return `${dataArray[2]}-${dataArray[1]}-${dataArray[0]}`
}

/* Fim datas */

const tableHead = document.querySelector('table thead');
const tableBody = document.querySelector('table tbody');

const carregarDadosValoresPeriodo = async (value, dtInicio, dtFim) => {
    const response = await fetch(`./${value}.json`);
    const data = await response.json();
    
    tableBody.innerHTML = '';
    tableHead.innerHTML = `<tr>
                             <th>Data Inicial</th>
                             <th>Data Final</th>
                             <th>Rendimento</th>
                           </tr>`;

    for (let i = 0; i < data.valores.length; i++) {
        //console.log(data.valores[i].svalor['$value'])
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;

        let dataRef = new Date(colocarDataInput(dataFormatada));
        
        if (dataRef <= dtFim && dataRef >= dtInicio) {
            tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${dataFormatada}</td>
                                    <td>${data.valores[i].svalor['$value']}</td>
                                </tr>`;
        }

        
    }

}

const valorInvestido = document.querySelector('#valor-invest')

const calcularRendimento = async (value, dtInicio, dtFim) => {
    const response = await fetch(`./${value}.json`);
    const data = await response.json();
    
    tableBody.innerHTML = '';
    tableHead.innerHTML = `<tr>
                             <th>Data</th>
                             <th>Rendimento</th>
                             <th>Média Rendimento</th>
                             <th>Valor Investido</th>
                             <th>Rendimento R$</th>
                             <th>Média R$</th>
                           </tr>`;

    var rendimento = 0;
    var cont = 1;
    

    for (let i = 0; i < data.valores.length; i++) {
        
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;
        let dataRef = new Date(colocarDataInput(dataFormatada));

        if (dataRef <= dtFim && dataRef >= dtInicio) {

            rendimento += Number(data.valores[i].svalor['$value']);
            let rendReal = currencyToNumber(valorInvestido.value) * (Number(data.valores[i].svalor['$value'])/100);
            let rendRealMedia = currencyToNumber(valorInvestido.value) * ((rendimento/cont)/100);

            tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${data.valores[i].svalor['$value']}</td>
                                    <td>${(rendimento/cont).toFixed(4)}</td>
                                    <td>${numberToCurrency(currencyToNumber(valorInvestido.value))}</td>
                                    <td>${numberToCurrency(rendReal.toFixed(2))}</td>
                                    <td>${numberToCurrency(rendRealMedia.toFixed(2))}</td>
                                </tr>`;

            cont++;
        }
    }
}

const tempoInvestValor = document.querySelector('#tempo-invest')
const tempoInvestQtde = document.querySelector('#sel-tempo')

const calcularRendimentoPorTempo = async (value, dtInicio, dtFim) => {
    const response = await fetch(`./${value}.json`);
    const data = await response.json();
    
    tableBody.innerHTML = '';
    tableHead.innerHTML = `<tr>
                             <th>Data Inicio</th>
                             <th>Tempo</th>
                             <th>Data Fim</th>
                             <th>Média Rendimento</th>
                             <th>Valor Investido</th>
                             <th>Rendimento R$</th>
                             <th>Total R$</th>
                           </tr>`;

    var rendimento = 0;
    var cont = 1;
    
    for (let i = 0; i < data.valores.length; i++) {
        
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;
        let dataRef = new Date(colocarDataInput(dataFormatada));

        if (dataRef <= dtFim && dataRef >= dtInicio) {

            rendimento += Number(data.valores[i].svalor['$value']);
            //let rendReal = currencyToNumber(valorInvestido.value) * (Number(data.valores[i].svalor['$value'])/100);
            //let rendRealMedia = currencyToNumber(valorInvestido.value) * ((rendimento/cont)/100);
            /*
            tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${data.valores[i].svalor['$value']}</td>
                                    <td>${(rendimento/cont).toFixed(4)}</td>
                                    <td>${numberToCurrency(currencyToNumber(valorInvestido.value))}</td>
                                    <td>${numberToCurrency(rendReal.toFixed(2))}</td>
                                    <td>${numberToCurrency(rendRealMedia.toFixed(2))}</td>
                                </tr>`;*/

            cont++;
        }
    }

    var mediaRendimento = (rendimento/(cont-1)).toFixed(4);
    var tempoEmMeses = calcularTempoEmMeses(tempoInvestValor.value, tempoInvestQtde.value);
    
    var investimentoTotal = calcularInvestimento(currencyToNumber(valorInvestido.value), tempoEmMeses, 
                                                                    mediaRendimento);

    var rendimentoTotal = investimentoTotal-currencyToNumber(valorInvestido.value);

    tableBody.innerHTML += `<tr>
                                    <td>${new Date().toLocaleString().split(',')[0]}</td>
                                    <td>${tempoInvestValor.value + " " + tempoInvestQtde.options[tempoInvestQtde.options.selectedIndex].innerHTML}</td>
                                    <td>${dataFim}</td>
                                    <td>${mediaRendimento}</td>
                                    <td>${numberToCurrency(currencyToNumber(valorInvestido.value))}</td>
                                    <td>${numberToCurrency(rendimentoTotal)}</td>
                                    <td>${numberToCurrency(investimentoTotal)}</td>
                                </tr>`;

}

function calcularInvestimento(valor, meses, juros) {
    for (let i = 1; i <= meses; i++) {
        valor += valor*(juros/100)
    }
    return valor;
}

function calcularTempoEmMeses(valor, medida) {
    if (medida == 'dia') {
        return Number((valor/30).toString().split('.')[0]);
    } else if (medida == 'ano') {
        return valor*12;
    } else {
        return Number(valor);
    }
}

function numberToCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function currencyToNumber(value) {
    return Number(value.toString().replaceAll(".", "").replaceAll(",", "."))
}

function putZero(data) {
    if (data.length == 1) {
        return `0${data}`;
    }
    return data;
}

const btnCalcular = document.querySelector('#btn-calcular');
const selectFuncao = document.querySelector('#sel-funcao');

btnCalcular.addEventListener('click', (event) => {
    event.preventDefault();

    if (selectFuncao.value == 'valores_periodo') {
        carregarDadosValoresPeriodo('valoresVOReturn', new Date(dataInicial.value), new Date(dataFinal.value));
    } else if (selectFuncao.value == 'media_rendimento') {
        if (valorInvestido.value.length > 0) {
            if (tempoInvestValor.value.length > 0) {
                if (tempoInvestQtde.value == 'dia') {
                    if (tempoInvestValor.value < 30) {
                        alert("É necessário um tempo de 30 dias ou mais para ter um cálculo de rendimento!")
                    } else {
                        calcularRendimentoPorTempo('valoresVOReturn', new Date(dataInicial.value), new Date(dataFinal.value));
                    }
                } else {
                    calcularRendimentoPorTempo('valoresVOReturn', new Date(dataInicial.value), new Date(dataFinal.value));
                }
            } else {
                calcularRendimento('valoresVOReturn', new Date(dataInicial.value), new Date(dataFinal.value));
            }
        } else {
            alert("Para calcular o rendimento preencha o campo Valor Investido!")
        }
    }
})

// Mascara Moeda
String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};

function mascaraMoeda(campo, evento) {
    var tecla = (!evento) ? window.event.keyCode : evento.which;
    var valor = campo.value.replace(/[^\d]+/gi, '').reverse();
    var resultado = "";
    var mascara = "##.###.###,##".reverse();
    for (var x = 0, y = 0; x < mascara.length && y < valor.length;) {
        if (mascara.charAt(x) != '#') {
            resultado += mascara.charAt(x);
            x++;
        } else {
            resultado += valor.charAt(y);
            y++;
            x++;
        }
    }
    campo.value = resultado.reverse();
}