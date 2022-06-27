
// Options
// let duration = 1000;
let visibletime = 3000;
let maxTries = 2;
let FoundPics = [];
let imgNumber = 12;
let imgs = [];

let options = {
    
    name: null,
    max_tries: 5,
    cardsNumber: 5,
    useTimer: false,
    visibletime: 3000,
    cardFlipDuration: 1000

};

document.getElementById("max_tries_span").innerHTML = parseInt(options.max_tries);



const form = document.getElementById('form');
const submitBtn = document.getElementById("submit");


function useTimerInput(){

    let inputEl = document.getElementById("useTimer");
        inputEl.toggleAttribute("checked");

    if(inputEl.hasAttribute("checked")) {
        document.querySelectorAll(".max-tries-container input").forEach(element => {
            element.setAttribute("disabled", "disabled");
        });

        document.querySelectorAll(".timer-options input").forEach(element => {
            element.removeAttribute("disabled");
        });

    } else{
        document.querySelectorAll(".max-tries-container input").forEach(element => {
            element.removeAttribute("disabled");
        });

        document.querySelectorAll(".timer-options input").forEach(element => {
            element.setAttribute("disabled", "disabled");
        });
    }

}

document.addEventListener("DOMContentLoaded", function() {

    // handle useTimerInput
    document.querySelector(".peer").addEventListener("click", useTimerInput);

    submitBtn.addEventListener("click", function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        for (const [key, value] of formData) {
            console.log(key, value);
            options[key] = value;

            // Check if the user used the useTimer Option
            formData.get("useTimer") ?  options.useTimer = true : options.useTimer = false;
            formData.get("useTimer") ?  options.timeInMinutes = options["timeInMinutes"] : options.timeInMinutes = null;
            formData.get("useTimer") ? options.max_tries = false : options.max_tries = options["max_tries"];
          }
          console.log(options)
         //startGame(options);
    })
});


// generate the images
for(i = 0; i < options.cardsNumber; i++){
    imgs.push({
        
        pic: `https://robohash.org/${[i]}.png?set=set4&size=130x130`,
        dataAttr: `pic-${[i]}`
    });
}


// Append the Cards the the #App
for(i = 0; i < imgs.length; i++) {  createBlocks(); }

let allBlocks = document.querySelectorAll(".game-block");
let blocksToArray = Array.from(allBlocks);
let countBlocks = [...Array(blocksToArray.length).keys()];

window.onload = function(){
    if(document.readyState === "complete"){
        var sound = new Howl({
            src: ['./song/background-sound.mp3'],
            autoplay: true,
            loop: true
        });

        sound.play();
    }
}

