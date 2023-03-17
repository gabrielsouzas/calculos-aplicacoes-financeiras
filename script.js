
const carregarDados = async (value, element = '', filter = '') => {
    const response = await fetch(`./${value}.json`);
    const data = await response.json();
    //const dataArrayString = JSON.stringify(data)
    

    // formatar os dados para enviar para o html
    //const htmlList = data.map( valores => `<li><span>${valores.svalor['$value']}</span></li>`).join('')


    for (let i = 0; i < data.valores.length; i++) {
        console.log(data.valores[i].svalor['$value'])
    }

    

    /*
    var html;
    if (filter != '') {
        html = data.map( dt => `<li><ul>${dt[`${filter}`]}</ul></li>`).join('') // .join('') - separador das strings
    } else {
        /*html = data.map( dt => `<div class="user">
                                    <img src="${dt.avatar_url}">
                                    <span class="login">${dt.login}</span>
                                </div>`).join('')*//*
        html = data.map( dt => {
            let user = addElement('div', element, '', '', 'user');
            addElement('img', user, '', dt.avatar_url, '');
            addElement('span', user, dt.login, '', `login`);
        })
    }*/

    // colocar no html
    //element.innerHTML = html;
}

carregarDados('valoresVOReturn')