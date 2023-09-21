import React from 'react';
import { useState } from 'react';
import './SideBar.css';
import Tile from './Tile';
import './GameBoard.css';

function SideBar({ wordList, onRandomize, score, timer, playing, onPlay, onSignIn, onRegister, userData }) {

    const pointsDict = {
        3: 100,
        4: 400,
        5: 800,
        6: 1400,
        7: 1800,
        8: 2200,
        9: 2600
    }

    let minutes = Math.floor(Math.ceil(timer) / 60);
    let seconds = Math.ceil(timer % 60) % 60;
    if (seconds < 10) {
        seconds = "0" + seconds.toString();
    }

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    let accountInfo;

    if (userData) {
        console.log(userData);
        accountInfo = (<div className="user-data">
            <h4 id="user-title">{userData.username}</h4>
            <div className="stats">
                <div>
                    <p>Highscore</p>
                    <h2>{userData.highscore}</h2>
                </div>
                <div>
                    <p>Games Played</p>
                    <h2>{userData.gamesPlayed}</h2>
                </div>
            </div>
        </div>)
    } else {
        accountInfo = (<div className='user-data'>
            <h4>Account</h4>
            <div className='input-fields'>
                <input placeholder='Username' onChange={(e) => {e.target.value = e.target.value.replace(/\s/g, ''); setUser(e.target.value)}}/>
                <input placeholder='Password' type='password' onChange={(e) => {e.target.value = e.target.value.replace(/\s/g, ''); setPass(e.target.value)}}/>
            </div>
            <div className='account-button-container'>
                <button className='account-button' id='sign-in' onClick={() => onSignIn(user, pass)}>Sign In</button>
                <button className='account-button' id='register' onClick={() => onRegister(user, pass)}>Register</button>
            </div>
        </div>);
    }

    return(
        <div className="sidebar-container">
            <div className="sidebar">
                <h1>WordHunter</h1>
                <div className="control-box">
                    <div className={`button play ${playing ? "stop" : ""}`} onClick={onPlay}>{playing ? "Stop" : "Play"}</div>
                    <div className="button randomize" onClick={onRandomize}>Shuffle</div>
                </div>
                <div className="score-box">
                    <div className="points-box">
                        <h3 className="score">SCORE: {score}</h3>
                        <h3 className={`timer ${timer < 10 && timer % 1 == 0 ? "redflash" : ""}`}>{minutes} : {seconds}</h3>
                    </div>
                    <div className="found-words">
                        {wordList.map((s) => (<div className="found-word" key={s}><h4 className="found-string">{s}</h4><h4 className="found-points">{pointsDict[s.length]}</h4></div>))}
                    </div>
                </div>
                {accountInfo}
            </div>
        </div>
    );
}

export default SideBar;