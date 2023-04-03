// Altera o método principal entre JSON pré carregado ou online
//var preJson = false;

// Datas inputs

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

// Fim datas

// Porcentagem CDI
const inputPctCDI = document.querySelector('#pct-cdi')

// Carregamento dos dados na tabela

const containerTabela = document.querySelector('.tabela');
const tableHead = document.querySelector('table thead');
const tableBody = document.querySelector('table tbody');

var idReg = 'poupanca';

const carregarDadosValoresPeriodo = async (data, dtInicio, dtFim) => {
    
    tableBody.innerHTML = '';
    
    if (idReg == 'poupanca') {
        tableHead.innerHTML = `<tr>
                             <th>Data Inicial</th>
                             <th>Data Final</th>
                             <th>Rendimento</th>
                           </tr>`;
    } else if (idReg == 'cdb') {
        tableHead.innerHTML = `<tr>
                             <th>Data Consolidação</th>
                             <th>Rendimento</th>
                             <th>IR 180 dias</th>
                             <th>IR 360 dias</th>
                             <th>IR 720 dias</th>
                             <th>IR mais de 720 dias</th>
                           </tr>`;
    }

    for (let i = 0; i < data.valores.length; i++) {
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;

        let dataRef = new Date(colocarDataInput(dataFormatada));
        
        let pctRendimento = data.valores[i].svalor['$value'];
        
        if (dataRef <= dtFim && dataRef >= dtInicio) {
            if (idReg == 'poupanca') {
                tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${dataFormatada}</td>
                                    <td>${data.valores[i].svalor['$value']}</td>
                                </tr>`;
            } else if (idReg =='cdb') {
                tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${data.valores[i].svalor['$value']}</td>
                                    <td>${calcularPctRendimentoAposIRCDB(calcularRendimentoAposIRCDB(180, 
                                        (Number(pctRendimento)/100)*100), 100)}</td>
                                    <td>${calcularPctRendimentoAposIRCDB(calcularRendimentoAposIRCDB(360, 
                                        (Number(pctRendimento)/100)*100), 100)}</td>
                                    <td>${calcularPctRendimentoAposIRCDB(calcularRendimentoAposIRCDB(720, 
                                        (Number(pctRendimento)/100)*100), 100)}</td>
                                    <td>${calcularPctRendimentoAposIRCDB(calcularRendimentoAposIRCDB(721, 
                                        (Number(pctRendimento)/100)*100), 100)}</td>
                                </tr>`;
            }
        }
    }
}

const valorInvestido = document.querySelector('#valor-invest')

