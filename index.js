var soap = require('soap');

var url = 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl';
soap.createClient(url, function (err, client) {
  client.getValoresSeriesVO({ 
    in0: [195],
    in1: "01/03/2023",
    in2: "16/03/2023",
  }, function (err, result) {
    if (err) return console.log(err);
    //console.log(result.getUltimoValorVOReturn.ultimoValor.svalor['$value']);getValorEspecial
    console.log(result.getValoresSeriesVOReturn);
  });
});

//wsdl request
/*var client = new XMLHttpRequest();
client.open('GET', 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl');
client.onreadystatechange = function () {
  var request = client.responseText;//here the wsdl

        //SOAP request
        var client2 = new XMLHttpRequest();
        client2.open('POST', 'http://83.212.96.238:8080/DgesvSampleWs/DgesvSampleWsService', true);

        client2.onreadystatechange = function () {
          if (client2.readyState == 4) {
            if (client2.status == 200) {
              console.log(client.responseText);//here the response
            }
          }
        }
        client2.setRequestHeader('Content-Type', 'text/xml');
        client2.send(request);
}

client.send();*/