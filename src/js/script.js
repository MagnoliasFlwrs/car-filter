

let carsList = null;
let filterList = null;

const url = 'https://apistock.aps.by/cars';
const filterUrl = 'https://apistock.aps.by/filters';

const inner = document.querySelector('.car-cards');
const filterModalBody = document.querySelector('.filter-modal .modal-body');
const desctopFilterPanel = document.querySelector('.filter-variables');

document.addEventListener('DOMContentLoaded', async () => {
    let list =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
    list = await list.json()
    carsList = list;
    console.log(carsList);
    if (carsList) {
        renderCardslist()
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    let list =  await fetch(filterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "brands_id": 1,
            "car_conditions_id": 1
          }),
      })
    list = await list.json();
    filterList = list;
    console.log(filterList)
    if (filterList) {
        renderFilterList();
        accordeonOn()
    }
    console.log(list)
})



function renderCardslist() {
    inner.innerHTML = '';
    carsList.forEach(({addresses, brands , car_body , car_conditions , car_packages , car_type , cities , colors , count_engines , drive_type , engine_types , engines ,in_stock , mileage , models , modifications, power_reserve , price , price2 , reserved , seat_count , transmission , vin , years , images}) => {

            let instockContent = in_stock ? 'В наличии ' : 'В пути';
            let instockClass = in_stock ? 'green' : 'yellow';

            let actionPrice = price2 > price ? `${price2} BYN` : ''

            const carCard = document.createElement('div');
            carCard.classList.add('car-card');
            carCard.insertAdjacentHTML(
            'beforeend' ,
            `
                <div class="swiper model-swiper">
                <div class="swiper-wrapper">
                <div class="swiper-slide"><img src="" alt="car-image"></div>
                <div class="swiper-slide"><img src="" alt="car-image"></div>
                </div>
                <div class="swiper-pagination"></div>
                </div>
                <div class="model">
                    <p class="model-name">${brands.name} ${models.name}</p>
                    <p class="model-modification">${car_packages.name}</p>
                </div>
                <div class="stock">
                    <span class="year">${years}</span>
                    <span class="instock ${instockClass}">${instockContent}</span>
                </div>
                <ul class="characteristic-list">
                    <li>
                        <img src="https://voyah.by/wp-content/uploads/2023/06/иконка-694-силы.svg" alt="img" width="16" height="16">
                        <span>${engines.power_hp} л.с</span>
                    </li>
                    <li>
                        <img src="https://voyah.by/wp-content/uploads/2023/06/иконка-860-км.svg" alt="img" width="16" height="16">
                        <span>${engines.name}</span>
                    </li>
                    <li>
                        <img src="https://voyah.by/wp-content/uploads/2023/06/иконка-привод.svg" alt="img" width="16" height="16">
                        <span>${drive_type.name}</span>
                    </li>
                    <li>
                        <img src="https://voyah.by/wp-content/uploads/2023/06/иконка-кроссовер.svg" alt="img" width="16" height="16">
                        <span>${car_body.name} | ${seat_count} мест</span>
                    </li>
                </ul>
                <div class="price">
                    <p class="general-price">${price} BYN</p>
                    <div class="sale">
                        <span>${actionPrice} </span>

                        <div class="sale-icon show-icon-popup">
                           
                        </svg>
                        </div>  
                    </div>
                    <div class="sale-icon-popup">
                        <span></span>
                    </div>
                </div>
                <div class="location">
                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.3132 12.8285C12.0906 10.8869 5.68999 8.53174 8 19L1.64175 2.26125L16.3132 12.8285Z" fill="#808080" stroke="#808080"/>
                    </svg>
                    <p class="location-name">${addresses.name}</p>      
                </div>
                <button class="card-btn in-stock-btn">Запросить предложение</button>
            `
            )
            inner.appendChild(carCard);
    })
    
}
function renderFilterList() {
    console.log(filterList)
    // filterList = {models , modifications , transmission , drive_type , battery , addresses , interior_color , car_type , cities , car_body , colors , engines , engine_types , power_reserve , mileage , power , price , car_packages};
    

    function renderItemWithCheckbox(filterName , propName ,propForFetch) {
        if (propName) {
            let item = document.createElement('div');
            item.classList.add('filter-item');
            let btn =  document.createElement('button');
            btn.classList.add('accordion' , 'active');
            btn.textContent = filterName;
            let accordionPanel = document.createElement('div');
            accordionPanel.classList.add('panel' , 'active');
            let itemCheckboxes =  document.createElement('div');
            itemCheckboxes.classList.add('item-checkboxes');
            
            if (propName.length) {
                propName.forEach(({id , name}) => {
                let customCheckbox =  document.querySelector('label');
                let input = document.createElement('input');
                input.type = 'checkbox' ;
                input.dataset.prop = propForFetch;
                input.dataset.value = name;
                let checkbox = document.createElement('span');
                checkbox.classList.add('checkbox');
                checkbox.insertAdjacentHTML(
                    'beforeend' , 
                    `
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                    `
                )
                let span = document.createElement('span');
                span.textContent = name;
                    
                customCheckbox.append(input , checkbox , span);
                itemCheckboxes.append(customCheckbox);

                })
            }
        
            accordionPanel.append(itemCheckboxes)
            item.append(btn , accordionPanel);
            desctopFilterPanel.append(item);
        }
    }

    if (filterList.models.length) {
        renderItemWithCheckbox('Модель' , filterList.models , 'models');
        
    }
    if (filterList.addresses.length) {
        renderItemWithCheckbox('Локация' , filterList.addresses , 'addresses');
        
    }
    if (filterList.car_body.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.car_body , 'car_body');
        
    }
    if (filterList.modifications.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.modifications , 'modifications');
        
    }
    if (filterList.transmission.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.transmission , 'transmission');
        
    }
    if (filterList.drive_type.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.drive_type , 'drive_type');
        
    }
    if (filterList.battery.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.battery , 'battery');
        
    }
    if (filterList.interior_color.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.interior_color , 'interior_color');
        
    }
    if (filterList.car_type.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.car_type , 'car_type');
        
    }
    if (filterList.cities.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.cities , 'cities');
        
    }
    if (filterList.colors.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.colors , 'colors');
        
    }
    if (filterList.engines.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.engines , 'engines');
        
    }
    if (filterList.engine_types.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.engine_types , 'engine_types');
        
    }
    if (filterList.power_reserve.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.power_reserve , 'power_reserve');
        
    }
    if (filterList.mileage.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.mileage , 'mileage');
        
    }
    if (filterList.power.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.power , 'power');
        
    }
    if (filterList.price.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.price , 'price');
        
    }
    if (filterList.car_packages.length) {
        renderItemWithCheckbox('Тип кузова' , filterList.car_packages , 'car_packages');
        
    }


}

