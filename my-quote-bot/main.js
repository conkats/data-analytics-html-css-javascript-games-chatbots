const loading = document.querySelector('.loading')
const modal = document.querySelector('.modal')
const modalContent = document.querySelector('.modal-content')
const modalClose = document.querySelector('.modal-close')

modalClose.addEventListener('click',function(){
    modal.classList.add('hidden')

})

// some kind of action for ChatGPT
// e.g. tell me your hopes
function getRandomAction(){
    const actions = [
        'say hello in your most iconic way',
        'give fashion advice based on your tastes',
        'write your linked in bio',
        'share a summary of your last epic adventure',
        'reveal your hopes and dream to me',
        'tell me who is your best friend',
    ]
    const randIndx = Math.floor(Math.random()* actions.length)
    return actions[randIndx]//return element in above list
}

async function playCharacter(character) {
    //Sending the character and the prompt to ChatGPT
    //get rid of hidden css class when character clicked

    
    loading.classList.remove('hidden')

    //console.log(getRandomAction())
    const action=getRandomAction()
    //contact chatgpt
    //using fetch function to communicate with the url of the server
    const response=await fetch(_CONFIG_.API_BASE_URL+'/chat/completions',
    {   //http headers
        headers:{
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${_CONFIG_.API_KEY}`
        },
        method :'POST',//sending data to ChatGPT

        
        body :JSON.stringify({
            model: _CONFIG_.GPT_MODEL,
            messages: [
                {
                    role:'user',
                    content: `You are ${character} and should ${action} in max of 100 characters without breaking character`
                }
            ]
        })
    })

    
    //const content ="You click a character"
    const jsonData = await response.json()//response from chatGPT
    console.log(jsonData)
    //Add some content to the model
    const content = jsonData.choices[0].message.content


    modalContent.innerHTML =  `
    <h2>${character}</h2>
    <p>${content}</p>
    <code>Charactere :${character} Action: ${action} Well done!</code>
    
    `

    //Show the modal
    //setTimeout(function(){
    modal.classList.remove('hidden')
    loading.classList.add('hidden')

    //}, 2000)
    
    //Hide the loading screen
}

function init() {

    const characters= document.querySelectorAll('.character')

    characters.forEach(function (element) {
        element.addEventListener('click', function() {
           // console.log("You click a character")
           //when I click pass to the function playCharacter
            playCharacter(element.dataset.character)
        })

    })

}

init()