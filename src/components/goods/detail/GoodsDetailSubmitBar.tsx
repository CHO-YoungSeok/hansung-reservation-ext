import React from "react";
import ReactDOM from "react-dom";
import { Navigate } from "react-router-dom";

interface Props {
  form: HTMLFormElement | null;
  navigate: (path: string) => void;
}

export const GoodsDetailSubmitBar: React.FC<Props> = ({ form, navigate }) => {
  React.useEffect(() => {
    console.log("[SubmitBar-MOUNT] 컴포넌트 마운트됨. Form:", form);
    console.log("[SubmitBar-MOUNT] Document.body:", document.body);
  }, [form]);

  const submit = async () => {
    console.log("[SubmitBar-CLICK] 버튼 클릭됨!");

    if (!form) {
      console.error("[SubmitBar-ERROR] form이 null입니다");
      alert("폼 정보를 찾을 수 없습니다.");
      return;
    }

    const action = form.getAttribute("action");
    console.log("[SubmitBar-FORM] action:", action);

    if (!action) {
      console.error("[SubmitBar-ERROR] action이 없습니다");
      alert("예약 요청 URL을 찾을 수 없습니다.");
      return;
    }

    try {
      const formData = new FormData(form);
      const body = new URLSearchParams();
      formData.forEach((v, k) => body.append(k, String(v)));

      console.log("[SubmitBar-REQUEST] 요청 시작:", { action, body: body.toString() });

      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        credentials: "include",
      });

      const text = await res.text();
      console.log("[SubmitBar-RESPONSE] 서버 응답:", text.substring(0, 500));

      if (text.includes("성공") || text.includes("완료")) {
        alert("예약이 완료되었습니다.");
        navigate("/my-list")
      } else {
        alert("예약에 실패했습니다.");
      }
    } catch (err) {
      console.error("[SubmitBar-ERROR] 요청 실패:", err);
      alert("요청 중 오류가 발생했습니다: " + String(err));
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("[SubmitBar-HANDLER] 핸들러 실행!");
    e.preventDefault();
    e.stopPropagation();
    submit();
  };

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    zIndex: 999999999,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(5px)",
    padding: "20px",
    boxShadow: "0 -4px 10px rgba(0,0,0,0.15)",
    pointerEvents: "auto",
  };

  const buttonStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    fontWeight: 600,
    background: "#4B89DC",
    color: "white",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    pointerEvents: "auto",
  };

  // ✔ Portaling: body 최상단에 버튼을 렌더링
  return ReactDOM.createPortal(
    <div className="submit-bar-fixed" style={containerStyle}>
      <button
        type="button"
        className="btn-submit"
        style={buttonStyle}
        onClick={handleButtonClick}
        onMouseDown={(e) => {
          console.log("[SubmitBar-MOUSEDOWN] 마우스 다운!");
        }}
      >
        예약 신청하기
      </button>
    </div>,
    document.body
  );
};
