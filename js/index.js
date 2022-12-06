const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeight = document.querySelector(".minweight__input"); // МИН
const maxWeight = document.querySelector(".maxweight__input"); // МАКС

//ПАЛИТРА ЦВЕТОВ
let colorfr = [
  {colr:'фиолетовый', value:'#8b00ff', index:0},
  {colr:'зеленый', value:'#00cc00', index:1},
  {colr:'розово-красный', value:'#c41e3a', index:2},
  {colr:'желтый', value:'#ffff00', index:3},
  {colr:'светло-коричневый', value:'#945d27', index:4}
];
const nameColor = colr => colorfr.find(elmt => elmt.colr === colr);
const indexColor = index => colorfr.find(elmt => elmt.index === index);
const valueColor = value => colorfr.find(elmt => elmt.value === value);

// список фруктов в JSON формате 
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;
// преобразование JSON в объект JavaScript
let allFruits = JSON.parse(fruitsJSON);
allFruits.forEach(iel => iel.color = nameColor(iel.color).index);
let fruits = allFruits.slice(0);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек

  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
function addFruitElement(fruit){
  let newFruit = document.createElement('li');
  newFruit.className = "fruit__item";
  newFruit.style.backgroundColor = indexColor(fruit.color).value;
  // TODO: формируем новый элемент <li> при помощи document.createElement,
  // и добавляем в конец списка fruitsList при помощи document.appendChild
  let fruitInfoElem = document.createElement('div');
  fruitInfoElem.className = "fruit__info";
  for(j=0; j<2; j++)  fruitInfoElem.appendChild(document.createElement('div') ); 
  fruitInfoElem.childNodes[0].textContent = `Вид: ${fruit.kind}`;
  fruitInfoElem.childNodes[1].textContent = `Вес: ${fruit.weight}г`;
  newFruit.appendChild(fruitInfoElem);
  fruitsList.appendChild(newFruit);
}
function display(){
  fruitsList.querySelectorAll('.fruit__item').forEach(iel => iel.remove() );
  fruits.forEach(fruit => addFruitElement(fruit));
}
// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// перемешивание массива
const shuffleFruits = () => {
  let result = [];
   // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    let randomFruit =  fruits.splice(getRandomInt(0, fruits.length), 1)[0];
    if(randomFruit){
      result.push(randomFruit);
     };
   }
   fruits = result;
};
shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
minWeight.addEventListener('click', () => minWeight.value = '');
maxWeight.addEventListener('click', () => maxWeight.value = '');
// TODO: допишите функцию
function filterFruits(){
  fruits = allFruits.filter(iel => iel.weight >= minWeight.value && iel.weight <= maxWeight.value);
  if(isActiveSort){
    isActiveSort = false;
    fruits = sort(fruits);  
  }
}
filterButton.addEventListener('click', () => {
  filterFruits(); 
  display();
});
let isActiveSort = false;

/***   СОРТИРОВКА   ***/
let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки
const comparationColor = (a, b) => {
  let arr;
  [a, b].sort((a, b) => {
      arr = a.color < b.color; //.toLowerCase()
  });
  return arr;
};
const sortAPI = {
  bubbleSort(arr, comparation) {
      const n = arr.length;
      // внешняя итерация по элементам
      for (let i = 0; i < n - 1; i++) {
          // внутренняя итерация для перестановки элемента в конец массива
          for (let j = 0; j < n - 1 - i; j++) {
              // сравниваем элементы
              if (comparation(arr[j], arr[j + 1])) {
                  // делаем обмен элементов
                  [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              }
          }
      }
  },
  quickSort(arr, comparation, left = 0, right = arr.length - 1) {
    // TODO: допишите функцию быстрой сортировки
    if (arr.length > 1) {
        left = typeof left != 'number' ? 0 : left;
        right = typeof right != 'number' ? arr.length - 1 : right;
        let pivot = arr[Math.floor((right + left) / 2)],
            i = left,
            j = right;
        while (i <= j) {
            while (comparation(pivot, arr[i])) {
                i++;
            }
            while (comparation(arr[j], pivot)) {
                j--;
            }
            if (i <= j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
                j--;
            }
        }
        
       
    }
},

// выполняет сортировку и производит замер времени
startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
},
};   

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
sortChangeButton.addEventListener('click', () => {
  sortKindLabel.textContent =
      sortKind == 'bubbleSort'
          ? (sortKind = 'quickSort')
          : (sortKind = 'bubbleSort');
});

sortActionButton.addEventListener('click', () => {
    sortTimeLabel.textContent = 'sorting...';
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    display();
    sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

kindInput.addEventListener('click', () => kindInput.value = '');
weightInput.addEventListener('click', () => weightInput.value = '');
kindInput.value = 'Введите название';
weightInput.value = 'Введите число';
weightInput.addEventListener('input', function(){
  let last_sign = parseInt(this.value[this.value.length-1], 10); 
  if(isNaN(last_sign)){
    showError(weightInput);
    this.value = this.value.slice(0, this.value.length-1);
  }
})

addActionButton.addEventListener('click', () => {
  if(kindInput.value == "" && weightInput.value == ""){
    showError(kindInput); 
    showError(weightInput);
    }
  else if(kindInput.value == "")
    showError(kindInput);
  else if(weightInput.value == "")
    showError(weightInput);
  else{
    try{
      let fruit = {kind: kindInput.value, color: valueColor(colorInput.value).index, weight: parseInt(weightInput.value, 10)};
      allFruits.push(fruit);
      fruits.push(fruit);

      kindInput.value = "";
      weightInput.value = "";
      display();
    }
    catch(TypeError){
      alert('Выберите цвет'); 
    }
    colorInput.value = "#3CB371";
  }
});