const showPopupBtns = document.querySelectorAll('.show-icon-popup');

if(showPopupBtns) {
    showPopupBtns.forEach(el=> {
        el.addEventListener('click' , ()=> {
            let currPopup = el.closest('.price').querySelector('.sale-icon-popup');
            currPopup.classList.add('active');
            setTimeout(()=> {
                currPopup.classList.remove('active')
            } , 2500)
        })
    })
}
const modelSliders = document.querySelectorAll('.model-swiper');

if(modelSliders) {
    modelSliders.forEach(el=> {
        const swiper = new Swiper(el, {
            slidesPerView:1,
            loop: true,
            pagination: {
              el: '.swiper-pagination',
            },
          });
    })
}

function accordeonOn() {
    let acc = document.querySelectorAll(".accordion");
    if (acc) {
        acc.forEach(el=> {
            let panel = el.nextElementSibling;
            el.addEventListener("click", () => {
                el.classList.toggle("active");
                let panel = el.nextElementSibling;
                panel.classList.toggle('active')
                if (panel.style.maxHeight){
                panel.style.maxHeight = null;
                } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                } 
            });
            if (panel.classList.contains('active')) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        })
    }
}



document.addEventListener('input' , (e) =>{
    if( e.target.classList.contains('price-slider')) {
        let currentItem = e.target.closest('.price');
        let sliderOne = currentItem.querySelector(".price-slider-1");
        let sliderTwo = currentItem.querySelector(".price-slider-2");
        let displayValOne = currentItem.querySelector(".price-from");
        let displayValTwo = currentItem.querySelector(".price-to");
        let minGap = 0;
        let sliderTrack = currentItem.querySelector(".slider-track");

        function slideOne(){
            if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
                sliderOne.value = parseInt(sliderTwo.value) - minGap;
            }
            displayValOne.value = sliderOne.value;
            fillColor();
        }
        function slideTwo(){
            if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
                sliderTwo.value = parseInt(sliderOne.value) + minGap;
            }
            displayValTwo.value = sliderTwo.value;
            fillColor();
        }
        function fillColor(){
            let sliderMaxValue = currentItem.querySelector(".price-slider-1").max;
            percent1 = (sliderOne.value / sliderMaxValue) * 100;
            percent2 = (sliderTwo.value / sliderMaxValue) * 100;
            sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #444 ${percent1}% , #444 ${percent2}%, #dadae5 ${percent2}%)`;
        }
        if(sliderOne) {
            sliderOne.addEventListener('input' , ()=>{
                slideOne();
            })
        }
        if(sliderTwo) {
            sliderTwo.addEventListener('input' ,  () => {
                slideTwo();
            })
        }
    }
})


function debounce(func, ms) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
  }

  function a() {
    alert('awegwegf')
  }
//   const debouncedUpdateLayout = debounce(a, 250);

// window.addEventListener("click", debouncedUpdateLayout);


// price-sort

const sortBtn = document.querySelector('.sort-btn');

if(sortBtn) {
    sortBtn.addEventListener('click' , ()=> {
        sortBtn.classList.toggle('active');
    })
}

//filter-modal

const filterModal = document.querySelector('.filter-modal');
const filterCloseBtns = document.querySelectorAll('.close-modal');
const body = document.querySelector('body');
const filterBtn = document.querySelector('.filter-btn');
console.log(filterCloseBtns)
function showFilterModal() {
    filterBtn.addEventListener('click' , ()=> {
        console.log(filterBtn);
        filterModal.classList.add('open');
        body.style.overflow = 'hidden'
    })
}
function closefilterModal() {
    filterCloseBtns.forEach(el=> {
        el.addEventListener('click' , ()=> {
            filterModal.classList.remove('open');
            body.style.overflow = 'auto'
        })
    })
    
    
}
if (filterModal) {
    showFilterModal();
    closefilterModal();
}












