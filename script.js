let input = document.getElementById("input");
let button = document.getElementById("button");
let question = document.getElementById("question");
let answer_div = document.getElementById("answer_div")
let result = document.getElementById("result");
let answer = document.getElementById("answer");
let timebar = document.getElementById("timebar");
let timetxt = document.getElementById("timetxt");
let quizstate = document.getElementById("quizstate");
let start = document.getElementById("startbuttons");
let quizdiv = document.getElementById("mainquiz");
let lifetxt = document.getElementById("life");
let gameresult = document.getElementById("gameresult");
let gameresulttxt = document.getElementById("gameresulttxt");

let normalButton = document.getElementById("b_normal");
let vocaloidButton = document.getElementById("b_vocaloid");
let taikoButton = document.getElementById("b_taiko");
let konanButton = document.getElementById("b_konan");

let tip = document.getElementById("tips");
let tips = ["入力する文字は全角ひらがなのみ。記号等も省略してね", "qを入力、送信することでスキップできる", "漢字でGOのパクリとか言わんでや", "これ見てるやつおる？"]
let tipNumber = 0
tip.textContent = `tip: ${tips[tipNumber]}`

let isGame = false
let iswait
let iscorrect

let level = 0
let maxQuizCount
let levelStage
let quizCount

let quizAssets = NORMAL_QUIZ
let quizs = quizAssets[level]
let alreadyQuiz = []
let nowQuiz

let maxlife = 3
let life = maxlife

let maxTime = 15 * 100
let time

window.setInterval(function() {
  if(!iswait && isGame) {
    time -= 1
    if(time <= 0) {
      UnCollect()
    }
    timebar.style.marginRight = `${(1 - time / maxTime) * 100}%`
    timetxt.textContent = `残り時間 : ${time / 100}`
  }
}, 10)

window.setInterval(function() {
  tipNumber += 1
  if(tips.length <= tipNumber) tipNumber = 0
  tip.textContent = `tip: ${tips[tipNumber]}`
}, 5000)

normalButton.addEventListener("click", () => {
  quizAssets = NORMAL_QUIZ
  maxTime = 15 * 100
  maxQuizCount = 15
  levelStage = 3
  StartGame()
})

vocaloidButton.addEventListener("click", () => {
  quizAssets = VOCALOID_QUIZ
  maxTime = 20 * 100
  maxQuizCount = 10
  levelStage = 3
  StartGame()
})

taikoButton.addEventListener("click", () => {
  quizAssets = TAIKO_QUIZ
  maxTime = 15 * 100
  maxQuizCount = 10
  levelStage = 3
  StartGame()
})

konanButton.addEventListener("click", () => {
  quizAssets = KONAN_QUIZ
  maxTime = 15 * 100
  maxQuizCount = 15
  levelStage = 3
  StartGame()
})

function StartGame() {
  isGame = true
  iswait = false
  life = maxlife
  lifetxt.textContent = `HP : ${life}/${maxlife}`
  button.textContent = "スキップ"
  answer_div.style.visibility = "hidden"
  quizdiv.style.display = "block"
  start.style.display = "none"
  gameresult.style.display = "none"
  time = maxTime
  quizCount = 0
  level = 0
  quizs = quizAssets[level]
  SetQuiz()
  input.value = ""
  input.focus()
}

function EndGame() {
  isGame = false
  quizdiv.style.display = "none"
  start.style.display = "block"
}

input.addEventListener("keypress", (e) => {
  if(e.keyCode == 13) {
    if(iswait) {
      Next()
    }
    else {
      if(input.value == "q" || input.value == "ｑ") {
        UnCollect()
        input.value = ""
        return
      }
      if(nowQuiz[1].includes(input.value)) {
        Collect()
      }
      else {
        Failed()
      }
    }
    input.value = ""
  }
})

button.addEventListener("click", () => {
  if(iswait) {
    Next()
  }
  else {
    UnCollect()
  }
});

function Collect() {
  result.textContent = "正解"
  quizCount += 1
  EndQuestion()
  iscorrect = true
}

function UnCollect() {
  result.textContent = "不正解"
  life -= 1
  EndQuestion()
  iscorrect = false
}

function EndQuestion() {
  answer_div.style.visibility = "visible"
  if(quizCount == maxQuizCount || life <= 0) {
    button.textContent = "終了"
    gameresult.style.display = "block"
    if(quizCount == maxQuizCount) {
      gameresulttxt.textContent = "クリアおめでとう！"
    }
    else {
      gameresulttxt.textContent = "ゲームオーバー乙！"
    }
  }
  else {
    button.textContent = "次へ"
  }
  iswait = true
  lifetxt.textContent = `HP : ${life}/${maxlife}`
}

function Next() {
  if(quizCount == maxQuizCount || life <= 0) {
    EndGame()
    return
  }
  time = maxTime

  if(quizCount % levelStage == 0 && iscorrect) LevelUp()
  input.focus()
  SetQuiz()
  answer_div.style.visibility = "hidden"
  button.textContent = "スキップ"
  iswait = false
}

function SetQuiz() {
  do {
    index = Math.floor(Math.random() * quizs.length)
  }
  while(alreadyQuiz.includes(index))
  nowQuiz = quizs[index]
  alreadyQuiz.push(index)
  if(quizs.length <= alreadyQuiz.length) alreadyQuiz = []
  question.textContent = nowQuiz[0]
  answer.textContent = `${nowQuiz[0]} : ${nowQuiz[1].join(', ')}`
  quizstate.textContent = `問題 : ${quizCount+1}/${maxQuizCount} 難易度 : ${level+1}`
}

function LevelUp() {
  level += 1
  alreadyQuiz = []
  quizs = quizAssets[level]
}

function Failed() {
  question.animate(
    [
      {transform : 'translate(0px, 0)', 'color': '#FF0000',},
      {transform : 'translate(10px, 0)'},
      {transform : 'translate(-8px, 0)'},
      {transform : 'translate(6px, 0)'},
      {transform : 'translate(-4px, 0)'},
      {transform : 'translate(2px, 0)'},
      {transform : 'translate(0px, 0)', 'color': '#000000',},
    ],
    300
  )
}