const calcularRendimento = async (data, dtInicio, dtFim) => {
    //const response = await fetch(`./webservice/${value}.json`);
    //const data = await response.json();

    var pctCDI = 100;
    
    tableBody.innerHTML = '';
    if (idReg == 'poupanca') {
        tableHead.innerHTML = `<tr>
                             <th>Data</th>
                             <th>Rendimento</th>
                             <th>Média Rendimento</th>
                             <th>Valor Investido</th>
                             <th>Rendimento R$</th>
                             <th>Média R$</th>
                           </tr>`;
    } else if (idReg == 'cdb'){
        tableHead.innerHTML = `<tr>
                             <th>Data Consolidação</th>
                             <th>Rendimento</th>
                             <th>Valor Investido</th>
                             <th>IR 180 dias (a. m.)</th>
                             <th>IR 360 dias (a. m.)</th>
                             <th>IR 720 dias (a. m.)</th>
                             <th>IR mais de 720 dias (a. m.)</th>
                           </tr>`;
        pctCDI = inputPctCDI.value;
    }

    var rendimento = 0;
    var cont = 1;
    
    for (let i = 0; i < data.valores.length; i++) {
        
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;
        let dataRef = new Date(colocarDataInput(dataFormatada));
        
        if (dataRef <= dtFim && dataRef >= dtInicio) {
            
            let pctRendimento = (Number(data.valores[i].svalor['$value'])*pctCDI)/100;
            rendimento += Number(pctRendimento);
            let rendReal = currencyToNumber(valorInvestido.value) * (Number(pctRendimento)/100);
            let rendRealMedia = currencyToNumber(valorInvestido.value) * ((rendimento/cont)/100);

            
            if (idReg == 'poupanca') {
                tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${pctRendimento.toFixed(4)}</td>
                                    <td>${(rendimento/cont).toFixed(4)}</td>
                                    <td>${numberToCurrency(currencyToNumber(valorInvestido.value))}</td>
                                    <td>${numberToCurrency(rendReal.toFixed(2))}</td>
                                    <td>${numberToCurrency(rendRealMedia.toFixed(2))}</td>
                                </tr>`;
            } else if (idReg =='cdb') {
                tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${pctRendimento.toFixed(4)}</td>
                                    <td>${numberToCurrency(currencyToNumber(valorInvestido.value))}</td>
                                    <td>${numberToCurrency(calcularRendimentoAposIRCDB(180,(Number(pctRendimento)/100)*currencyToNumber(valorInvestido.value).toFixed(2)))}</td>
                                    <td>${numberToCurrency(calcularRendimentoAposIRCDB(360,(Number(pctRendimento)/100)*currencyToNumber(valorInvestido.value).toFixed(2)))}</td>
                                    <td>${numberToCurrency(calcularRendimentoAposIRCDB(720,(Number(pctRendimento)/100)*currencyToNumber(valorInvestido.value).toFixed(2)))}</td>
                                    <td>${numberToCurrency(calcularRendimentoAposIRCDB(721,(Number(pctRendimento)/100)*currencyToNumber(valorInvestido.value).toFixed(2)))}</td>
                                </tr>`;
            }

            cont++;
        }
    }
}

const tempoInvestValor = document.querySelector('#tempo-invest')
const tempoInvestQtde = document.querySelector('#sel-tempo')

const calcularRendimentoPorTempo = async (data, dtInicio, dtFim) => {
    //const response = await fetch(`./webservice/${value}.json`);
    //const data = await response.json();
    
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

    var tempoEmDias = calcularTempoEmDias(tempoInvestValor.value, tempoInvestQtde.value);

    var rendimento = 0;
    var cont = 1;
    
    for (let i = 0; i < data.valores.length; i++) {
        
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;
        let dataRef = new Date(colocarDataInput(dataFormatada));

        if (dataRef <= dtFim && dataRef >= dtInicio) {
            if (idReg == 'poupanca') {
                rendimento += Number(data.valores[i].svalor['$value']);
            } else if (idReg == 'cdb') {
                rendimento += calcularPctRendimentoAposIRCDB(calcularRendimentoAposIRCDB(tempoEmDias, 
                    (Number(data.valores[i].svalor['$value'])/100)*100), 100);
            }
            cont++;
        }
    }
    
    var mediaRendimento = (rendimento/(cont-1)).toFixed(4);
    var tempoEmMeses = calcularTempoEmMeses(tempoInvestValor.value, tempoInvestQtde.value);
    
    var investimentoTotal = calcularInvestimento(currencyToNumber(valorInvestido.value), tempoEmMeses, 
                                                                    mediaRendimento);

    var rendimentoTotal = investimentoTotal-currencyToNumber(valorInvestido.value);

    let dataInicio = new Date().toLocaleString().split(',')[0];
    let dataFim = addMesesData(dataInicio, tempoEmMeses*30);

    tableBody.innerHTML += `<tr>
                                    <td>${dataInicio}</td>
                                    <td>${tempoInvestValor.value + " " + tempoInvestQtde.options[tempoInvestQtde.options.selectedIndex].innerHTML}</td>
                                    <td>${dataFim}</td>
                                    <td>${mediaRendimento}</td>
                                    <td>${numberToCurrency(currencyToNumber(valorInvestido.value))}</td>
                                    <td>${numberToCurrency(rendimentoTotal)}</td>
                                    <td>${numberToCurrency(investimentoTotal)}</td>
                                </tr>`;

}

