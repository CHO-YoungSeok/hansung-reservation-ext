import React, { useState } from "react";
import "./GoodsDetail.css";

interface Props {
  guideHTML: string;
  onScrollToForm: () => void;
}

export const GoodsDetailTabs: React.FC<Props> = ({ guideHTML, onScrollToForm }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'form'>('form');

  const handleTabClick = (tab: 'guide' | 'form') => {
    setActiveTab(tab);
    if (tab === 'form') {
      onScrollToForm();
    }
  };

  return (
    <section className="goods-section" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
      {/* Tab Headers */}
      <div className="goods-tabs-header">
        <button
          className={`goods-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => handleTabClick('guide')}
        >
          신청안내
        </button>
        <button
          className={`goods-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => handleTabClick('form')}
        >
          예약 신청서
        </button>
      </div>

      {/* Tab Content - Only show guide content when guide tab is active */}
      {activeTab === 'guide' && (
        <div className="goods-tab-content">
          <div
            className="goods-info-guide"
            dangerouslySetInnerHTML={{ __html: guideHTML }}
          />
        </div>
      )}
    </section>
  );
};
