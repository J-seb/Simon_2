// Initiate the game object
const game = {

    // Some properties to get the state of the game
    isLive: false,
    currentLevel: 0,
    score: 0,
    
    // This properties will store data from the random sequence and player input
    sequence: [],
    inputSequence: [],

    //This properties will store the DOM elements that we will need to interact with the game
    buttons: [],
    domLabels: [],
    container: document.querySelector('.main-block'),
    tablePlayers: document.querySelector('.players'),

    //Array to pick a random color
    colors: ['yellow', 'blue', 'red', 'green'],

    // This method will get the DOM elements start/gameover and the score
    getDomLabels() {
        this.domLabels.push(document.querySelector('span'))
        this.domLabels.push(document.querySelector('p'))
    },

    // This method will get the DOM buttons
    getDomButtons () {
        this.buttons = document.querySelectorAll(".external-border")
    },

    // Generate new color for the sequence and add to sequence array
    generateNewLevel () {

        // Prepare the game properties of start/gameover, score and display inside the DOM
        this.inputSequence.length = 0
        this.currentLevel += 1
        this.domLabels[0].textContent = "Level " + this.currentLevel

        // Generate a new random color and push into the sequence
        const newRandomNumber = Math.floor(Math.random() * 4)
        this.sequence.push(this.colors[newRandomNumber])

        // This block will find the button of the previous color and generate a little visual efect over the button which is pressed.
        this.buttons.forEach((button) => {
            let color = button.classList[1]
            if (color === this.colors[newRandomNumber]) {
                this.playSound(color)
                button.classList.toggle(color)
                setTimeout(() => {
                    button.classList.toggle(color)
                }, 100)
            }
        })
    },

    // This function will check if player inputs and the random sequence are the same
    checkPattern(responseIndex) {
        if (this.isLive) {
            console.log(this.sequence[responseIndex], this.inputSequence[responseIndex])
            if (this.sequence[responseIndex] === this.inputSequence[responseIndex]) {
                this.score += 1
                if (this.sequence.length === this.inputSequence.length) {
                    setTimeout(() => {
                        this.domLabels[1].textContent = "Actual Score: " + this.score
                        this.generateNewLevel();
                      }, 500);
                }
            } else {
                this.domLabels[0].textContent = "Game Over"
                this.domLabels[1].textContent = "Actual Score: 0"
                this.container.classList.toggle('game-over')
                this.playSound()

                this.generateNewTableScore()
                this.renderTable()
                
                setTimeout(() => {
                    this.container.classList.toggle('game-over')
                    this.domLabels[0].textContent = "Start"
                    this.startOver()
                  }, 1000);
                
            }
        }
    },

    // Audios for each color
    audios: {
        yellow: new Audio('../sounds/yellow.mp3'),
        blue: new Audio('../sounds/blue.mp3'),
        red: new Audio('../sounds/red.mp3'),
        green: new Audio('../sounds/green.mp3'),

        gameOver: new Audio('../sounds/wrong.mp3')
    },

    // Method for play audios
    async playSound (color) {
        if (color === 'yellow') {
            await this.audios.yellow.play()
        } else if (color === 'blue') {
            await this.audios.blue.play()
        } else if (color === 'red') {
            await this.audios.red.play()
        } else if (color === 'green') {
            await this.audios.green.play()
        } else {
            await this.audios.gameOver.play()
        }
    },

    // This method will add an event for each button element and each click will push the value of the color inside the inputSequence
    enableButtons () {
        this.buttons.forEach((button) => {
            button.addEventListener("click", () => {

                console.log(this)
                let color = button.classList[1]
                this.inputSequence.push(color)
                this.playSound(color)
                button.classList.toggle(color)
                setTimeout(() => {
                    button.classList.toggle(color)
                }, 100)
                console.log(Object.keys(this.buttons).length)
                if (Object.keys(this.buttons).length !== 0) {
                    this.checkPattern(this.inputSequence.length - 1)
                }
            })
        })
    },

    // For initialize the game
    launchGame () {
        let trigger = document.querySelector('span')
        trigger.addEventListener("click", () => {
            if (!this.isLive) {
                console.log(this)
                this.isLive = true

                this.generateNewLevel()
            }
        })
    },

    // For reseting the game
    startOver () {
        this.currentLevel = 0
        this.inputSequence.length = 0
        this.sequence.length = 0
        this.isLive = false
        this.score = 0
    },

    tableData: [],

    generateNewTableScore() {
        let player = {
            name: 'XXX',
            score: this.score.toString(),
            date: (new Date()).toDateString()
        }
        console.log(player)
        this.tableData.push(player)
    },

    renderTable() {
        let row = this.tableData[this.tableData.length - 1]
        console.log(row)
        let name = `<td>${row.name}</td>`
        let score = `<td>${row.score}</td>`
        let date = `<td>${row.date}</td>`
        console.log(`<tr>${name}${score}${date}</tr>`)
        this.tablePlayers.insertAdjacentHTML('beforeend', `<tr>${name}${score}${date}</tr>`)
    }
}

game.getDomButtons()
game.getDomLabels()
game.enableButtons()
game.launchGame()