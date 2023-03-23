var express = require('express'), app = express(), port = process.env.PORT || 3333;

var soap = require('soap');
const fs = require('fs');

app.listen(port);

//app.get('/teste', function(req, res) { res.json({hello : 'world'});})

app.post('/teste', function(req, res) { 
    var data = new Date();
    data.setDate(data.getDate() - 60);

    //const { teste } = req.params;

    //console.log(teste)

    var url = 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl';
    soap.createClient(url, function (err, client) {
        client.getValoresSeriesVO({
            in0: [195],
            in1: data.toLocaleString().split(',')[0],
            in2: new Date(Date.now()).toLocaleString().split(',')[0],
        }, function (err, result) {
            if (err) return console.log(err);
            writeJsonFile('valoresVOReturn', result.getValoresSeriesVOReturn.getValoresSeriesVOReturn.valores)
            //res.json(result.getValoresSeriesVOReturn.getValoresSeriesVOReturn.valores)
        });
    });
})

// escrever os dados em um arquivo local (json)
function writeJsonFile(fileName, fileData){
    fs.writeFile(`${fileName}.json`, JSON.stringify(fileData, null, 2), err => {
      if(err) throw new Error('Erro: '+ err)
  
      console.log(`${fileName} Dados salvos com sucesso!`)
    })
}



console.log(`Servidor rodando na porta: ${port}`);