blocksToArray.forEach((gameblock, index) => {

    // Show The Cards for a Certain time Before The Game Begins
    gameblock.classList.add("visible");
    setTimeout(() => {
        gameblock.classList.remove("visible");
        // document.getElementById("alert").classList.add("invisible")
    }, options.visibletime);
    
    // shuffle the gameBlocks
    let shuffled = shuffle(countBlocks);
    gameblock.style.order = shuffled[index];

    gameblock.onclick = function() {

        gameblock.classList.add("flipped");

        let allflippedblocks = blocksToArray.filter(flippedblock => flippedblock.classList.contains("flipped") );
       
        check(allflippedblocks);

    }


    function check(arr){
        
            if(options.max_tries !== 0) {
                
                if(arr.length >= 2) {

                    document.getElementById("App").classList.add("no-click");
                    if(arr[0].dataset.pic === arr[1].dataset.pic) {

                        stopFromClicking(arr);
                        
                        var sound = new Howl({ src: ['./song/success-sound-effect.mp3'], });
                        sound.rate(3, sound.play());

                        arr[0].classList.add("visible");
                        arr[1].classList.add("visible");
                        arr[0].classList.remove("flipped");
                        arr[1].classList.remove("flipped");

                        let gameSolved = arr.every(arrb => arrb.classList.contains("visible"));
                        let allBlocks = document.querySelectorAll(".game-block");
                        let blocksToArray = Array.from(allBlocks);
                        
                        if(gameSolved) {
                            FoundPics.push({name: arr[0].dataset.pic});
                            if(FoundPics.length == blocksToArray.length / 2){
                                
                                setTimeout(() => {
                                    document.getElementById("App").classList.add("no-click");
                                    alert("Wooow You won");
                                }, cardFlipDuration)
                            }
                        }

                        console.log(FoundPics);
                        document.getElementById("App").classList.remove("no-click");
                        
                        console.log("matched")
        
                    } else {
                        var sound = new Howl({
                            src: ['./song/Wrong Clakson Sound Effect.mp3'],
                            volume: 0.3,
                            
                          });
                          
                        sound.rate(1, sound.play());
                        
                        setTimeout(() => {
                            
                            let max_tries_span = document.getElementById("max_tries_span");
                            max_tries_span.innerHTML = parseInt(max_tries_span.innerHTML) - 1;
                            options.max_tries--;
                            console.log(maxTries);
                            arr[0].classList.remove("flipped");
                            arr[1].classList.remove("flipped");
                            document.getElementById("App").classList.remove("no-click");
                        }, options.cardFlipDuration);
                        
                        console.log("not Matched")
                    }
        
                    
                }
        
                
            } else {
                document.getElementById("App").classList.add("no-click");
                blocksToArray.forEach(x => {
                    x.classList.add("visible", "opacity-30");
                });

                let createCryingScene = document.createElement("div");
                createCryingScene.classList.add("absolute", "top-0", "left-0", "w-full", "h-screen", "-z-10");
                let gif = document.createElement("img");
                gif.setAttribute("src", "./imgs/sad-crying.gif");
                gif.classList.add("w-full", "h-full", "opacity-40");
                createCryingScene.appendChild(gif);
                document.querySelector("body").appendChild(createCryingScene);
                
                restartGame();
            }
        }
    
});


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
 
  function stopFromClicking(arr){
        let allElements = document.querySelectorAll(`.game-block[data-pic='${arr[0].dataset.pic}']`);
        allElements.forEach(element => {
            element.classList.add("no-click");
    });
  }

  function createBlocks() {
    // create the Parent Element
    let parentBlock = document.createElement("div");
    parentBlock.classList.add("game-block", "relative", "h-36", "w-36");
    parentBlock.dataset.pic = imgs[i].dataAttr;
    // create the front Face
    let frontFace = document.createElement("div");
    frontFace.classList.add("front", "absolute", "border-slate-400", "border-2",  "w-full", "h-full", "inset-0", "rounded-lg");
    // create The Back frontFace
    let backFace = document.createElement("div");
    backFace.classList.add("back", "absolute", "border-slate-500", "border-2",  "w-full", "h-full", "inset-0", "rounded-lg", "p-4");
    // create the img Element
    let backFaceimg = document.createElement("img");
    backFaceimg.classList.add("object-center", "object-cover");
    backFaceimg.setAttribute("src", imgs[i].pic);
    // Append the img to tha BackFace Elemement
    backFace.appendChild(backFaceimg);
    parentBlock.appendChild(frontFace);
    parentBlock.appendChild(backFace);

    

    let parentBlock2 = document.createElement("div");
    parentBlock2.classList.add("game-block", "relative", "h-36", "w-36");
    parentBlock2.dataset.pic = imgs[i].dataAttr;

    // create the front Face
    let frontFace2 = document.createElement("div");
    frontFace2.classList.add("front", "absolute", "border-slate-400", "border-2",  "w-full", "h-full", "inset-0", "rounded-lg");
    // create The Back frontFace
    let backFace2 = document.createElement("div");
    backFace2.classList.add("back", "absolute", "border-slate-200", "border-2",  "w-full", "h-full", "inset-0", "rounded-lg", "p-4");
    // create the img Element
    let backFaceimg2 = document.createElement("img");
    backFaceimg2.classList.add("object-center", "object-cover");
    backFaceimg2.setAttribute("src", imgs[i].pic);
    // Append the img to tha BackFace Elemement
    backFace2.appendChild(backFaceimg2);
    parentBlock2.appendChild(frontFace2);
    parentBlock2.appendChild(backFace2);

    document.getElementById("App").appendChild(parentBlock);
    document.getElementById("App").appendChild(parentBlock2);
  }

  function restartGame() {

    // createElement Button
    let restartBtn = document.createElement("button");
    restartBtn.innerHTML = "Restart Game";
    restartBtn.classList.add("bg-blue-500", "absolute", "top-2", "right-2", "hover:bg-blue-400", "text-white", "font-bold", "py-2", "px-4", "border-b-4", "border-blue-700", "hover:border-blue-500", "rounded");
    document.querySelector("body").appendChild(restartBtn);
    restartBtn.onclick = () => {
        location.reload();
    }

  }