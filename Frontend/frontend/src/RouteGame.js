import React, { useState, useEffect } from "react";
import GraphView from "./GraphView";
import "../src/Styles.css";

function RouteGame(){

  // 🎮 STATES
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [level,setLevel] = useState(1);
  const [score,setScore] = useState(0);
  const [time,setTime] = useState(30);
  const [gameOver,setGameOver] = useState(false);

  const [start,setStart] = useState(null);
  const [end,setEnd] = useState(null);
  const [userPath,setUserPath] = useState([]);
  const [result,setResult] = useState(null);
  const [animatedPath,setAnimatedPath] = useState([]);

  const [graphData,setGraphData] = useState(generateGraph(1));

  // 🔊 SOFT SOUND
  const playTone = (freq, duration = 200) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = "sine";

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration/1000);

    osc.start();

    setTimeout(()=>{
      osc.stop();
      ctx.close();
    }, duration);
  };

  const clickSound = () => playTone(500,120);
  const correctSound = () => {
    playTone(600,150);
    setTimeout(()=>playTone(800,150),120);
    setTimeout(()=>playTone(1000,180),240);
  };
  const wrongSound = () => playTone(250,300);
  const startSound = () => {
    playTone(400,120);
    setTimeout(()=>playTone(600,150),100);
  };

  // 🔥 GRAPH GENERATOR
  function generateGraph(level){
    const nodes = 5 + (level - 1) * 2;
    let edges = [];

    for(let i=0;i<nodes-1;i++){
      edges.push([i,i+1,Math.floor(Math.random()*9)+1]);
    }

    for(let i=0;i<nodes;i++){
      for(let j=i+2;j<nodes;j++){
        if(Math.random()>0.6){
          edges.push([i,j,Math.floor(Math.random()*9)+1]);
        }
      }
    }

    return {nodes,edges};
  }

  // 🎯 RANDOM START/END
  const generateStartEnd = (nodes) => {
    let s = Math.floor(Math.random() * nodes);
    let d;

    do {
      d = Math.floor(Math.random() * nodes);
    } while (d === s);

    return { s, d };
  };

  // ⏳ TIMER
  useEffect(()=>{
    if(!isGameStarted || gameOver) return;

    if(time===0){
      wrongSound();
      alert("⏰ Time's up!");
      setGameOver(true);
      return;
    }

    const t=setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);

  },[time,gameOver,isGameStarted]);

  // 🎯 SET START/END ON GAME START OR LEVEL CHANGE
  useEffect(()=>{
    if(isGameStarted){
      const { s, d } = generateStartEnd(graphData.nodes);
      setStart(s);
      setEnd(d);
    }
  },[isGameStarted, graphData]);

  // 🟢 NODE CLICK (ONLY PATH)
  const handleSelect = (node)=>{
    if(gameOver) return;

    clickSound();

    setUserPath(prev=>[...prev,node]);
  };

  // 🔗 FETCH PATH
  const findRoute=async()=>{

    const res=await fetch("http://localhost:8080/route",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        src:start,
        dest:end,
        edges:graphData.edges
      })
    });

    const data=await res.json();

    let safePath = data.path;

    if(typeof safePath === "string"){
      try { safePath = JSON.parse(safePath); }
      catch { safePath = []; }
    }

    if(!Array.isArray(safePath)){
      safePath = Object.values(safePath);
    }

    setResult({ ...data, path: safePath });
    animatePath(safePath);
  };

  // 🎬 ANIMATION
  const animatePath=(path)=>{
    let e=[],i=0;

    const int=setInterval(()=>{
      if(i<path.length-1){
        e.push([path[i],path[i+1]]);
        setAnimatedPath([...e]);
        i++;
      } else clearInterval(int);
    },700);
  };

  // 🎯 SUBMIT
  const submitGuess=()=>{
    if(!result || !Array.isArray(result.path)) return;

    if(JSON.stringify(userPath)===JSON.stringify(result.path)){
      correctSound();
      alert("🎉 Correct!");

      setScore(s=>s+level);
      setLevel(l=>l+1);

      setGraphData(generateGraph(level+1));
      resetRound();

    } else {
      wrongSound();
      alert("❌ Wrong!");
      setGameOver(true);
    }
  };

  // 🔄 RESET
  const resetRound=()=>{
    const { s, d } = generateStartEnd(graphData.nodes);

    setStart(s);
    setEnd(d);
    setUserPath([]);
    setResult(null);
    setAnimatedPath([]);
    setTime(30 - level*2);
  };

  // 🔁 RESTART
  const restartGame=()=>{
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setIsGameStarted(false);
    setGraphData(generateGraph(1));
    resetRound();
  };

  return (
    <div className="container">

      <h1>🎮 Smart Route Game</h1>

      {/* START SCREEN */}
      {!isGameStarted && (
        <div>
          <h2>Welcome 🚀</h2>
          <button onClick={()=>{
            startSound();
            setIsGameStarted(true);
          }}>
            Start Game
          </button>
        </div>
      )}

      {/* GAME SCREEN */}
      {isGameStarted && (
        <>
          <h2>Level: {level}</h2>
          <h2>Score: {score}</h2>
          <h3>⏳ Time: {time}s</h3>

          {gameOver && <h2 style={{color:"red"}}>Game Over</h2>}

          <h3>🎯 Find shortest path from {start} → {end}</h3>

          <p>Your Path: {userPath.join(" → ")}</p>

          <GraphView
            nodes={graphData.nodes}
            edges={graphData.edges}
            onSelect={handleSelect}
            path={result?.path || []}
            animatedPath={animatedPath}
          />

          <div>
            <button onClick={findRoute}>Show Answer</button>
            <button onClick={submitGuess}>Submit Guess</button>
            <button onClick={restartGame}>Restart</button>
          </div>

          {result && Array.isArray(result.path) && (
            <div className="result">
              <p>Correct Path: {result.path.join(" → ")}</p>
              <p>Total Distance: {result.distance}</p>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default RouteGame;