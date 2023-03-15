# Calcular rendimentos de aplicações financeiras

## Em desenvolvimento

</br>

## Consumo do WebService BCB

O SGS - Sistema Gerenciador de Séries Temporais disponibiliza serviços de consulta utilizando a tecnologia de WebServices. As definições (wsdl) dos serviços estão na seguinte URL: [FachadaWSSGS?wsdl](https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl)

Para consumir o webservice do SGS, é necessário importar a cadeia de certificados do Banco Central, que pode ser encontrada na página <https://www.bcb.gov.br/estabilidadefinanceira/certificacaodigital>.

### Segue abaixo uma breve descrição dos serviços disponibilizados: 

>Obs.: para as séries de periodicidade trimestral e quadrimestral o valor retornado pelo sistema refere-se a todo o período, ainda que a data retornada informe o mês do início do período no formato mm/aaaa. Por exemplo, ainda que uma série trimestral referente ao 2º trimestre de 2010 traga a data 4/2010 (início do trimestre), o valor corresponde a todo o trimestre. De modo semelhante, para séries de periodicidade semanal ou quinzenal o valor retornado pelo sistema refere-se a todo o período, ainda que a data retornada informe o início do período no formato dd/mm/aaaa. Por exemplo, ainda que uma série semanal referente ao mês de fevereiro de 2017 traga as datas 6/2/2017, 13/2/2017, 20/2/2017 e 27/2/2017 (segundas-feiras), os valores correspondem à cada semana inteira.

**getUltimoValorVO** - Recupera o último valor de uma determinada série e retorna um objeto do tipo WSSerieVO.
  * Parâmetros:
     * long codigoSerie - Código da série.
  * Retorno:
     * WSSerieVO - Objeto série.

**getUltimoValorXML**- Recupera o último valor de uma determinada série e retorna o resultado em formato XML.
  * Parâmetros:
     * long codigoSerie - Código da série.
  * Retorno:
     * String - String contendo o resultado da consulta em formato XML.

**getValor** - Recupera o valor de uma série em uma determinada data (dd/MM/aaaa).
  * Parâmetros:
     * long codigoSerie - Código da série.
     * String data - String contendo a data (dd/MM/aaaa) do valor a ser pesquisado.
  * Retorno:
     * BigDecimal - Objeto contendo o valor.

**getValorEspecial** - Recupera o valor de uma série especial em um período.
  * Parâmetros:
     * long codigoSerie - Código da série.
     * String data - String contendo a data (dd/MM/aaaa) inicial.
     * String dataFim - String contendo a data (dd/MM/aaaa) final.
  * Retorno:
     * BigDecimal - Objeto contendo o valor.

**getValoresSeriesXML** - Recupera os valores de uma ou mais séries dentro de um determinado período. O resultado da consulta é devolvido ao cliente em formato XML.
  * Parâmetros:
     * long[] codigosSeries - Lista(array) dos códigos das séries.
     * String dataInicio - String contendo a data (dd/MM/aaaa) inicial.
     * String dataFim - String contendo a data (dd/MM/aaaa) final.
  * Retorno:
     * String - String contendo o resultado da consulta em formato XML.

**getValoresSeriesVO** - Recupera os valores de uma ou mais séries dentro de um determinado período e retorna o resultado em forma de Array de objetos do tipo WSSerieVO.
  * Parâmetros:
     * long[] codigosSeries - Lista(array) dos códigos das séries.
     * String dataInicio - String contendo a data (dd/MM/aaaa) inicial.
     * String dataFim - String contendo a data (dd/MM/aaaa) final.
  * Retorno:
     * WSSerieVO - Lista(array) de objeto série.

### Links de interesse:

Para obter informações técnicas sobre o uso dos serviços, envie um e-mail para **dine5.deinf@bcb.gov.br**

Informações sobre XML e XML Schema, acesse: <http://www.w3c.org>
