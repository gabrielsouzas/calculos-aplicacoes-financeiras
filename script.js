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
        //console.log(data.valores[i].svalor['$value'])
        let dataFormatada = `${putZero(data.valores[i].dia['$value'])}/${putZero(data.valores[i].mes['$value'])}/${data.valores[i].ano['$value']}`;

        let dataRef = new Date(colocarDataInput(dataFormatada));

        if (dataRef <= dtFim && dataRef >= dtInicio) {

            rendimento += Number(data.valores[i].svalor['$value']);

            let rendReal = Number(valorInvestido.value.replaceAll('.', '')) * (Number(data.valores[i].svalor['$value'])/100);

            let rendRealMedia = Number(valorInvestido.value.replaceAll('.', '')) * ((rendimento/cont)/100);

            tableBody.innerHTML += `<tr>
                                    <td>${dataFormatada}</td>
                                    <td>${data.valores[i].svalor['$value']}</td>
                                    <td>${rendimento/cont}</td>
                                    <td>${valorInvestido.value}</td>
                                    <td>${rendReal}</td>
                                    <td>${rendRealMedia}</td>
                                </tr>`;

            cont++;
        }

        
    }

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
        calcularRendimento('valoresVOReturn', new Date(dataInicial.value), new Date(dataFinal.value));
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