const canvas = document.querySelector("#game")
const btnUp = document.querySelector("#up")
const btnDown = document.querySelector("#down")
const btnLeft = document.querySelector("#left")
const btnRight = document.querySelector("#right")
const game = canvas.getContext("2d")
const spanTime = document.querySelector("#spantime")
const spanLives = document.querySelector("#lives")
const spanRecord = document.querySelector("#record")
const pResult = document.querySelector("#result")
const winScreen = document.querySelector(".win-screen")
const heart = document.querySelector("#heart-break")

let canvasSize
let elementsSize
let timeStart
let timeInterval 
let level = 0
let lives = 3
let deadsPositions = {}

const player = {
  x: undefined, 
  y: undefined, 
}
const giftPosition = { 
  x: undefined, 
  y: undefined, 
}

let enemiesPositions = []
 
window.addEventListener("load", setCanvasSize)
window.addEventListener("resize", setCanvasSize)

function clearMap () {
  game.clearRect(0, 0, canvasSize, canvasSize)
}

function setCanvasSize () {
  if(window.innerWidth > window.innerHeight) {
    canvasSize = window.innerHeight * .7
  } else {
    canvasSize = window.innerWidth * .7
  }

  canvasSize = canvasSize.toFixed(3)

  canvas.setAttribute("width", canvasSize)
  canvas.setAttribute("height", canvasSize)

  elementsSize = canvasSize / 10
  
  player.x = undefined
  player.y = undefined

  heart.setAttribute("width", canvasSize / 2)
  heart.style.top = (canvasSize / 3.5) + 'px';

  startGame()
}

function startGame() {
  clearMap()
  game.font = elementsSize + "px Verdana"

  let map = maps[level]
  if (!map) {
    gameWin()
    return
  }

  if (!timeStart) {
    timeStart = Date.now()
    timeInterval = setInterval(showTime, 100)
    showRecord()
  }

  const lines = map.trim().split('\n');
  const arrayOfArrays = lines.map(line => line.trim().split(''));
 
  showLives()

  arrayOfArrays.forEach((row, indexR) => {
    row.forEach((col, indexC) => {
      const emoji = emojis[col]
      const postX = elementsSize * indexC      
      const postY = elementsSize * (indexR + 1)      
      
      if(player.x === undefined && col == "O") {
        player.x = postX
        player.y = postY
      } else if (col == "I") {
        giftPosition.x = postX
        giftPosition.y = postY
      } else if (col == "X") {
        let element = {
          x: postX.toFixed(0),
          y: postY.toFixed(0),
        }
        enemiesPositions.push(element)
      }
      //fillText(Text, cordenada x, cordenada y)
      game.fillText(emoji, postX, postY)
    })
  });
  movePLayer()
  printExplosion()

}



function movePLayer () {
  const distance = Math.sqrt((player.x - giftPosition.x) ** 2 + (player.y - giftPosition.y) ** 2);
  const collisionThreshold = elementsSize / 2; // Tolerancia para la colisión

  if (distance < collisionThreshold) {
    levelWin();
  }

  const enemyCollision = enemiesPositions.find(enemy => {
    const enemyCollisionX = enemy.x == player.x.toFixed(0)
    const enemyCollisionY = enemy.y == player.y.toFixed(0)
    return enemyCollisionX && enemyCollisionY
  })

  if (enemyCollision) {
    levelFails()
  }
  game.fillText(emojis["PLAYER"], player.x, player.y)
}

function levelWin () {
  level++
  enemiesPositions = []
  startGame()
}

function levelFails () {
  if (!deadsPositions[level]) {
    deadsPositions[level] = [];
  }

  deadsPositions[level].push({
    x: player.x,
    y: player.y,
  });
  
  lives--
  spanLives.innerHTML = emojis.HEART
  if (lives == 0) {
    enemiesPositions = [] 
    level = 0     
    lives = 3
    timeStart = undefined
  }

  heart.style.opacity = 1;
  canvas.style.opacity = .1;
  
  setTimeout(function() {
    heart.style.opacity = 0;
    canvas.style.opacity = 1;
  }, 500);

  player.x = undefined
  player.y = undefined
  startGame()
}

function printExplosion() {
  const levelPositions = deadsPositions[level];
  if (levelPositions) {
    levelPositions.forEach((element) => {
      game.fillText(emojis["BOMB_COLLISION"], element.x, element.y);
    });
  }
}

function gameWin () {
  clearInterval(timeInterval)

  const recordTime =  localStorage.getItem("record_time")
  const playerTime = (Date.now() - timeStart);

  if (recordTime) {
    if (recordTime > playerTime) {
      localStorage.setItem("record_time", playerTime)
      pResult.innerHTML = "superaste el record"
    } else {
      pResult.innerHTML = "No superaste el record de " + (recordTime / 1000) + " segundos"
    }
  } else {
    localStorage.setItem("record_time", playerTime)
    pResult.innerHTML = "Primera vez?, ahora superate bro"
  }

  winScreen.classList.remove("inactive")
}

function showLives () {
  //los dos metodos funcionan
  spanLives.innerHTML = ""  
  spanLives.innerHTML = emojis.HEART.repeat(lives)

  //let herartsArr = Array(lives).fill(emojis.HEART) //crea un array con la cantidad de elementos que diga lives
  //herartsArr.forEach(element => spanLives.append(element))
}

function formatTime(ms){
  const cs = parseInt(ms/10) % 100
  const seg = parseInt(ms/1000) % 60
  const min = parseInt(ms/60000) % 60
  const csStr = `${cs}`.padStart(2,"0")
  const segStr = `${seg}`.padStart(2,"0")
  const minStr = `${min}`.padStart(2,"0")
  return`${minStr}:${segStr}:${csStr}`
}
function showTime () {
  let interval = formatTime(Date.now() - timeStart)

  spanTime.innerHTML = interval
}

function showRecord() {
  spanRecord.innerHTML = formatTime(localStorage.getItem("record_time"))
}

document.addEventListener("keydown", keyCode)
btnUp.addEventListener("click", () => moveByKeys("ArrowUp"));
btnDown.addEventListener("click", () => moveByKeys("ArrowDown"));
btnLeft.addEventListener("click", () => moveByKeys("ArrowLeft"));
btnRight.addEventListener("click", () => moveByKeys("ArrowRight"));

function keyCode(keyBoard) {
  let key = keyBoard.key
  moveByKeys(key)
}

function moveByKeys(keyBoard) {
  switch (keyBoard) {
    case "ArrowUp": 
      if (player.y > elementsSize) {
        player.y -= elementsSize
        startGame()
      }
      break;
    case "ArrowDown":
      if (player.y < canvasSize) { 
        player.y += elementsSize
        startGame()        
      }
      break;
    case "ArrowLeft":
      if (player.x > elementsSize - elementsSize) { 
        player.x -= elementsSize
        startGame()
      }
      break;
    case "ArrowRight":
      if (player.x < canvasSize - elementsSize) {  
        player.x += elementsSize
        startGame()  
      }
      break;
  }
}


