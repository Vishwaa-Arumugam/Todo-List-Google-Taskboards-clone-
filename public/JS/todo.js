var NAME;
var array = [];
var completed = [];
var dict = {};
var titleInput;
var completed;
var tasknameElements;
var taskNames;

function askName() {
  var addButton = document.querySelector(".add-new-list");
  addButton.style.display = 'none';
  var inputDiv = document.querySelector('.Nameinput');
  inputDiv.style.display = 'inline-block';
}

function toggleStrikethrough(radio) {
  var correspondingParagraph = radio.parentNode.querySelector('.TaskName');
  // console.log('PARAA', correspondingParagraph.innerHTML);
  var index = completed.indexOf(correspondingParagraph.innerHTML);
  if (index !== -1) {
    completed.splice(index, 1);
  } else {
    completed.push(correspondingParagraph.innerHTML);
  }
  dict['completed'] = completed;
  correspondingParagraph.style.textDecoration = radio.checked ? 'line-through' : 'none';

  console.log('Updated DICT', dict);
}


function SearchTaskname() {

  fetch('/sendTaskNamesList')
    .then(response => response.json())
    .then(data => {
      const result = [];
      var temp = data.tasksNames[0];
      var searchBar = document.querySelector('.searchbarinput');
      if (temp.includes(searchBar.value)) {
        // console.log('TRUE');
        var finalList = [];
        const t = document.querySelectorAll('.TaskName');
        const noteParent = document.querySelectorAll('.taskname');
        let k = 1;
        // var i = 1;
        t.forEach(element => {
          // console.log(element.innerHTML)
          // console.log(noteParent);
          if (element.style.textDecoration != 'line-through') {
            finalList.push(element.innerHTML);
            // i = i + 1;
          }
          // console.log(finalList)

          for (let i = 0; i < finalList.length; i++) {
            if (finalList[i] === 'TaskName' && k < noteParent.length) {
              finalList[i] = noteParent[k].innerHTML + '/';
              k++;
            }
          }
          // console.log(finalList);
        });
        finalList.pop()
        console.log(finalList)
        for (let i = 0; i < finalList.length; i++) {
          if (finalList[i].startsWith(searchBar.value)) {
            for (let j = i + 1; j < finalList.length; j++) {
              if (finalList[j].includes('/')) {
                break;
              }
              result.push(finalList[j]);
            }
            break
          }
        }
        console.log(result);
      }
      let utterance = new SpeechSynthesisUtterance();
      result.forEach(element => {
        utterance.text = element;
        utterance.voice = window.speechSynthesis.getVoices()[0];
        window.speechSynthesis.speak(utterance);
      })
    })
    .catch(error => console.error(error));
}


function sendTaskNameToServer() {
  const taskNamesToSend = JSON.stringify(taskNames);
  fetch('/sendTaskName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: taskNamesToSend,
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server: ', data);
    })
    .catch(error => {
      console.log('Error sending Tasknames: ', error);
    });
};


function sendDictionaryToServer() {

  tasknameElements = document.getElementsByClassName("taskname");
  taskNames = [];
  for (var i = 0; i < tasknameElements.length; i++) {
    taskNames.push(tasknameElements[i].innerHTML);
  }
  // console.log('Tasknames',taskNames);

  sendTaskNameToServer();

  const dictToSend = JSON.stringify(dict);
  console.log(dictToSend);
  fetch('/sendDictionary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: dictToSend,
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server: ', data);
      sendHtmlContentToServer();
    })
    .catch(error => {
      console.error('Error sending dictionary:', error);
    });
};


function sendHtmlContentToServer() {
  const htmlContent = document.documentElement.outerHTML;
  const jsonData = { htmlContent: htmlContent };

  fetch('/sendHtmlContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server: ', data);
    })
    .catch(error => {
      console.error('Error sending HTML content: ', error);
    });
}



function checkEnter(event) {
  if (event.key === 'Enter') {
    createNewElement();
  }
}

function SecondEnter(event) {
  if (event.key === 'Enter') {
    var noteElementId = event.target.getAttribute('data-note-element');

    var currentNoteElement = document.getElementById(noteElementId);

    createTitleDiv(currentNoteElement);
  }
}

