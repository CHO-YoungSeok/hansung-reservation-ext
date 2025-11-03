import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import BtnLink from './BtnLink.jsx'
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
          <div style={{display: "flex", justifyContent: "center", gap: "10px"}} id="BtnLink-container">
              <BtnLink
                  url="https://learn.hansung.ac.kr/"
                  text="e-class"
                  imgSrc="https://i.namu.wiki/i/cS0GHv6Ougi3uEDW-HkDBfgbtiVpLFyJBn5fO-XN7I47zVx-81-7WSoJtMD9op-gkGI6POqxKTkqe1g5n6e-NQ.webp"
                  alt="HSU e-class"
              />
              <button onClick={() => {
                  const btn_container = document.getElementById("BtnLink-container");
              }}> + </button>
          </div>
        <p>
            <a href="https://github.com/CHO-YoungSeok/hansung-reservation-ext">
                <code>gitHub/hansung-reservation-ext</code>
            </a>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
