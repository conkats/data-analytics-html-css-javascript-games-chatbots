//console.log(document.querySelector('.loading'))
//document.querySelector('.loading').classList.remove('hidden')


//pull in my html elements
const loading = document.querySelector('.loading')
const modal = document.querySelector('.modal')
const modalImage = document.querySelector('.modal-image')
const modalContent = document.querySelector('.modal-content')

const modalClose = document.querySelector('.modal-close')
const bowlSlots  = document.querySelectorAll('.bowl-slot')
const cookBtn = document.querySelector('.cook-btn')


cookBtn.addEventListener('click', createRecipe)
//console.log(modal.classList)
modalClose.addEventListener('click',function(){
    modal.classList.add('hidden')
    clearBowl()
})



//create an array representing the ingredients that we clicked
const bowl = []
const maxBowlSlots = bowlSlots.length //3 elements

function clearBowl(){
    bowl = []

    bowlSlots.forEach(function (el){
        el.innerText='?'
    })
}


function addIngredient(ingredient){
    if (bowl.length === maxBowlSlots) {
        // The bowl is full, get rid of the first one!
        //console.log("The bowl is full yo!")
        //return
        bowl.shift()
    }
    //console.log(ingredient)
    bowl.push(ingredient)//append ingredient
    
    //console.log(bowl)

    //Look at each of the 3 slots in the bowl
    
    //If an ingredient has been added to that slot, use the emoji
    //instead of the '?'

    bowlSlots.forEach(function (el, i){
        let selectedIngredient = '?'
        if (bowl[i]){
           selectedIngredient = bowl[i]
        }

        el.innerText = selectedIngredient
    })

    if (bowl.length === maxBowlSlots) {
        cookBtn.classList.remove('hidden')
    }
}


async function makeRequest(endpoint, data){
    const response = await fetch(_CONFIG_.API_BASE_URL+endpoint,
        {
            headers:{
                'Content-Type': 'application/json',
               'Authorization':`Bear ${_CONFIG_.API_KEY}`
            },
            method:'POST',
            body: JSON.stringify(data)
        })

        return await response.json()

}
function randomLoadingMessage(){
      const messages =[
      'Prepping the ingredients...',
      'Stove is heating up...',
      'Stirring',
      'Taking a photo',
      'Cleaning']


      //Get the loading message HTML element
      const loadingMessage = document.querySelector('.loading-message')
      //Change the inner text  to one of the above msgs
      loadingMessage.innerText = messages[0]

      return setInterval(function () {

        const randomIndex = Math.floor(Math.random()* messages.length)
        loadingMessage.innerText = messages[randomIndex]

      }, 2000)




    }


    async function createRecipe(){
        let randomMessageInterval =randomLoadingMessage()
        loading.classList.remove('hidden')
        const result = await makeRequest('/chat.completions',{
            model:_CONFIG_GPT_MODEL,
            messages:[
                {
                    role:'user',
                    content:`Create a recipe with these ingredients ${bowl.join(',')}. The recipe should be easy and with a creative`
                }
            ],
            temperature:0.7
        })

        const content= JSON.parse(result.choices[0].message.content)

        modalContent.innerHTML=`
        <h2>${content.title}</h2>
        <p>${content.ingredients}</p>
        <p>${content.instructions}</p>`
        
        modal.classList.remove('hidden')
        loading.classList.remove('hidden')
        clearInterval(randomLoadingMessage)

        const imageJSON = await makeRequest('/images/generations', {
            prompt:`Create an image for this recipe: ${content.title}`,
            n:1,
            size:'512x512',
            response_format:'url'
        })
        const imageUrl = imageJSON.data[0].url
        modalImage.innerHTML=`img src="${imageUrl}" />`

        clearBowl()
    }


   
function init(){
   //1. Get all of the ingredient elements
   const ingredients = document.querySelectorAll('.ingredient')
   //ingredients.children.forEach
   //2. Add an event listener to each of them
    ingredients.forEach(function (element){
        //console.log("I ran some code on:")
        //console.log(element)
        element.addEventListener('click',function(){
            //call the function with the element
            addIngredient(element.innerText)
        })

    })
   //3. When an ingredient is clicked, add it to the bowl
}

init()
