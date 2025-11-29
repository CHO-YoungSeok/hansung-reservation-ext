import React, { useEffect, useState } from "react";
import "./GoodsDetail.css";

interface Props {
  html: string;
}

export const GoodsDetailDefaultForm: React.FC<Props> = ({ html }) => {
  const [userName, setUserName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!html) return;

    const doc = new DOMParser().parseFromString(html, "text/html");

    // 🔍 div로 된 정보 읽기 (이름, 학번)
    const innerBlocks = Array.from(doc.querySelectorAll(".wrap_inner"));

    innerBlocks.forEach((block) => {
      const label = block.querySelector("label")?.textContent?.trim();
      const value = block.querySelector("div")?.textContent?.trim();

      if (!label || !value) return;

      if (label.includes("예약자명")) setUserName(value);
      if (label.includes("사번") || label.includes("학번")) setStudentId(value);
    });

    // 🔍 기존 input hidden 값도 같이 읽기 (전화번호, 이메일)
    const inputs = doc.querySelectorAll("input");

    inputs.forEach((input) => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value") ?? "";

      if (name?.includes("telno")) setPhone(value);
      if (name?.includes("email")) setEmail(value);
    });
  }, [html]);

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
      </div>
    </section>
  );
};
