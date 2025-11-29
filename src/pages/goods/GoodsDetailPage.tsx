import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  GoodsDetailLayout,
  GoodsDetailInfo,
  GoodsDetailDefaultForm,
  GoodsDetailDatePicker,
  GoodsDetailTimeTable,
  GoodsDetailAgreement,
  GoodsDetailSubmitBar
} from "../../components/goods/detail";

import "../../components/goods/detail/GoodsDetail.css";

export const GoodsDetailPage: React.FC = () => {
  const { lendGroupSeq, lendMhrmlSeq } = useParams();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<HTMLFormElement | null>(null);

  const [title, setTitle] = useState("");
  const [summaryHTML, setSummaryHTML] = useState(""); // 신청대상/담당자/연락처 테이블
  const [guideHTML, setGuideHTML] = useState(""); // 신청 안내

  const [defaultFormHTML, setDefaultFormHTML] = useState("");
  const [timeTable, setTimeTable] = useState("");
  const [agreementHTML, setAgreementHTML] = useState("");

  const [todayInput, setTodayInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      const url = `https://hansung.ac.kr/lend/cncschool/1/${lendGroupSeq}/${lendMhrmlSeq}/lendMhrmlRegistView.do`;

      const response = await fetch(url);
      const html = await response.text();

      const doc = new DOMParser().parseFromString(html, "text/html");
      const fnct = doc.querySelector("._fnctWrap") as HTMLElement;

      if (!fnct) return;

      setForm(fnct.querySelector("form[name='actionForm']") as HTMLFormElement | null);

      const h2 = fnct.querySelector("h2.objHeading_h2");
      setTitle(h2?.textContent?.trim() ?? "");

      const summaryTable = fnct.querySelector(".table_form table");
      setSummaryHTML(summaryTable?.outerHTML ?? "");

      setGuideHTML(extractSection(fnct, "신청안내"));
      setDefaultFormHTML(extractDefaultFormOnly(fnct));

      const table = fnct.querySelector("#lendTimeTable");
      setTimeTable(table?.outerHTML ?? "");

      setAgreementHTML(fnct.querySelector(".wrap_agree")?.outerHTML ?? "");

      setTodayInput(fnct.querySelector("#today") as HTMLInputElement | null);
      setLoading(false);
    };

    load();
  }, [lendGroupSeq, lendMhrmlSeq]);

  if (loading) return <div style={{ padding: 40 }}>불러오는 중...</div>;

  return (
    <GoodsDetailLayout
      sidebar={
        <GoodsDetailInfo
          title={title}
          summaryHTML={summaryHTML}
        />
      }
    >

      {/* 오른쪽 메인 영역 */}

      

      {/* 신청 안내 (오른쪽으로 이동됨) */}
      <section className="goods-section">
        <h3 className="section-title">신청안내</h3>
        <div
          className="goods-info-guide"
          dangerouslySetInnerHTML={{ __html: guideHTML }}
        />
      </section>
      <GoodsDetailDefaultForm html={defaultFormHTML} />

      <GoodsDetailDatePicker todayInput={todayInput} />

      <GoodsDetailTimeTable html={timeTable} />

      <GoodsDetailAgreement html={agreementHTML} />

      <GoodsDetailSubmitBar form={form} />
    </GoodsDetailLayout>
  );
};

/*──── 섹션 추출 함수들 ─────────────────────────────────────────*/

function extractSection(root: HTMLElement, title: string): string {
  const headers = Array.from(root.querySelectorAll("h2.objHeading_h2"));
  const target = headers.find((h2) => h2.textContent?.includes(title));
  if (!target) return "";

  let html = "";
  let next = target.nextElementSibling;

  while (next && next.tagName !== "H2") {
    html += next.outerHTML;
    next = next.nextElementSibling;
  }

  return html;
}

function extractDefaultFormOnly(root: HTMLElement): string {
  const headers = Array.from(root.querySelectorAll("h2.objHeading_h2"));
  const target = headers.find((h2) => h2.textContent?.includes("기본신청서"));
  if (!target) return "";

  let html = "";
  let next = target.nextElementSibling;

  while (next && next.tagName !== "H2") {
    if (next.id === "lendTimeTable" || next.textContent?.includes("예약현황"))
      break;

    html += next.outerHTML;
    next = next.nextElementSibling;
  }

  return html;
}
