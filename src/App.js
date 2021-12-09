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
  const [Type, setType] = useState("");
  function onsubmit(){
    if(To == "" || From == "") alert("Incorrect subreddit input");
    else if(Type == "" ) alert("Please select an Algorithm");
    else getSubRedditPath(To, From , Type);
  }

  function getSubRedditPath(To, From, type){
    fetch("http://127.0.0.1:18080/" + type, {
    method: 'POST',
    body: JSON.stringify({"from": From, "to": To}),
    headers: {
            'Content-Type': 'text/plain'
      }
    })
      .then(response => response.json())
      .then(data => populateSubRedditPaths(data));
  }

  function populateSubRedditPaths(elements){
    if(elements.length <= 1) alert("Subreddit(s) not found!");
    else{
      var allSubreddits = [];
      let id = 1;
      let posX = 0;
      let posY = 350;
      for(var i = 0; i < elements.length; i++){
        if(id > 1){
          posX += 120;
          posY = id % 2 == 1 ? Math.abs(((350 - id * 50))) % 600 : (350 % (id * 50));
        }
        if(i == elements.length - 1) posY = 350;
        allSubreddits.push({
          id: '' + (id++),
          data: { label: elements[i] },
          position: {x: posX,
             y: posY},
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
      //console.log(subredditPath);
      setSubredditPath(allSubreddits);
      
    }
  }

  return (
    <div className="App">
        <div className="left-panel">
          <img src={logo} className="r-Logo" style = {{marginTop: 10}} />
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
            <br />
            <div className="algoButtons" style ={{fontSize:"1em"}}>
             <p style ={{fontSize:"1em", color:"#fff", paddingTop: 5, fontWeight: 'bold'}}>
              Algorithm Type:
              </p>
              <input type="radio" name="algos" value="BFS" id="first" onChange={(e) => setType(e.target.value)}/>
              <label for="first">Breath First Search</label>
              <br />
              <input type="radio" name="algos" value="dijkstra" id="second" onChange={(e) => setType(e.target.value)}/>
              <label for="second">Dijkstra's Algorithm</label>
            </div>
            <br /><br />
            <div className="Buttons">
              <button 
                className="submitButton" 
                onClick={() => onsubmit()}>
                  Submit
              </button>
              <button onClick={() => window.location.reload()}
                className="submitButton" >
                  Clear
              </button>
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
