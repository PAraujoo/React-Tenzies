import React from "react"

export default function Scoreboard(props) {
    return (
        <div className="scoreboard">
            <div className="stats-container">
                <div className="rolls-best">
                    <p>Best Rolls</p>
                    <p className="flavored-text">{props.bestRolls}</p>
                </div>
                <div className="time-best">
                    <p>Best Time</p>
                    {/* Convert milliseconds in seconds */}
                    <p className="flavored-text">{props.bestTime / 100}s</p>
                </div>
            </div>
        </div>
    )
}