// Métodos formatadores de conteúdo

function calcularInvestimento(valor, meses, juros) {
    for (let i = 1; i <= meses; i++) {
        valor += valor*(juros/100)
    }
    return valor;
}

function addMesesData(data, meses) {
    data = new Date();
    data.setDate(data.getDate() + meses);
    return data.toLocaleString().split(',')[0];
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

function calcularTempoEmDias(valor, medida) {
    if (medida == 'mes') {
        return Number((valor*30));
    } else if (medida == 'ano') {
        return valor*365;
    } else {
        return Number(valor);
    }
}

// Tira a diferença entre duas datas em dias
function subtrairDatas(data_inicial, data_final) {
    const diffInMs   = new Date(data_final) - new Date(data_inicial)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays;
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

// Eventos troca de função e calculos

const btnCalcular = document.querySelector('#btn-calcular');
const selectFuncao = document.querySelector('#sel-funcao');

const loader = document.querySelector('.loader');

const containerValorInvestido = document.querySelector('.v-invest');
const containerTempoInvestido = document.querySelector('.t-invest');

const containerPorcentCDI = document.querySelector('.porcent-cdi');

containerValorInvestido.style.display = 'none';
containerTempoInvestido.style.display = 'none';
containerPorcentCDI.style.display = 'none';

selectFuncao.addEventListener('change', () => {
    if (selectFuncao.value == 'valores_periodo') {
        containerValorInvestido.style.display = 'none';
        containerTempoInvestido.style.display = 'none';
    } else if (selectFuncao.value == 'media_rendimento') {
        containerValorInvestido.style.display = 'flex';
        containerTempoInvestido.style.display = 'flex';
    }
})

btnCalcular.addEventListener('click', async (event) => {
    event.preventDefault();

    if (validarInputs()) {
        containerTabela.style.display = 'none';
        loader.style.display = 'block';

        await buscarDadosServidor(dataInicial.valueAsDate.toLocaleString().split(',')[0], 
                                    dataFinal.valueAsDate.toLocaleString().split(',')[0]);

        loader.style.display = 'none';
        containerTabela.style.display = 'block';
    }
    
    /* Para o JSON pré carregado
    if (preJson) {
        eventoCliqueBotaoCalcular();
    } else {
        await buscarDadosServidor(dataInicial.valueAsDate.toLocaleString().split(',')[0], 
                                   dataFinal.valueAsDate.toLocaleString().split(',')[0]);
        //eventoCliqueBotaoCalcular();
    }*/
})

// Requisição ao servidor dos dados do webservice

const buscarDadosServidor = async (dataInicial, dataFinal) => {
    const response = await fetch(`http://localhost:3333/webservice/?serie=${codigoSerie}&datainicio=${dataInicial}&datafim=${dataFinal}`,
    {   method: 'GET',
        //mode: 'no-cors',
    })
    
    const dados = await response.json();

    eventoCliqueBotaoCalcular(dados);

}

// Verifica se um objeto está vazio
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function eventoCliqueBotaoCalcular(dadosJson) {
    if (selectFuncao.value == 'valores_periodo') {
        carregarDadosValoresPeriodo(dadosJson/*'valoresVOReturn'*/, new Date(dataInicial.value), new Date(dataFinal.value));
    } else if (selectFuncao.value == 'media_rendimento') {
        if (valorInvestido.value.length > 0) {
            if (tempoInvestValor.value.length > 0) {
                if (tempoInvestQtde.value == 'dia') {
                    if (tempoInvestValor.value < 30) {
                        alert("É necessário um tempo de 30 dias ou mais para ter um cálculo de rendimento!")
                    } else {
                        calcularRendimentoPorTempo(dadosJson/*'valoresVOReturn'*/, new Date(dataInicial.value), new Date(dataFinal.value));
                    }
                } else {
                    calcularRendimentoPorTempo(dadosJson/*'valoresVOReturn'*/, new Date(dataInicial.value), new Date(dataFinal.value));
                }
            } else {
                calcularRendimento(dadosJson/*'valoresVOReturn'*/, new Date(dataInicial.value), new Date(dataFinal.value));
            }
        } else {
            alert("Para calcular o rendimento preencha o campo Valor Investido!")
        }
    }
}

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

// Evento clique navbar para escolha do calculo

const navbarButtons = document.querySelectorAll('.navbar a');
const tituloSecao = document.querySelector('.principal h1')

const tituloHome = 'Bem vindo a calculadora finaceira!'; // com dados em tempo real do Banco Central do Brasil
const tituloPoupanca = 'Poupança - Dados Banco Central do Brasil';
const tituloCDB = 'CDB - Dados Banco Central do Brasil';
const tituloTesouroDireto = 'Tesouro Direto - Dados Banco Central do Brasil';

var codigoSerie = 195;

// Imposto de Renda CDB
const IR180 = 22.5; // Aplicações de até 180 dias: 22,5%; 
const IR360 = 20;   // Aplicações entre 181 e 360 dias: 20%; 
const IR720 = 17.5; // Aplicações entre 361 e 720 dias: 17,5%; 
const IR999 = 15;   // Aplicações maiores do que 720 dias: 15%. 

function calcularRendimentoAposIRCDB(diasInvestidos, rendimento) {
    let IR = 0;
    if (diasInvestidos <= 180) {
        IR = IR180;
    } else if (diasInvestidos > 180 && diasInvestidos <= 360) {
        IR = IR360;
    } else if (diasInvestidos > 360  && diasInvestidos <= 720) {
        IR = IR720;
    } else {
        IR = IR999;
    }
    return rendimento - ((rendimento*IR)/100);
    /*if (diasInvestidos <= 180) {
        return rendimento - ((rendimento*IR180)/100);
    } else if (diasInvestidos > 180 && diasInvestidos <= 360) {
        return rendimento - ((rendimento*IR360)/100);
    } else if (diasInvestidos > 360  && diasInvestidos <= 720) {
        return rendimento - ((rendimento*IR720)/100);
    } else {
        return rendimento - ((rendimento*IR999)/100);
    }*/
}

function calcularPctRendimentoAposIRCDB(rendimentoAposDescIR, investimentoTotal) {
    return ((((rendimentoAposDescIR*100)/investimentoTotal)*inputPctCDI.value)/100).toFixed(2);
}

for (let i = 0; i < navbarButtons.length; i++) {
    navbarButtons[i].addEventListener('click', ({target}) => {
        trocarCalculoFinanceiro(target.id);
        idReg = target.id;
    })
}

function trocarCalculoFinanceiro(id) {
    switch (id) {
        case 'home':
            tituloSecao.innerHTML = tituloHome;
            displayCDBFields(false);
            break;
        case 'poupanca':
            tituloSecao.innerHTML = tituloPoupanca;
            codigoSerie = 195;
            displayCDBFields(false);
            break;
        case 'cdb':
            tituloSecao.innerHTML = tituloCDB;
            codigoSerie = 4391;
            displayCDBFields(true);
            break;
        case 'tesouro-direto':
            tituloSecao.innerHTML = tituloTesouroDireto;
            displayCDBFields(false);
            break;
    
        default:
            break;
    }
}

function displayCDBFields(value) {
    if (value) {
        containerPorcentCDI.style.display = 'flex';
    } else {
        containerPorcentCDI.style.display = 'none';
    }
}

function validarInputs() {
    if (idReg == 'cdb') {
        if (inputPctCDI.value <= 0) {
            alert('A porcentagem do CDI deve ser informada e estar acima de 0!')
            return false;
        }
    }
    return true;
}
