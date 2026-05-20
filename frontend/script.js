const homePage = document.getElementById("homePage");//блок "домашняя страница"
const textBlock = document.getElementById("textBlock");//блок "текстовый"
const variants = document.getElementById("variants");//блок "варианты ответа"
const textString = document.getElementById("textString");//"текстовая строка сюжета"
const puskPlay = document.getElementById("puskPlay");//кнопка "начать историю"
const newPlay = document.getElementById("newPlay");//кнопка "новая история"
const startPlay = document.getElementById("startPlay");//кнопка "запуск игры"
const logo = document.getElementById("logo");//логотип игры
let imgString = document.getElementById("imgString");//"фото-строка сюжета"
let audio = new Audio(); //  новый элемент Audio
let realId = "Ep1";//текущий эпизод
let p=true;//переменная начала новой истории
let realAudio;//настоящее аудио
let realImg;//настоящее изображение
let endHistory;//переменная "конец игры"
const screenSaver = new Audio ('screenSaver.mp3'); //элемент Audio 
startPlay.addEventListener("click", () => //обработчик события "старт"
{ 
    screenSaver.play(); 
    logo.src = "logo.png";
    logo.alt = "cover";
    logo.style.height = `${window.innerHeight}px`;
    puskPlay.style.display = "block";
    startPlay.style.display = "none";
});

function soundStep(src)//функция звукового сопровоождения
{
    audio.pause(); // автоматическая остановка проигрывания
    audio.src = "";//  очистка пути
    audio.src = src; //  путь к звуку "клика"
    audio.autoplay = true; // автоматический запуск
}

function imgDisplay(src)//функция изобразительного сопровоождения
{   
    return new Promise(function(resolve)
    {   
        imgString.src = src;
        imgString.onload = () => 
        {
            if(src == "question3.jpg")
            {
                imgString.style.top = "20%"; // центр по горизонтали
                imgString.style.height = "50dvh";
            } 
            else
            {
                imgString.style.top = "1%"; // центр по горизонтали
                imgString.style.height = "100dvh";
            } 
            resolve(imgString);
        };
    });  
}

function selectFill(answers)//функция "заполнение списка элементами"
{
    variants.innerHTML = "";//очищаем список
    for (let i=0; i<answers.length; i++)
    {
        let opt = document.createElement("option");//элемент списка
        opt.textContent = answers[i]["#text"];//передача текстового значения
        opt.value = answers[i]["@_next"];//передача ссылки на следующий эпизод
        variants.appendChild(opt);//добавление элемента в список
        variants.style.color = "#800000";
        variants.style.backgroundColor = "#fff8e7";
        variants[0].style.color = "#fff8e7";
        variants[0].style.backgroundColor = "#800000"; 
    }
    variants.size = answers.length;//установка длины списка
    variants.style.display = "block";//отображаем список
    variants.style.objectFit = "contain"; // сохраняет пропорции
}

puskPlay.addEventListener("click", async function(e)//обработчик события "запуск игры"
{
    if(p)
    {
        homePage.style.display = "none";
        puskPlay.textContent = "Продолжить";
        textBlock.style.display = "block";
        screenSaver.pause();
        p=false;
    }
    const result = await fetch(`/episode?id=${realId}`);
    const json = await result.json();
    textString.textContent = json.story["#text"];
    realAudio = json.story["@_audio"];
    realImg = json.story["@_img"]; 
    endHistory = json.story["@_end"];

    if(realAudio)
    { 
        soundStep(realAudio);
    }

    if(realImg)
    { 
        await imgDisplay(realImg);        
    }

    if(json.answer==undefined)
    {
        realId=json["@_next"];
        variants.style.display = "none";
    }
    else
    {
        let choice = json.answer;
        selectFill(choice);
    }

    if(endHistory)
    {
        newPlay.style.display = "block";
        puskPlay.style.display = "none"; 
    }
});

variants.addEventListener("change", (event)=>//обработчик события "выбор варианта"
{
    realId = variants.value;
});

newPlay.addEventListener("click", ()=>//обработчик события "новая игра"
{
  history.go(0);
});