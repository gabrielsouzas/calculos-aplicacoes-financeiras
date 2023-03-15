const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  //await page.goto('https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca');

  /*await page.goto("https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca", {
    waitUntil: "load",
  }).catch((err) => console.log("error loading url", err));*/

  /*await Promise.all([
    page.goto("https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca", {
      waitUntil: "domcontentloaded",
    }),
    page.waitForSelector("table", { visible: true }),
  ]);*/

  await Promise.all([
    page.goto("https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca", {
      waitUntil: "domcontentloaded",
    }),
    //page.waitForNetworkIdle({ idleTime: 30000 }),
    page.waitForNavigation({ timeout: 60000 }),
  ]);
  
  const tableArray = await page.evaluate(() => {
    // toda essa função será executada no browser

    // pega imagens que estão na parte de posts
    const nodeList = document.querySelector('title');

    //console.log(nodeList)
    

    // transforma o NodeList em array
    //const imgArray = [...nodeList];

    // transformar os nodes (elementos html) em objetos JS
    /*const imgList = imgArray.map( ({src}) => ({
        src
    }))*/

    // colocar para fora da função
    return nodeList;

  });

  // escrever os dados em um arquivo local (json)
  /*fs.writeFile('instagram.json', JSON.stringify(imgList, null, 2), err => {
    if(err) throw new Error('something went wrong')

    console.log('well done!')
  })*/

  console.log(tableArray.innerHTML)

  await browser.close();
})();