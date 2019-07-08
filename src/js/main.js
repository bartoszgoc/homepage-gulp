"use strict";

import moment from 'moment';

console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))

const welcome = (name, age) => {
    console.log(`Witaj ${name}, masz ${age} lat`);
}

welcome('bartek', 26);

const name = 'bartek';
const age = 22;

welcome(name,age);

const button = document.querySelector('.header__button--js');
console.log(button);

button.addEventListener('click', (e) =>  {
    const header = document.querySelector('.header__title--js')
    header.innerHTML = 'klik, klik';
    header.classList.toggle('header__title--red');
    if(header.classList.contains('header__title--red'))
    {
        console.log('jest klasa');
    }else{
        console.log('nie ma');
    }
});

const navigationSwitch = document.querySelector('.navigation__switcher--js');
navigationSwitch.addEventListener('click', (e)=>{
    const navigationList = document.querySelector('.navigation__list--js');
    navigationList.classList.toggle('navigation__list--visible');
    if(navigationList.classList.contains('navigation__list--visible'))
    {
        navigationSwitch.innerHTML = 'X';
    }else{
        navigationSwitch.innerHTML ="&#9776;";
    }
})
