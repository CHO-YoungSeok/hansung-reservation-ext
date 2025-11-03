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
                <LinkArea
                    url="https://www.hansung.ac.kr/onestop/8952/subview.do"
                    text="상상베이스 세미나실 예약"
                    imgSrc="https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/ad5c5ae9-176f-57a1-97fd-20afcb32a355/8f037b8a-487e-5bc4-8aef-95264a468c03.jpg"
                    alt="HSU 상상베이스 세미나실 예약"
                />
                <LinkArea
                    url="https://hansung.ac.kr/cncschool/7309/subview.do"
                    text="기자재 대여"
                    imgSrc="https://hansung.ac.kr/sites/cncschool/images/%EC%9E%A5%EB%B9%84%20%EC%9D%B4%EB%AF%B8%EC%A7%80/K1%20MAX.png"
                    alt="HSU 기자재 대여"
                />
              <button onClick={() => {
                  // 새로운 것 추가 or 새로운 페이지 추가
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