function createNewElement() {

  var clonedNote = document.querySelector('.Note').cloneNode(true);
  var clonedThirdelement = document.querySelector('.Thirdelement').cloneNode(true);
  var clonedRadioButton = document.querySelector('.radio').cloneNode(true);
  var clonedTitleInput = document.querySelector('.titleinput').cloneNode(true);

  var inputField = document.querySelector('.Nameinput');
  var inputValue = inputField.value;

  var taskNameParagraph = clonedNote.querySelector('.taskname');
  taskNameParagraph.innerHTML = inputValue;
  NAME = inputValue;
  // console.log(NAME);

  var noteId = 'note_' + Date.now();
  clonedNote.setAttribute('id', noteId);


  var taskNameInput = clonedThirdelement.querySelector('.titleinput');
  taskNameInput.setAttribute('data-note-element', noteId);
  var taskNameInputValue = taskNameInput.value;


  clonedNote.style.display = 'inline-block';
  clonedThirdelement.style.display = 'none';

  clonedNote.appendChild(clonedThirdelement);

  var existingDiv2 = document.querySelector('.button');
  document.body.insertBefore(clonedNote, existingDiv2);

  clonedNote.addEventListener('click', function () {
    displayThirdElement(clonedThirdelement);
  });

  clonedTitleInput.addEventListener('keypress', function (event) {
    SecondEnter(event);
  });

  var addButton = document.querySelector(".add-new-list");
  addButton.style.display = 'inline-block';

  var inputDiv = document.querySelector('.Nameinput');
  inputDiv.style.display = 'none';

  inputField.value = '';

}

function displayThirdElement(thirdelement) {
  var thirdelementStyle = window.getComputedStyle(thirdelement);

  if (thirdelementStyle.display === 'none') {
    thirdelement.style.display = 'inline-block';
  }
}

function createTitleDiv(noteElement) {

  console.log(noteElement);

  var titleInput = noteElement.querySelector(".titleinput");
  var thirdelementsinputs = noteElement.querySelector('.thirdelementsinputs');
  var speaker = noteElement.querySelector(".speaker");
  var afteraddtitlediv = noteElement.querySelector('.afteraddtitle').cloneNode(true);

  if (titleInput.value != '') {
    var taskNameParagraph = afteraddtitlediv.querySelector('.TaskName');
    taskNameParagraph.innerHTML = titleInput.value;
    array.push(taskNameParagraph.innerHTML);
    // console.log(array);
    dict[NAME] = array;
    // console.log(dict);

    var thirdelement = noteElement.querySelector('.Thirdelement');
    thirdelement.insertBefore(afteraddtitlediv, thirdelementsinputs);

    afteraddtitlediv.style.display = 'flex';
    titleInput.value = '';
  }
}

function texttospeech(s) {
  console.log(s.parentNode.parentNode);
  var p = s.parentNode.parentNode;
  let utterance = new SpeechSynthesisUtterance();
  utterance.text = p.querySelector('.TaskName').innerHTML;
  utterance.voice = window.speechSynthesis.getVoices()[0];
  window.speechSynthesis.speak(utterance);
};


function startSpeechRecognition(mic) {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

  var correspondingInputTag = mic.parentNode.querySelector('.titleinput');
  console.log(correspondingInputTag);

  recognition.onstart = function () {
    console.log('Speech recognition started');
  };

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript;
    console.log('Speech recognition result:', speechResult);
    correspondingInputTag.value = speechResult;
    let keye = new KeyboardEvent('keypress', { key: 'Enter' });
    correspondingInputTag.dispatchEvent(keye);
  };

  recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = function () {
    console.log('Speech recognition ended');
  };

  recognition.start();
}

window.onload = function () {
  fetch('/getTaskDictionary')
    .then(response => response.json())
    .then(data => {
      const main = Object.values(data)[1][0];
      const tasks = Object.values(main);
      dict = main;
      console.log('dict', dict);
      const yetToComplete = tasks[0];
      completed = tasks[1];
      console.log(yetToComplete, completed);
    })
    .catch(error => {
      console.error('Error fetching taskDictionary:', error);
    });
};


