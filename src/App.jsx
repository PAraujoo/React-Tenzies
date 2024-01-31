import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Scoreboard from "./components/Scoreboard"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)

    const [bestRolls, setBestRolls] = React.useState(
        JSON.parse(localStorage.getItem("bestRolls")) || 0
    )

    const [bestTime, setBestTime] = React.useState(
      JSON.parse(localStorage.getItem("bestTime")) || 0
    )

    // useEffect to sync 2 different states together
    React.useEffect(() => {
        // check all dice are held
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        // check if every die's value has the same one as the first die in dice array
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setStart(false)

            setRecords()
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            updateRolls()
        } else {
            resetGame()
        }
    }

    function resetGame() {
      setTenzies(false) 
      setDice(allNewDice())
      setRolls(0)
      setStart(true)
      setTime(0)
    }

    // Updating roll counter
    function updateRolls() {
      return setRolls(prevRolls => prevRolls + 1)
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    function setRecords() {
      // Check if bestRolls doesn't exist or newest rolls are better than bestRolls if so reassign the variable
      if (!bestRolls || rolls < bestRolls) {
        setBestRolls(rolls);
      }
  
      const timeFloored = Math.floor(time / 10);
      // Check if bestTime doesn't exist or newest time is lower than bestTime if so reassign the variable
      if (!bestTime || timeFloored < bestTime) {
        setBestTime(timeFloored);
      }
    }

    // set bestRolls to localStorage every item bestRolls changes
    React.useEffect(() => {
      localStorage.setItem("bestRolls", JSON.stringify(bestRolls))
    }, [bestRolls])

    // set bestTime to localStorage every item bestTime changes
    React.useEffect(() => {
      localStorage.setItem("bestTime", JSON.stringify(bestTime))
    }, [bestTime])
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    const [theme, setTheme] = React.useState("Light")

    const toggle = () => {
      setTheme(prevTheme => prevTheme === "Light" ? "Dark" : "Light")
    }

    // ---------TIMER---------- //
    const [time, setTime] = React.useState(0) 
    const [start, setStart] = React.useState(true)

    React.useEffect(() => {
      let interval = null 
      if (start) {
        interval = setInterval(() => {
          setTime(prevTime => prevTime + 10)
        }, 10)
      }
      else {
        clearInterval(interval)
      }
      return () => clearInterval(interval)
    }, [start])
    
    return (
      <div className="app-container shadow-shorter" data-theme={theme}>
        <main>
            {tenzies && <Confetti />}
            
            <h1 className="title">Tenzies</h1>
            
            <p className="instructions">Roll until all dice are the same. 
            <br /> Click each die to freeze it at its current value between rolls.</p>
            
            <div className="stats-container">
                <p>Rolls: {rolls}</p>
                <p>
                  Timer: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                  {("0" + ((time / 10) % 1000)).slice(-2)}
                </p>
            </div>
            
            <div className="dice-container">
                {diceElements}
            </div>
            
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>

            <Scoreboard 
              bestRolls={bestRolls}
              bestTime={bestTime}
            />
        
        </main>

        <div className="theme-toggle">
            <h2>{theme} Theme</h2>
            <input type="checkbox" id="theme" class="toggle-ball" onClick={toggle}></input>
            <label for="theme" className="label">
              <div className="ball"></div>
            </label>
        </div>
      </div>
    )
}