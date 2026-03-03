const basket = document.getElementById("basket");
const gameArea = document.getElementById("gameArea");

const scoreEl = document.getElementById("score");
const targetEl = document.getElementById("target");
const alienEl = document.getElementById("alienCount");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");

const pauseScreen = document.getElementById("pauseScreen");
const endScreen = document.getElementById("endScreen");
const endMessage = document.getElementById("endMessage");
const welcomeScreen = document.getElementById("welcomeScreen");

const startSound = document.getElementById("startSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const bgm = document.getElementById("bgm");

let score=0;
let alienCount=0;
let target = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
let gameRunning=false;
let paused=false;
let speed=2;
let spawnInterval;

targetEl.textContent=target;

const animals=[
"download__32_-removebg-preview.png",
"download__33_-removebg-preview.png",
"download__36_-removebg-preview.png",
"download__37_-removebg-preview.png"
];

function spawnAnimal(){
if(!gameRunning||paused) return;

const img=document.createElement("img");
img.classList.add("animal");

const isAlien=Math.random()<0.2;
img.src=isAlien?"ALIEN_D-removebg-preview.png":animals[Math.floor(Math.random()*animals.length)];
img.dataset.type=isAlien?"alien":"animal";

img.style.left=Math.random()*(window.innerWidth-80)+"px";
img.style.top="-80px";

gameArea.appendChild(img);

let fall=setInterval(()=>{
if(paused){clearInterval(fall);return;}

img.style.top=img.offsetTop+speed+"px";

if(img.offsetTop>window.innerHeight){
img.remove();
clearInterval(fall);
}

checkCatch(img,fall);

},20);
}

function checkCatch(img,fall){
const basketRect=basket.getBoundingClientRect();
const imgRect=img.getBoundingClientRect();

if(
imgRect.bottom>=basketRect.top &&
imgRect.left<basketRect.right &&
imgRect.right>basketRect.left
){
clearInterval(fall);
img.remove();

if(img.dataset.type==="alien"){
alienCount++;
alienEl.textContent=alienCount;
wrongSound.play();
basket.style.opacity="0.3";
setTimeout(()=>basket.style.opacity="1",200);

if(alienCount>=5) endGame(false);

}else{
score++;
scoreEl.textContent=score;
speed+=0.2;

if(score>=target) endGame(true);
}
}
}

function startGame(){
gameRunning=true;
startSound.play();
bgm.play().catch(()=>{});
welcomeScreen.style.display="none";
spawnInterval=setInterval(spawnAnimal,1000);
}

function endGame(win){
gameRunning=false;
bgm.pause();
clearInterval(spawnInterval);
document.querySelectorAll(".animal").forEach(e=>e.remove());
endScreen.classList.remove("hidden");

if(win){
winSound.play();
endMessage.textContent="MISSION SUCCESS";
}else{
loseSound.play();
endMessage.textContent="Yahaha Nice Try!";
}
}

pauseBtn.onclick=()=>{
if(!gameRunning) return;
paused=true;
clearInterval(spawnInterval);
pauseScreen.classList.remove("hidden");
};

continueBtn.onclick=()=>{
paused=false;
pauseScreen.classList.add("hidden");
clearInterval(spawnInterval);
spawnInterval=setInterval(spawnAnimal,1000);
};

restartBtn.onclick=()=>location.reload();
startBtn.onclick=startGame;

document.addEventListener("mousemove",e=>{
if(!gameRunning||paused) return;
basket.style.left=e.clientX-basket.offsetWidth/2+"px";
});

document.addEventListener("touchmove",e=>{
if(!gameRunning||paused) return;
basket.style.left=e.touches[0].clientX-basket.offsetWidth/2+"px";
});
