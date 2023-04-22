const right_button = document.querySelector('#right_button');
const left_button = document.querySelector('#left_button');
const asideComponents = document.querySelector('#aside__components');
const tableComponents = document.querySelector('#table');
const buttonClose = document.querySelector('#buttonClose');
let isDetailsSectionRendered = true;
let isAsideSectionRendered;



window.addEventListener('load', ()=>{
    if(localStorage.getItem('currentPage')){
        let num = localStorage.getItem('currentPage')
        let url = `https://swapi.dev/api/people/?page=${+num}`;
        loadPeople(url);
    } else{
        localStorage.setItem('currentPage', '1');
        loadPeople('https://swapi.dev/api/people/');
    }
});
right_button.addEventListener('click', rightClick);
left_button.addEventListener('click', leftClick);
buttonClose.addEventListener('click', openDiv);



function changeColor() {
    //проверка цвета кнопок
    let previousPage = localStorage.getItem('previousPage');
    let nextPage = localStorage.getItem('nextPage');
    if (nextPage == 'null') {
        right_button.style.cssText = `background-image: url("https://i.ibb.co/ccfPvpP/arrow.png");`;
        left_button.style.cssText = `background-image: url("https://i.ibb.co/yfPWYNv/arrow1.png");`;
    } else if (previousPage == 'null') {
        right_button.style.cssText = `background-image: url("https://i.ibb.co/yfPWYNv/arrow1.png");`;
        left_button.style.cssText = `background-image: url("https://i.ibb.co/ccfPvpP/arrow.png");`;
    } else {
        right_button.style.cssText = `background-image: url("https://i.ibb.co/yfPWYNv/arrow1.png");`;
        left_button.style.cssText = `background-image: url("https://i.ibb.co/yfPWYNv/arrow1.png");`;
    }
}

async function loadPeople(url) {
    //add preloader gif
    asideComponents.style.cssText = `
        width: 250px;
        height: 250px;
        margin: 0 auto;
        background-image: url("https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif");
        background-repeat: no-repeat;
        background-position: 50% 50%;`;

    try{
        const response = await fetch(url);
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        const data = await response.json();
        localStorage.setItem('previousPage', data.previous);
        localStorage.setItem('nextPage', data.next);
        changeColor()
        renderAside(data);
        //console.log(data);
    }catch(err){
        console.error('Fetch Error', err);
    }

  
    // fetch(url)
    //     .then(
    //         function (response) {
    //             if (response.status !== 200) {
    //                 console.log('Looks like there was a problem. Status Code: ' + response.status);
    //                 return;
    //             }
    //
    //             response.json()
    //                 .then(function (data) {
    //                     localStorage.setItem('previousPage', data.previous);
    //                     localStorage.setItem('nextPage', data.next);
    //                     changeColor()
    //                     renderAside(data);
    //                     //console.log(data);
    //                 });
    //         }
    //     )
    //     .catch(function (err) {
    //         console.error('Fetch Error', err);
    //     });


}

async function rightClick() {
    let url = localStorage.getItem('nextPage');
    if (url !== 'null') {
        await cleaningAsideDivs();
        !isAsideSectionRendered && loadPeople(url);
    }
    let num = +localStorage.getItem('currentPage')+1;
    let str = num.toString();
    localStorage.setItem('currentPage', num<9 ? str : '9');

}

async function leftClick() {
    let url = localStorage.getItem('previousPage');
    if (url !== 'null') {
        await cleaningAsideDivs();
        !isAsideSectionRendered &&  loadPeople(url);
    }
    
    let num = +localStorage.getItem('currentPage')-1;
    let str = num.toString();
    localStorage.setItem('currentPage', num>0 ? str : '1');
}


