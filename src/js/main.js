
let FoundPics = [];
let imgs = [];

let options = {
    
    name: null,
    max_tries: 5,
    cardsNumber: 5,
    useTimer: false,
    visibletime: 3000,
    cardFlipDuration: 1000

};

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
            formData.get("useTimer") ? document.getElementById("max_tries_span").parentElement.classList.add("invisible") : document.getElementById("max_tries_span").innerHTML = parseInt(options.max_tries);
            formData.get("max_tries") == "unlimited" ? document.getElementById("max_tries_span").innerHTML = "unlimited" : document.getElementById("max_tries_span").innerHTML = parseInt(options.max_tries);
        }
          console.log(options);
          if(formData.get("useTimer")) { let flip = new FlipDown(Math.floor(addMinutes(parseInt(options.timeInMinutes)).getTime() / 1000)); 
          if(document.getElementById("flipdown").children.length == 0 ) {
            flip.start();
            } else{
                document.getElementById("flipdown").children[0].remove();
            }
            flip.ifEnded(() => {
            
                let allBlocks = document.querySelectorAll(".game-block");
                let blocksToArray = Array.from(allBlocks);
                if(FoundPics.length != blocksToArray.length / 2) {
                    cry_dance_scene("./imgs/sad-crying.gif");
                }
            
            });
          }
          
          // generate the images
            for(i = 0; i < options.cardsNumber; i++){
                imgs.push({
                    pic: `https://robohash.org/${[i]}.png?set=set4&size=130x130`,
                    dataAttr: `pic-${[i]}`
                });
            }

            // Append the Cards the the #App
            for(i = 0; i < imgs.length; i++) {  createBlocks(); }
            console.log(document.readyState);
            if(document.readyState == "complete") {
                startGame(options);
            };
    })



function startGame(options) {

    

    document.querySelector(".form").classList.add("invisible");
    // Set Some Variables
    let allBlocks = document.querySelectorAll(".game-block");
    let blocksToArray = Array.from(allBlocks);
    let countBlocks = [...Array(blocksToArray.length).keys()];

    // Start Background Sound
    
        if(document.readyState === "complete"){

            var sound = new Howl({
                src: ['./song/background-sound.mp3'],
                autoplay: true,
                loop: true
            });
            sound.play(); }

    
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
                
                

                // Add Class Flipped on the clicked Card
                gameblock.onclick = function() {
                    gameblock.classList.add("flipped");
                    let allflippedblocks = blocksToArray.filter(flippedblock => flippedblock.classList.contains("flipped") );
                    // Call The Check Function Where it checks if the cards are the same
                    check(allflippedblocks); 
                }
            
            
                function check(arr){

                    if(options.max_tries != false || options.max_tries != 0) { 
                        if(arr.length >= 2) {
                            // prevent from Clicking if already tow card are flipped
                            document.getElementById("App").classList.add("no-click");
                            
                            // check if they are the same
                            if(arr[0].dataset.pic === arr[1].dataset.pic) {
                                
                                // Prevent the user From clicked on the flipped cards
                                stopFromClicking(arr);
                                
                                // Play the Success Sound
                                var sound = new Howl({ src: ['./song/success-sound-effect.mp3'], });
                                sound.rate(3, sound.play());
                
                                // Keep the cards Visible
                                arr[0].classList.add("visible");
                                arr[1].classList.add("visible");
                                arr[0].classList.remove("flipped");
                                arr[1].classList.remove("flipped");
                
                                let gameSolved = arr.every(arrb => arrb.classList.contains("visible"));

                                if(gameSolved) {
                
                                    FoundPics.push({name: arr[0].dataset.pic});
                                    if(FoundPics.length == blocksToArray.length / 2){
                                        setTimeout(() => {
                                            document.getElementById("App").classList.add("no-click");
                                            cry_dance_scene("./imgs/dancing.gif");
                                        }, options.cardFlipDuration)
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
                                    
                                    if(options.max_tries !== "unlimited"){
                                        document.getElementById("max_tries_span").innerHTML = parseInt(document.getElementById("max_tries_span").innerHTML) - 1;
                                        options.max_tries--;
                                    }
                                    arr[0].classList.remove("flipped");
                                    arr[1].classList.remove("flipped");
                                    document.getElementById("App").classList.remove("no-click");
                                }, options.cardFlipDuration);
                                
                            }
                        }
                     } else {
                        if(options.max_tries == 0 && options.useTimer != true) {

                            cry_dance_scene("./imgs/sad-crying.gif");
                        }
                     }
                    if(options.useTimer == true) { useTimerValidation(arr) }
                }
                
            });

}

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

    let restartBtn = document.createElement("button");
    restartBtn.innerHTML = "Restart Game";
    restartBtn.classList.add("bg-blue-500", "absolute", "top-4", "right-4", "hover:bg-blue-400", "text-white", "font-bold", "py-2", "px-4", "border-b-4", "border-blue-700", "hover:border-blue-500", "rounded");
    document.querySelector("body").appendChild(restartBtn);

    restartBtn.onclick = () => {
        location.reload();
    }
}

function cry_dance_scene(fileLink) {

    let allBlocks = document.querySelectorAll(".game-block");
    let blocksToArray = Array.from(allBlocks);

    document.getElementById("App").classList.add("no-click");
    blocksToArray.forEach(x => {
        x.classList.add("visible", "opacity-30");
    });

    let createCryingScene = document.createElement("div");
    createCryingScene.classList.add("absolute", "top-0", "left-0", "w-full", "h-screen", "-z-10");
    let gif = document.createElement("img");
    gif.setAttribute("src", `${fileLink}`);
    gif.classList.add("w-full", "h-full", "opacity-40");
    createCryingScene.appendChild(gif);
    document.querySelector("body").appendChild(createCryingScene);
    
    restartGame();
}


function addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
}

function useTimerValidation(arr) {

    
    
      if(arr.length >= 2) {
        // prevent from Clicking if already tow card are flipped
        document.getElementById("App").classList.add("no-click");
        
        // check if they are the same
        if(arr[0].dataset.pic === arr[1].dataset.pic) {
            
            // Prevent the user From clicked on the flipped cards
            stopFromClicking(arr);
            
            // Play the Success Sound
            var sound = new Howl({ src: ['./song/success-sound-effect.mp3'], });
            sound.rate(3, sound.play());

            // Keep the cards Visible
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
                        document.getElementById("App").classList.add("no-click");
                        blocksToArray.forEach(x => {
                            x.classList.add("visible", "opacity-30");
                        });   
                        // win
                        cry_dance_scene("./imgs/dancing.gif");
                        restartGame();

                    }, options.cardFlipDuration)
                }
            }

            console.log(FoundPics);
            document.getElementById("App").classList.remove("no-click");
            
            console.log("matched");

        } else {
            var sound = new Howl({
                src: ['./song/Wrong Clakson Sound Effect.mp3'],
                volume: 0.3,
                });
                sound.rate(1, sound.play());
            
                setTimeout(() => {
                //maxTries--;
                //document.getElementById("max-tries").innerHTML = parseInt(document.getElementById("max-tries").innerHTML) - 1;
             
                arr[0].classList.remove("flipped");
                arr[1].classList.remove("flipped");
                document.getElementById("App").classList.remove("no-click");
            }, options.cardFlipDuration);
            
            console.log("not Matched")
        }
    }
}

function lastTimePlayed() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds(); 
    let fullDate = `${year}/${month}/${day} / ${hours}:${minutes}:${seconds}`;

    return fullDate();
}