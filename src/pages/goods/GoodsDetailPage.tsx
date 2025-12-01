import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  GoodsDetailLayout,
  GoodsDetailInfo,
  GoodsDetailDefaultForm,
  GoodsDetailDatePicker,
  GoodsDetailTimeTable,
  GoodsDetailAgreement,
  GoodsDetailSubmitBar,
} from "../../components/goods/detail";
import { getUserInfo } from "../../utils/authUtils";

import "../../components/goods/detail/GoodsDetail.css";

/*──────────────────────────────
  학교 getLendArtcl.do AJAX 호출
──────────────────────────────*/
async function fetchTimeTable(
  siteId: string,
  setupSeq: string,
  groupSeq: string,
  machineSeq: string,
  date: string
) {
  const url = `https://hansung.ac.kr/lend/${siteId}/${setupSeq}/${groupSeq}/${machineSeq}/getLendArtcl.do`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      lendSetupSeq: setupSeq,
      lendGroupSeq: groupSeq,
      lendMhrmlSeq: machineSeq,
      today: date,
    }).toString(),
  });

  return await res.text(); // JSON string
}

export const GoodsDetailPage: React.FC = () => {
  const { lendGroupSeq, lendMhrmlSeq } = useParams();

  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);

  const [form, setForm] = useState<HTMLFormElement | null>(null);
  const [title, setTitle] = useState("");
  const [summaryHTML, setSummaryHTML] = useState("");
  const [guideHTML, setGuideHTML] = useState("");
  const [defaultFormHTML, setDefaultFormHTML] = useState("");
  const [agreementHTML, setAgreementHTML] = useState("");

  const [todayInput, setTodayInput] = useState<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [timeTableData, setTimeTableData] = useState<any>(null);
  const [useHours, setUseHours] = useState<number>(1); // 예상사용시간

  // Get user info
  const userInfo = getUserInfo();

  /*──────────────────────────────
    1) 초기 전체 HTML 로딩
  ──────────────────────────────*/
  useEffect(() => {
    if (!lendGroupSeq || !lendMhrmlSeq) return;

    const load = async () => {
      setLoading(true);

      const url = `https://hansung.ac.kr/lend/cncschool/1/${lendGroupSeq}/${lendMhrmlSeq}/lendMhrmlRegistView.do`;
      const response = await fetch(url);
      const html = await response.text();

      const doc = new DOMParser().parseFromString(html, "text/html");
      


      // 로그인 체크
      if (
        doc.querySelector("#loginView") ||
        doc.querySelector("form[name='loginView']") ||
        doc.querySelector(".hnu_login")
      ) {
        setNeedLogin(true);
        setLoading(false);
        return;
      }

      const fnct = doc.querySelector("._fnctWrap") as HTMLElement;
      // 🔥 학교 원본 버튼 완전 제거
      const oldSubmit = fnct.querySelector("input[type='submit']");
      if (oldSubmit) {
        console.log("🧹 원본 submit 버튼 제거함");
        oldSubmit.remove();
      }

      const oldBtnWrapper = fnct.querySelector(".center.board-button");
      if (oldBtnWrapper) {
        console.log("🧹 원본 버튼 wrapper 제거함 (.center.board-button)");
        oldBtnWrapper.remove();
      }

      const oldBtnWrapper2 = fnct.querySelector(".board-button");
      if (oldBtnWrapper2) {
        console.log("🧹 원본 버튼 wrapper 제거함 (.board-button)");
        oldBtnWrapper2.remove();
      }


      setForm(fnct.querySelector("form[name='actionForm']") as HTMLFormElement);
      setTitle(fnct.querySelector("h2.objHeading_h2")?.textContent?.trim() ?? "");
      setSummaryHTML(fnct.querySelector(".table_form table")?.outerHTML ?? "");
      setGuideHTML(extractSection(fnct, "신청안내"));
      setDefaultFormHTML(extractDefaultFormOnly(fnct));
      setAgreementHTML(fnct.querySelector(".wrap_agree")?.outerHTML ?? "");

      const today = fnct.querySelector("#today") as HTMLInputElement | null;
      setTodayInput(today);

      if (today?.value) setSelectedDate(today.value);

      console.log("[GoodsDetailPage] Form 객체:", fnct.querySelector("form[name='actionForm']"));
      console.log("[GoodsDetailPage] Form action:", fnct.querySelector("form[name='actionForm']")?.getAttribute("action"));

      setLoading(false);
      // 🔥 화면을 가리는 overlay 제거

    };

    load();
  }, [lendGroupSeq, lendMhrmlSeq]);

  /*──────────────────────────────
    2) addItem1 = 예상사용시간 읽어오기
  ──────────────────────────────*/
  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.querySelector("input[name='addItem1']") as HTMLInputElement;
      if (el) {
        const val = parseInt(el.value);
        if (!isNaN(val)) setUseHours(val);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  /*──────────────────────────────
    3) 날짜 변경 시 AJAX 다시 로드
  ──────────────────────────────*/
  useEffect(() => {
    if (!selectedDate) return;

    const load = async () => {
      const jsonStr = await fetchTimeTable(
        "cncschool",
        "1",
        lendGroupSeq!,
        lendMhrmlSeq!,
        selectedDate
      );

      const data = JSON.parse(jsonStr);
      setTimeTableData(data);
    };

    load();
  }, [selectedDate]);
    /*──────────────────────────────
    4) 원본 form을 실제 DOM에 붙이기 (방법 A 핵심)
  ──────────────────────────────*/
  useEffect(() => {
    if (!form) return;

    // 이미 DOM에 붙어 있는지 확인 (중복 방지)
    const existing = document.querySelector("form[name='actionForm']");
    if (!existing) {
      console.log("📌 원본 actionForm을 실제 DOM에 추가했습니다.");
      document.body.appendChild(form);
    }
    const oldBar = document.querySelector(".submit-bar");
    if (oldBar) oldBar.remove();
  }, [form]);


  /*──────────────────────────────*/
  if (loading) return <div style={{ padding: 40 }}>불러오는 중...</div>;

  if (needLogin)
    return (
      <div style={{ padding: 40, fontSize: 20, textAlign: "center" }}>
        🔐 로그인 후 이용해 주세요.
      </div>
    );

  return (
    <GoodsDetailLayout
      sidebar={<GoodsDetailInfo title={title} summaryHTML={summaryHTML} />}
    >
      <section className="goods-section">
        <h3 className="section-title">신청안내</h3>
        <div dangerouslySetInnerHTML={{ __html: guideHTML }} />
      </section>

      <GoodsDetailDefaultForm
        html={defaultFormHTML}
        onUseHoursChange={(h) => setUseHours(h)}
        userInfo={userInfo}
      />

      <GoodsDetailDatePicker
        todayInput={todayInput}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* ★ 핵심: JSON + 선택날짜 + 예상시간 전송 */}
      <GoodsDetailTimeTable
        data={timeTableData}
        selectedDate={selectedDate}
        useHours={useHours}
      />

      <GoodsDetailAgreement html={agreementHTML} />
      <GoodsDetailSubmitBar form={form} />
    </GoodsDetailLayout>
  );
};

/*──────────────────────────────*/
function extractSection(root: HTMLElement, title: string) {
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

function extractDefaultFormOnly(root: HTMLElement) {
  const headers = Array.from(root.querySelectorAll( "h2.objHeading_h2"));
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
