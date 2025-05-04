import React, { useEffect, useState } from "react";

const barStyle = {
  position: "fixed",
  left: 0,
  width: "100%",
  zIndex: 50,
  background: "#fff",
  borderTop: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "18px 24px",
  minHeight: "64px",
  transition: "bottom 0.3s",
  bottom: 0
};

const barCollapsedStyle = {
  ...barStyle,
  bottom: "-56px"
};

const countStyle = {
  flex: 1,
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.25rem",
  color: "#232a36",
  letterSpacing: "-0.5px"
};

const btnStyle = {
  background: "#fff",
  border: "1px solid #d1d5db",
  color: "#232a36",
  padding: "11px 32px",
  borderRadius: "8px",
  marginRight: "12px",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.03)",
  cursor: "pointer",
  transition: "background 0.18s"
};

const btnStyleHover = {
  ...btnStyle,
  background: "#f3f4f6"
};

const compareBtnStyle = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "11px 32px",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.03)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "background 0.18s"
};

const compareBtnStyleHover = {
  ...compareBtnStyle,
  background: "#b71c1c"
};

const arrowBtnStyle = {
  background: "#3B4252",
  border: "none",
  outline: "none",
  cursor: "pointer",
  width: "44px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9999px",
  marginLeft: "18px",
  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.08)",
  transition: "background 0.15s"
};

const arrowIconStyle = {
  display: "inline-block",
  transition: "transform 0.3s"
};

export default function CompareBar({ onCompare }) {
  const [compareList, setCompareList] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [clearHover, setClearHover] = useState(false);
  const [compareHover, setCompareHover] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("compareList")) || [];
    setCompareList(stored);

    const handler = () =>
      setCompareList(JSON.parse(localStorage.getItem("compareList")) || []);
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const clearAll = () => {
    localStorage.removeItem("compareList");
    setCompareList([]);
  };

  if (compareList.length === 0) return null;

  return (
    <div style={collapsed ? barCollapsedStyle : barStyle}>
      {!collapsed && (
        <>
          <div style={countStyle}>
            Compare product ({compareList.length})
          </div>
          <button
            style={clearHover ? btnStyleHover : btnStyle}
            onMouseEnter={() => setClearHover(true)}
            onMouseLeave={() => setClearHover(false)}
            onClick={clearAll}
          >
            Clear All
          </button>
          <button
            style={compareHover ? compareBtnStyleHover : compareBtnStyle}
            onMouseEnter={() => setCompareHover(true)}
            onMouseLeave={() => setCompareHover(false)}
            onClick={onCompare}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 00-1 1v14a1 1 0 002 0V3a1 1 0 00-1-1zm8 4a1 1 0 00-1 1v10a1 1 0 002 0V7a1 1 0 00-1-1zm-4 4a1 1 0 00-1 1v6a1 1 0 002 0v-6a1 1 0 00-1-1z"/>
            </svg>
            Compare
          </button>
        </>
      )}
      <button
        style={arrowBtnStyle}
        aria-label={collapsed ? "Expand" : "Collapse"}
        onClick={() => setCollapsed((v) => !v)}
      >
        <span
          style={{
            ...arrowIconStyle,
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)"
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#3B4252"/>
            <path d="M9 17l5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </div>
  );
}
