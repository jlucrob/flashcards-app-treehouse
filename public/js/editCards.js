document.addEventListener('DOMContentLoaded', (e) => {

  document.getElementById('addQuestion').addEventListener('click', (e)=>{

    let addForm = document.getElementById('addForm');
    let addQuestionDiv = document.getElementById('addQuestionDiv');

    let questionDivWrapper = document.createElement('div');
    questionDivWrapper.classList.add('questionDivWrapper');

    addQuestionDiv.appendChild(questionDivWrapper);

    console.log(questionDivWrapper.previousSibling);

    if(questionDivWrapper.previousSibling && questionDivWrapper.previousSibling.tagName === 'DIV'){
      questionDivWrapper.id = (parseInt(questionDivWrapper.previousSibling.id, 10)  + 1).toString();
    }
    else{
      questionDivWrapper.id = "1";
    }

    let queDiv = document.createElement('div');
    let queLabel = document.createElement('label');
    queLabel.innerHTML = 'Question: ';
    let queInput = document.createElement('input');
    queInput.classList.add('QHAfield');
    queInput.setAttribute('name', `${questionDivWrapper.id}Q`);
    queInput.required = true;
    queDiv.appendChild(queLabel);
    queDiv.appendChild(queInput);

    let hintDiv = document.createElement('div');
    let hintLabel = document.createElement('label');
    hintLabel.innerHTML = 'Hint: ';
    let hintInput = document.createElement('input');
    hintInput.classList.add('QHAfield');
    hintInput.setAttribute('name', `${questionDivWrapper.id}H`);
    hintInput.required = true;
    hintDiv.appendChild(hintLabel);
    hintDiv.appendChild(hintInput);

    let ansDiv = document.createElement('div');
    let ansLabel = document.createElement('label');
    ansLabel.innerHTML = 'Answer: ';
    let ansInput = document.createElement('input');
    ansInput.classList.add('QHAfield');
    ansInput.setAttribute('name', `${questionDivWrapper.id}A`);
    ansInput.required = true;
    ansDiv.appendChild(ansLabel);
    ansDiv.appendChild(ansInput);

    questionDivWrapper.appendChild(queDiv);
    questionDivWrapper.appendChild(hintDiv);
    questionDivWrapper.appendChild(ansDiv);

    addQuestionDiv.appendChild(questionDivWrapper);

  });

  document.getElementById('delTopicBtn').addEventListener('click', (e)=>{
    
    const delInputValue = document.getElementById('delTopicInput').value;
    if(delInputValue && delInputValue !== ""){

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          //What we do with response
          if(xhr.readyState === 4  && xhr.status === 200) {
            alert("Deleting topic!");
            window.location.href = '/edit-cards';
          }
        };

        //What we send to server
        xhr.open('DELETE', `/edit-cards?toDel=${delInputValue}`);
        xhr.send();
    }
  });

});