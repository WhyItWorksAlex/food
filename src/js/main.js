'use strict'
window.addEventListener('DOMContentLoaded', () => {
  
  // Табы

  const tabs = document.querySelectorAll('.tabheader__item');
  const tabsContent = document.querySelectorAll('.tabcontent');
  const tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent () {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('fade');
    })

    tabs.forEach(tab => {
      tab.classList.remove('tabheader__item_active');
    })
  }

  function showTabContent (i = 0) {
    tabsContent[i].classList.remove('hide');
    tabsContent[i].classList.add('fade');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('tabheader__item')) {
      tabs.forEach((item, index) => {
        if (target === item) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  })

  // Таймер

  const deadline = '2025-01-01'

  function getTimeRemaining(endtime) {
    const now = new Date();
    const differenceUTC = now.getTimezoneOffset() * 60 * 1000;
    let t = Date.parse(endtime) - Date.parse(now) + differenceUTC; // Получим разницу в мс между финальной датой и текущей локальной датой и часовой пояс локальный
    let days, hours, minutes, seconds;
    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor( t / (1000 * 60 * 60 * 24));
      hours = Math.floor(( t / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((t / (1000 * 60)) % 60)
      seconds = Math.floor((t / 1000) % 60)
    }

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds,
    }
  }

  function getZero(num) {
    if (num >= 0 && num <= 9) {
      return `0${num}`;
    } else {
      return num
    }
  }


  function setClock(selector, endtime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');
    const timeInterval = setInterval(updateClock, 1000) // Первый запуск будет через 1000мс для этого мы ниже запустим первый раз вручную

    updateClock()

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval)
      }
    }
  }

  setClock('.timer', deadline)

  // Модальное окно

  const modalTriggers = document.querySelectorAll('[data-modal');
  const modal = document.querySelector('.modal')
  const modalCloseBtn = document.querySelector('[data-close]')
  const modalInner = document.querySelector('.modal__dialog')

  function closeModal () {
    modal.classList.remove('modal__open')
    document.body.style.overflow = ''
    modalCloseBtn.removeEventListener('click', closeModal)
    
  }
  
  function openModal() {
    if (!modal.classList.contains('modal__open')) {
      modal.classList.add('modal__open');
      modalCloseBtn.addEventListener('click', closeModal);
      document.body.style.overflow = 'hidden';
      clearInterval(modalTimerId);
    }
  };

  modalTriggers.forEach((item) => {
    item.addEventListener('click', openModal)
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('modal__open')) {
      closeModal()
    }
  });

  const modalTimerId = setTimeout(openModal, '10000000');

  // document.documentElement.scrollHeight - это полная высота всего контента страницы
  // document.documentElement.clientHeight - то, сколько мы видем на экране
  // window.scrollY - то, сколько мы уже пролистами из общей длины документа

  function showModalByScroll () {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal()
      window.removeEventListener('scroll', showModalByScroll);
    }  
  }

  window.addEventListener('scroll', showModalByScroll);

  // Использование классов для карточек

  const mock = [
    {
      src: "img/tabs/vegy.jpg",
      alt: "vegy",
      title: 'Меню "Фитнес"',
      descr: 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
      price: 9,
    },
    {
      src: "img/tabs/elite.jpg",
      alt: "elite",
      title: 'Меню “Премиум”',
      descr: 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
      price: 20,
    },
    {
      src: "img/tabs/post.jpg",
      alt: "post",
      title: 'Меню "Постное"',
      descr: 'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
      price: 16,
    },
  ];

  class MenuCard {
    constructor(src, alt, title, descr, price, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.transfer = 27; // курс валюты 
      this.changeToUAH()
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');

      if (this.classes.length === 0) {
        this.classes = 'menu__item';
        element.classList.add(this.classes);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }

      
      element.innerHTML = `
        <img src="${this.src}" alt="${this.alt}">
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      document.querySelector('.menu .container').append(element);
    }
  }

  for (let item of mock) {
    if (item.alt === 'elite') {
      new MenuCard(...Object.values(item), 'menu__item', 'bigs').render();
    } else {
      new MenuCard(...Object.values(item), 'menu__item').render();
    }
  };

  // Отправка формы на сервер

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'Загрузка',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
  }

  forms.forEach((form) => {
    postData(form);
  })

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('div');
      statusMessage.classList.add('status');
      statusMessage.textContent = message.loading;
      form.append(statusMessage);

      const request = new XMLHttpRequest();

      request.open('POST', 'server.php');

      const formData = new FormData(form)
 
      request.setRequestHeader('Content-type', 'application/json'); // Это ну нужно если отправляем FormData в базовом формате

      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      })

      const json = JSON.stringify(object)

      request.send(json);

      // request.send(formData);

      request.addEventListener('load', () => {
        if(request.status === 200) {
          console.log(request.response);
          console.log(object);
          console.log(formData.keys());
          statusMessage.textContent = message.success;
          form.reset();
          setTimeout(() => {
            statusMessage.remove();
          }, 5000)
        } else {
          statusMessage.textContent = message.failure;
        }
      })
    })
  }

});