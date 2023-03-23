var soap = require('soap');
const fs = require('fs');

var data = new Date();
data.setDate(data.getDate() - 60);

var url = 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl';
soap.createClient(url, function (err, client) {
  client.getValoresSeriesVO({ 
    in0: [195],
    in1: data.toLocaleString().split(',')[0],
    in2: new Date(Date.now()).toLocaleString().split(',')[0],
  }, function (err, result) {
    if (err) return console.log(err);
    writeJsonFile('valoresVOReturn', result.getValoresSeriesVOReturn.getValoresSeriesVOReturn.valores )
  });
});

// escrever os dados em um arquivo local (json)
function writeJsonFile(fileName, fileData){
  fs.writeFile(`${fileName}.json`, JSON.stringify(fileData, null, 2), err => {
    if(err) throw new Error('Erro: '+ err)

    console.log(`${fileName} Dados salvos com sucesso!`)
  })
}