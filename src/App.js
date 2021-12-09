import logo from './reddit-logo.png';
import './App.css';
import React, {useState} from 'react';
//import { FaRedditAlien } from "react-icons/fa";

import subInput from './components/subInput';
import { render } from "react-dom";

// get our fontawesome imports
//import { faHome } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  return (
    <div className="App">
        <div className="left-panel">
        <img src={logo} className="r-Logo" />
        <font style ={{fontSize:"2.5em", color:"white", fontWeight: 'bold'}}>
          <br />
              r/connect
          <hr style ={{borderColor: '#ff4500'}} />
        </font>
          <div className="bottom" style ={{fontSize:"1.5em", color:"#fff"}}>
            <p style ={{fontSize:"1.5em", color:"#fff", paddingTop: 5, fontWeight: 'bold'}}>Find the Shortest Path</p>
            <div>
              From:
              <input className="subSearch" type="text" placeholder="enter subreddit name" style ={{marginLeft: 20, marginBottom: 5}}/>
            </div>
            <div>
              To:
              <input className="subSearch" type="text" placeholder="enter subreddit name" style ={{marginLeft: 45}}/>
            </div>
          <button className="submitButton" onClick={()=> alert("Hi there")}>Submit</button>

          </div>
        </div>
        
    </div>
  );
}

export default App;
