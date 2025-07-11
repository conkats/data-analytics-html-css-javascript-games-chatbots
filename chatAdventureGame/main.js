const chatGptMessages = [];
const stageContainer = document.querySelector('.stage-container');

const createSetting = (stage, setting) => {
  stage.querySelector('.stage-setting').innerHTML = setting;
  stageContainer.append(stage);
}

const createActions = (genre, actions) => {
  const actionsHtml = actions.map((action) => `<button>${action}</button>`).join('');
  document.querySelector('.stage-actions').innerHTML = actionsHtml;
  const buttons = document.querySelectorAll('.stage-actions button');
  buttons.forEach((button) => button.addEventListener(
    'click',
    async () => {
      addActionMessage(button.innerText);
      await setStage(genre);
    }
  ));
}

const createImage = async (genre, setting) => {
  const generatedImage = await makeRequest(
    _CONFIG_.API_BASE_URL + '/images/generations',
    {
      prompt: `This is a story based on ${genre}. ${setting}`,
      n: 1,
      size: '512x512',
      response_format: 'url',
    }
  );

  const image = generatedImage.data[0].url;
  document.querySelector('.stage-image').innerHTML = `<img src="${image}" alt="${setting}" >`
}

const gameOver = (setting) => {
  const gameOverTemplate = document.querySelector('#game-over-template');
  const gameOver = gameOverTemplate.content.cloneNode(true);

  gameOver.querySelector('.game-over-message').innerText = setting;
  gameOver.querySelector('.game-over-container button').addEventListener(
    'click',
    () => window.location.reload()
  );
  stageContainer.append(gameOver);
}

const createStage = async (genre, setting, actions) => {

  const stageTemplate = document.querySelector('#stage-template');
  const stage = stageTemplate.content.cloneNode(true);

  createSetting(stage, setting);
  createActions(genre,actions);
  await createImage(genre, setting);
}

  const setStage = async (genre) => {
  // Reset stage container for each round
  stageContainer.innerHTML = "";

  let chatResponseJson;

  try {
    showLoadingAnimation(true);

  // Send request to ChatGPT Chat Completion API
  // https://platform.openai.com/docs/api-reference/chat/create
    chatResponseJson= await makeRequest(
    _CONFIG_.API_BASE_URL,
    {
      model: _CONFIG_.GPT_MODEL,
      messages: chatGptMessages,
      temperature: 0.2
      // The model predicts which text is most likely to follow the text preceding it.
      // Temperature is a value between 0 and 1 that essentially lets you control how confident the model should be when making these predictions.
      // Lowering temperature means it will take fewer risks, and completions will be more accurate and deterministic.
      // Increasing temperature will result in more diverse completions.
  });

  const message = chatResponseJson.choices[0].message;
  const content = JSON.parse(message.content);
  const {setting, actions} = content;

   // Add the generated message to our message history
   chatGptMessages.push(message)

   if(actions.length) {
    await createStage(genre, setting, actions);
    } else {
      gameOver(setting);
    }
  
     showLoadingAnimation(false);
    } catch (error) {
    let errorMessages = `<p>${error.message}</p>`;


    if (chatResponseJson.error) {
      errorMessages += `<p>${chatResponseJson.error.message}</p>`;
    }
    showLoadingAnimation(false);
    document.querySelector('.error-messages').innerHTML = errorMessages;
    showErrorMessage(true);
    showGenresButtons(true);
  }
}

const startGame = async (genre) => {
  showErrorMessage(false);
  showGenresButtons(false);

  // Message to send to ChatGPT to start the game
  chatGptMessages.push({
    role: 'system',
    content: 'I want you to play like a classic text adventure game. I will be the protagonist and main player. Don\'t refer to yourself. ' +
      'The setting of this game will have a theme of ' + genre + '. ' +
      'Each setting has a description of 150 characters followed by an array of 3 possible actions that the player can perform. ' +
      'One of these actions is fatal and ends the game. Never add other explanations. Don\'t refer to yourself. ' +
      'Your responses are just in JSON format like this example:\n\n###\n\n {"setting":"setting description","actions":["action 1", "action 2", "action 3"]}\n\n###\n\n'
  });

  await setStage(genre);
}

const init = () => {
    const genres = document.querySelectorAll('.genre');
    genres.forEach((button) => button.addEventListener(
      'click',
      //) => alert(`You selected the genre: ${button.dataset.genre}`))
    () => startGame(button.dataset.genre))
    )
  }
  
  
init()