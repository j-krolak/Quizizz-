
const QuestionType = {
    None:-1,
    Open:0,
    OneChoice:1,
    MultipleChoice:2
};

function findDeepest(element, depth) {
    let res = {depth: depth, obj: element};

    for(let i = 0; i < element.children.length; i++){
        let next = findDeepest(element.children[i], depth+1);
        if(res.depth < next.depth){
            res = next;
        }
    }

    return res;
}


function removeTags(str){
    return str.replace(/<(.|\n)*?>/g, '')
}

function getQuestion(){
    let question = {
        text: null,
        answers: [],
        type: null
    };
    try {
        question.text = document.getElementsByClassName('question-text-color')[0].innerHTML;      

        let answersHTML = document.getElementsByClassName('option');
        if(answersHTML.length < 2){
            question.type = QuestionType.Open;
        } else {
            if(document.getElementsByClassName('msq-text').length > 0)
                question.type = QuestionType.MultipleChoice;
            else
                question.type  = QuestionType.OneChoice;
        }
        for(let i = 0; i< answersHTML.length; i++){
            question.answers.push(findDeepest(answersHTML[i], 0).obj.innerHTML);
        }

    } catch(error) {
        console.error("There isn't a qustion!");
        console.log(error);
        question.type = QuestionType.None;
    }
    question.text = removeTags(question.text);
    question.answers = question.answers.map(removeTags);
    return question;
}

function quickCopy(){
    const question = getQuestion();

    if(question.type === QuestionType.None){
        return;
    }
    let prompt = '';

    switch(question.type){
        case QuestionType.OneChoice:
            prompt += 'Wybierz tylko jedną z odpowiedź:\n';
            break;
        case QuestionType.MultipleChoice:
            prompt += 'Wybierz wszystkie poprawne odpowiedzi:\n';
            break;
        case QuestionType.Open:
            prompt += 'Odpowiedz w co najwyżej jednym zdaniu.';
            break;
    }

    prompt += question.text;
    if(question.type !== QuestionType.Open){

        for(let i = 1; i <= question.answers.length; i++){
            prompt += i + '. ' + question.answers[i-1] + '\n';
        }
    }
    navigator.clipboard.writeText(prompt);

    console.log(prompt);
}


const labelDiv= document.createElement('div');
labelDiv.style.position = 'fixed';
labelDiv.style.zIndex = 99999;
labelDiv.style.top = '11px';
labelDiv.style.left = '50%';
labelDiv.style.color = '#fff';
labelDiv.style.opacity = '100%';
labelDiv.style.textAlign  = 'center'
labelDiv.style.padding = '10px';
labelDiv.style.transform = 'translate(-50%, 0)';
labelDiv.style.pointerEvents = 'none';

const btn= document.createElement('button');
btn.style.position = 'fixed';
btn.style.zIndex = 99999;
btn.style.top = '0';
btn.style.right = '0';
btn.style.border = '0.3rem solid red';
btn.style.backgroundColor = "black";
btn.style.width = '50%';
btn.style.color = '#fff';
btn.style.height = '64px';
btn.style.opacity = "60%";
btn.innerHTML = "Klikaj tutaj";

setTimeout(() => {
    btn.style.opacity = "0%";
}, 3000)

let timer = null;
function fadeOut(element) {
    var op = 1;  // initial opacity
    element.style.display = 'block';
    if(timer != null)
        clearInterval(timer);
    timer = setInterval(function () {
        if (op <= 0.1){
            element.style.display = 'none';
            clearInterval(timer);
            return;
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 15);
}


const btnHTML = document.body.appendChild(btn);
document.body.appendChild(labelDiv);
btn.addEventListener('click', (e) => {
    labelDiv.innerHTML = "Skopiowano";
    btn.style.opacity = "0";
    fadeOut(labelDiv);
    quickCopy();

});