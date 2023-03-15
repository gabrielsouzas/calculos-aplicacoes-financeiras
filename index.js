//wsdl request
var client = new XMLHttpRequest();
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

client.send();