function renderAside(data) {
    if (!isAsideSectionRendered) {
        for (let elem of data.results) {
            //обертка для переворота
            let cardDiv = document.createElement('div'),
                cardFaceDiv = document.createElement('div'),
                cardBackDiv = document.createElement('div');
            cardDiv.classList.add('card', 'toggle');
            cardBackDiv.classList.add('card-face');
            cardFaceDiv.classList.add('card-face', 'front');
            cardDiv.append(cardBackDiv);

            //заполнение
            cardFaceDiv.style.cssText = `width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;`;
            cardFaceDiv.innerHTML = elem.name;

            cardFaceDiv.addEventListener('click', function toggle(event) {
                if (isDetailsSectionRendered) {
                    renderTable(event, elem);
                    hidingDiv(event);
                    changeButtonFont();
                }
            });
            cardDiv.append(cardFaceDiv);
            asideComponents.append(cardDiv);
            
        }
    } 

    isAsideSectionRendered = true;
    //remove preloader gif
    asideComponents.style.cssText = '';

}


function renderTable(event, asideBtns) {

    cleaningTheTable()

    let newTr = document.createElement('tr');
    newTr.classList.add('tr');

    for (let i = 1; i < 7; i++) {
        let newTd = document.createElement('td');
        switch (i) {
            case 1:
                newTd.innerHTML = asideBtns.name;
                newTr.append(newTd);
                break;

            case 2:
                newTd.innerHTML = asideBtns.birth_year;
                newTr.append(newTd);
                break;

            case 3:
                newTd.innerHTML = asideBtns.gender;
                newTr.append(newTd);
                break;


            case 4:
                newTd.innerHTML = '';
                newTr.append(newTd);
                let newUl = document.createElement('ul');
                for (let filmApi of asideBtns.films) {
                    let newLi = document.createElement('li');

                    async function getFilms(url) {
                        const response = await fetch(url);
                        const obj = await response.json();
                        newLi.innerHTML = await obj.title;
                        newUl.append(newLi);
                    }

                    getFilms(filmApi)
                }
                newTd.append(newUl);
                break;

            case 5:
                newTd.innerHTML = 'N/A';
                newTr.append(newTd);

            async function getHomePlanet(url) {
                const response = await fetch(url);
                const obj = await response.json();
                newTd.innerHTML = await obj.name;
            }

                getHomePlanet(asideBtns.homeworld);
                break;

            case 6:
                newTd.innerHTML = 'N/A';
                newTr.append(newTd);
                if (asideBtns.species.length !== 0) {
                    async function getSpecies(url) {
                        const response = await fetch(url);
                        const obj = await response.json();
                        newTd.innerHTML = await obj.name;
                    }

                    getSpecies(asideBtns.species);
                    break;
                } else {
                    newTd.innerHTML = 'none';
                    newTr.append(newTd);
                    break;
                }

        }

    }
    tableComponents.append(newTr);
    right_button.hidden = true;
    left_button.hidden = true;
    isDetailsSectionRendered = false;

}

function hidingDiv(event) {
    let currentElement = event.target;
    currentElement.parentElement.style.cssText = `transform: rotateY(180deg);`;
    //asideComponents.style.cssText = `visibility: hidden;  opacity: 0;  transition: visibility 0s linear 2000ms, opacity 2000ms;`;
    buttonClose.style.display = 'block';
}

function openDiv() {
    isDetailsSectionRendered = true;
    let closedButtons = document.querySelectorAll('.toggle');
    for (let elem of closedButtons) {
        elem.style.cssText = ``;
    }

    cleaningTheTable();
    changeButtonFont();
    //asideComponents.style.cssText = `visibility: visible;  opacity: 1;  transition: visibility 0s linear 900ms, opacity 900ms;`;;
    buttonClose.style.display = 'none';
    right_button.hidden = false;
    left_button.hidden = false;
}

function cleaningTheTable() {
    let tableTrs = document.querySelectorAll('.tr');
    if (tableTrs.length) {
        for (let elem of tableTrs) {
            elem.remove();
        }
    }
}

function cleaningAsideDivs() {
    let currentDivs = document.querySelectorAll('.toggle');
    for (let elem of currentDivs) {
        elem.remove();
    }
    isAsideSectionRendered = false;
}

function changeButtonFont() {
    let currentDivs = document.querySelectorAll('.card-face');
    for (let elem of currentDivs) {
        elem.classList.toggle('colored')
    }
}


