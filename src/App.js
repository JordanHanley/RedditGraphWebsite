import React, {useState} from 'react';
import ReactFlow from 'react-flow-renderer';
import './App.css';

import { render } from "react-dom";

import logo from './reddit-logo.png';
import redditman from "./reddit-character.png";

// get our fontawesome imports
//import { FaRedditAlien } from "react-icons/fa";
//import { faHome } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const [To, setTo] = useState("");
  const [From, setFrom] = useState("");
  const [subredditPath, setSubredditPath] = useState([]);
  function onsubmit(){
    getSubRedditPath(To, From , "BFS");
  }

  function getSubRedditPath(To, From, type){
    fetch("http://127.0.0.1:18080/" + type, {
      "from": From,
      "to": To,
    })
      .then(response => response.json())
      .then(data => populateSubRedditPaths(data.items));
  }

  function populateSubRedditPaths(elements){
    if(elements.length == 0) alert("Subreddit(s) not found!");
    else{
      var allSubreddits = [];
      let id = 1;
      let posX = 500;
      let posY = 0;
      for(var i = 0; i < elements.length; i++){
        if(id > 1)
        posX = id % 2 == 0 ? 400 : 600;
        allSubreddits.push({
          id: '' + (id++),
          data: { label: elements[i] },
          position: {x: posX,
             y: posY + (id-1) * 100},
          className: "graph-nodes",
          draggable: true,
          connectable: false,
        });
      }
      for(var i = 1; i < id-1; i++){
        allSubreddits.push({
          id: 'e' + i + '-' + (i+1),
          type: 'straight',
          source: '' + i,
          target: ''+ (i+1),
          animated: true,
          arrowHeadType: 'arrow',
          style : {stroke : '#ff4500'}
        });

      }
      console.log(subredditPath);
      setSubredditPath(allSubreddits);
      
    }
  }



  return (
    <div className="App">
        <div className="left-panel">
          <img src={logo} className="r-Logo" />
          <font style ={{fontSize:"2.5em", color:"white", fontWeight: 'bold'}}>
            <br />
                r/connect
            <hr style ={{borderColor: '#ff4500'}} />
          </font>
          <div 
            className="bottom" 
            style ={{fontSize:"1.5em", color:"#fff"}}>
            <p style ={{fontSize:"1.5em", color:"#fff", paddingTop: 5, fontWeight: 'bold'}}>
              Find the Shortest Path
            </p>
            <div>
              From:
              <input className="subSearch" value={From} 
                type="text" 
                placeholder="enter subreddit name" 
                onChange={(e) => setFrom(e.target.value)} 
                style={{marginLeft: 20, marginBottom: 5}}/>
            </div>
            <div>
              To:
              <input className="subSearch" 
                value={To} type="text" 
                placeholder="enter subreddit name" 
                onChange={(e) => setTo(e.target.value)}
                style={{marginLeft: 45}}/>
            </div>
          <button 
            className="submitButton" 
            onClick={() => onsubmit()}>
              Submit
          </button>
          <div className="algoButtons">
            <input type="radio" name="algos" value="1" id="first" />
            <label for="first">Breath First Search</label>
            <input type="radio" name="aglos" value="2" id="second" />
            <label for="second">Dijkstra's Algorithm</label>
          </div>
          </div>
        </div>
        <div className="right-panel">
            <ReactFlow elements={subredditPath} />
        </div>
    </div>
  );
}

//<img src={redditman} className="r-Logo" />

export default App;
