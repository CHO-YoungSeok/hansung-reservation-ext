import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import LinkArea from "./LinkArea.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h2>한성대HSU 예약 시스템</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div style={{display: "flex", justifyContent: "center", gap: "10px"}} id="LinkArea-container">
              <LinkArea
                  url="https://learn.hansung.ac.kr/"
                  text="e-class"
                  imgSrc="https://i.namu.wiki/i/cS0GHv6Ougi3uEDW-HkDBfgbtiVpLFyJBn5fO-XN7I47zVx-81-7WSoJtMD9op-gkGI6POqxKTkqe1g5n6e-NQ.webp"
                  alt="HSU e-class"
              />
              <button onClick={() => {
                  // 새로운 것 구현
              }}> + </button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
