import { foodData } from "./data.js";

const slide = document.getElementById('slide');
const prevBtn = document.getElementById('prev_btn');
const nextBtn = document.getElementById('next_btn');
const choice = document.getElementById('select');
const selected = document.getElementById('selected_item');
const result = document.getElementById('result');

prevBtn.addEventListener('click', moveSlide);
nextBtn.addEventListener('click', moveSlide);

choice.addEventListener('change', filterList);

let list = [];
let newList = [];
let slideLenght = 10;

// Slide Navigation
function moveSlide(e){
    let move = e.target.id
    const slider = document.querySelector('.slide')
    let slider_index = parseInt(getComputedStyle(slider).getPropertyValue('--index'));

    if(move === 'next_btn'){
        if(slider_index === slideLenght - 1){
            slider.style.setProperty('--index', slider_index = 0);
        }else{
           slider.style.setProperty('--index', slider_index + 1);  
        }
    }else if(move === 'prev_btn'){
        if(slider_index === 0){
           slider.style.setProperty('--index', slider_index = slideLenght -1);  
        }else{
            slider.style.setProperty('--index', slider_index - 1);  
        }
    }
};

render();

// Display HTML elements
function displayFood(array) {
   array.map(food => {
        slide.innerHTML += `
            <div class="slide_item" data-id=${food.id}>
                <img src="${food.image}"/>
                <p class="item_title">${food.name}</p>
             </div>`
    });

    add()
};

// select Item
function add(){
    const food = document.querySelectorAll('.slide_item')
    food.forEach(item => {
    item.addEventListener('click', addTolist)
    });
    window.addEventListener('keydown', () => {
        getIngredientName()
        console.log('Added  ')
    });

    function addTolist(e) {
        const itemId = e.path[1].dataset.id

        if (newList.length === 0){
        foodData.map(food => { 
            if (parseInt(itemId) === food.id){
                
                if(list.length === 0){
                    list.push(food);
                }else if (list.length > 0){
                    if(!list.includes(food)){
                        list = [...list, food]
                    }
                }
            }
        });
    }else{
        newList.map(food => { 
            if (parseInt(itemId) === food.id){
                list.push(food)
            }
        });
    };
    selected.innerHTML = ''
    displaySelectedFood();
    fetchRecipes();
}
};

// Display selected Item
function displaySelectedFood(){
    list.map(food =>{
        selected.innerHTML +=`
            <div class="item">
                <p class="item_name">${food.name}</p>
                <p class="item_cal">${food.cal}</p>
            </div>
        `
    })
};

// Filter
function filterList(e){
    newList = []
    let filter = e.target.value

   foodData.filter(food => {
    if (filter === food.filter){
        newList.push(food)
        }
    })
    render()
};

// Render HTML
function render(){
    if(newList.length === 0){
        slide.innerHTML = ''
        displayFood(foodData)
    }else{
        slide.innerHTML = ''
        displayFood(newList)
    }
};

// Calculate Calories
function calculateCalories(e){
    console.log(e.map(t => t.ingredients))
    
};

// Search Recipe by Ingredient
const recipesOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '0623b9d5bemsha9ffac240869a10p1e1439jsn0525471e5911',
    'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com'
  }
};

function getIngredientName(){
    let ingredientName = []

    list.forEach(recipe => 
        ingredientName.push(recipe.name)
    )
    const i = ingredientName.join('&')

    fetchRecipes(i)
};

const fetchRecipes = async (list) => {
    const res = await fetch(`https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe?query=${list}`,recipesOptions)
    const resultData = await res.json()
    console.log(resultData)
    showRecipe(resultData);
    calculateCalories(resultData);
};

function showRecipe(resultData){
    resultData.map((recipe, index) => {
      slide.innerHTML +=`
        <div class="slide_item recipe" data-id=${index}>
            <p class="item_title">${recipe.title}</p>
            <p class="item_description">${recipe.ingredients}</p>
            <p class="item_instruction">${recipe.instructions}</p>
            <p class="item_serving">${recipe.servings}</p>
        </div>
      `  
    })
};



