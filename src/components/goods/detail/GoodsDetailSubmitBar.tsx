import React from "react";

interface Props {
  form: HTMLFormElement | null;
}

export const GoodsDetailSubmitBar: React.FC<Props> = ({ form }) => {
  const submit = () => {
    if (!form) return alert("폼 정보를 찾을 수 없습니다.");

    form.submit();
  };

  return (
    <div className="submit-bar">
      <button className="btn-submit" onClick={submit}>
        예약 신청하기
      </button>
    </div>
  );
};
