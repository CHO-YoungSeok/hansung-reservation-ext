import React, { useEffect, useState } from "react";
import "./GoodsDetail.css";

interface Props {
  html: string;
  onUseHoursChange?: (hours: number) => void;   // 🔥 추가 (부모에게 전달)
}

export const GoodsDetailDefaultForm: React.FC<Props> = ({ html, onUseHoursChange }) => {
  const [userName, setUserName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [useHours, setUseHours] = useState<number>(1);   // 🔥 추가

  useEffect(() => {
    if (!html) return;

    const doc = new DOMParser().parseFromString(html, "text/html");

    const innerBlocks = Array.from(doc.querySelectorAll(".wrap_inner"));

    innerBlocks.forEach((block) => {
      const label = block.querySelector("label")?.textContent?.trim();
      const value = block.querySelector("div")?.textContent?.trim();

      if (!label || !value) return;

      if (label.includes("예약자명")) setUserName(value);
      if (label.includes("사번") || label.includes("학번")) setStudentId(value);
    });

    // input 값 읽기
    const inputs = doc.querySelectorAll("input");

    inputs.forEach((input) => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value") ?? "";

      if (name?.includes("telno")) setPhone(value);
      if (name?.includes("email")) setEmail(value);

      // 🔥 학교 HTML의 예상사용시간: name="addItem1"
      if (name === "addItem1") {
        setUseHours(parseInt(value) || 1);
      }
    });
  }, [html]);

  // 🔥 예상시간 바뀌면 부모에게 전달
  useEffect(() => {
    if (onUseHoursChange) onUseHoursChange(useHours);
  }, [useHours]);

  return (
    <section className="goods-section">
      <h3 className="section-title">기본 신청서</h3>

      <div className="default-form-grid">
        <div className="default-form-field">
          <label className="default-form-label">
            신청자 <span className="required">*</span>
          </label>
          <input readOnly className="default-form-input readonly" value={userName} />
        </div>

        <div className="default-form-field">
          <label className="default-form-label">
            학번(사번) <span className="required">*</span>
          </label>
          <input readOnly className="default-form-input readonly" value={studentId} />
        </div>

        <div className="default-form-field">
          <label className="default-form-label">
            휴대전화번호 <span className="required">*</span>
          </label>
          <input className="default-form-input" defaultValue={phone} />
        </div>

        <div className="default-form-field">
          <label className="default-form-label">이메일</label>
          <input className="default-form-input" defaultValue={email} />
        </div>

        {/* ⭐⭐⭐ 추가된 예상사용시간 입력폼 ⭐⭐⭐ */}
        <div className="default-form-field">
          <label className="default-form-label">
            필수! 예상사용시간 <span className="required">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={24}
            className="default-form-input"
            value={useHours}
            onChange={(e) => setUseHours(parseInt(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
};
