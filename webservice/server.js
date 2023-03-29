var express = require('express'), app = express(), port = process.env.PORT || 3333;

var soap = require('soap');
const fs = require('fs');

app.listen(port);

app.get("/webservice", (req, res) => {
    const serie = req.query.serie;
    const data_inicio = req.query.datainicio;
    const data_fim = req.query.datafim;

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    var url = 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl';
    
    soap.createClient(url, function (err, client) {
        client.getValoresSeriesVO({
            in0: [serie],
            in1: data_inicio,
            in2: data_fim,
        }, function (err, result) {
            if (err) {
                return console.log(err)
            };
            // Removido o recarregamento de pagina do live server para executar esse comando
            //writeJsonFile('valoresVOReturn', result.getValoresSeriesVOReturn.getValoresSeriesVOReturn.valores)
            res.json(result.getValoresSeriesVOReturn.getValoresSeriesVOReturn.valores)
            
        });
    });
});

// escrever os dados em um arquivo local (json)
function writeJsonFile(fileName, fileData){
    fs.writeFile(`${fileName}.json`, JSON.stringify(fileData, null, 2), err => {
      if(err) throw new Error('Erro: '+ err)
  
      console.log(`${fileName} Dados salvos com sucesso!`)
    })
}



console.log(`Servidor rodando na porta: ${port}`);