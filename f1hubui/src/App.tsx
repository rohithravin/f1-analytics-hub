// src/App.tsx
import { useState, useRef, useEffect } from "react";
import ScheduleViewer from "./components/ScheduleViewer";

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const years = Array.from({ length: currentYear - 2018 + 1 }, (_, i) => currentYear - i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  return (
    <div style={appContainerStyle}>
      <nav style={navStyle}>
        <div style={navContentStyle}>
          <div style={logoContainerStyle}>
            <span style={logoEmojiStyle}>🏎️</span>
            <span style={logoTextStyle}>F1 Analytics Hub</span>
          </div>
          <div style={navLinksStyle}>
            <a href="#schedule" style={navLinkStyle}>
              Schedule
            </a>
            <a href="#analytics" style={navLinkInactiveStyle}>
              Analytics
            </a>
            <a href="#live" style={navLinkInactiveStyle}>
              Live
            </a>
            <div style={yearSelectorStyle} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={selectButtonStyle}
              >
                {selectedYear}
              </button>
              {isDropdownOpen && (
                <div style={dropdownMenuStyle}>
                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      style={{
                        ...dropdownItemStyle,
                        ...(year === selectedYear ? selectedItemStyle : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (year !== selectedYear) {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (year !== selectedYear) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main style={mainContentStyle}>
        <ScheduleViewer selectedYear={selectedYear} />
      </main>
      <footer style={footerStyle}>
        <p style={footerTextStyle}>
          F1 Analytics Hub • Built with FastAPI & React
        </p>
      </footer>
    </div>
  );
}

const appContainerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f5f5f7",
  display: "flex",
  flexDirection: "column",
};

const navStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  padding: "12px 0",
};

const navContentStyle: React.CSSProperties = {
  width: "100%",
  margin: "0 auto",
  padding: "0 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
};

const logoContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoEmojiStyle: React.CSSProperties = {
  fontSize: "28px",
  lineHeight: 1,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  background: "linear-gradient(135deg, #e10600 0%, #ff4444 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.5px",
};

const navLinksStyle: React.CSSProperties = {
  display: "flex",
  gap: "32px",
  alignItems: "center",
};

const navLinkStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1d1d1f",
  textDecoration: "none",
  transition: "color 0.2s ease",
  cursor: "pointer",
  position: "relative",
};

const navLinkInactiveStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "500",
  color: "#6e6e73",
  textDecoration: "none",
  transition: "color 0.2s ease",
  cursor: "pointer",
  opacity: 0.7,
};

const mainContentStyle: React.CSSProperties = {
  flex: 1,
  width: "100%",
  boxSizing: "border-box",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  padding: "20px 0",
  textAlign: "center",
};

const footerTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: "#6e6e73",
  fontWeight: "400",
};

const yearSelectorStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  position: "relative",
};

const selectButtonStyle: React.CSSProperties = {
  padding: "10px 36px 10px 16px",
  fontSize: "15px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  borderRadius: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "#1d1d1f",
  cursor: "pointer",
  fontWeight: "600",
  outline: "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
  position: "relative",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231d1d1f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

const dropdownMenuStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  minWidth: "120px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "12px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
  padding: "8px",
  zIndex: 1001,
  maxHeight: "320px",
  overflowY: "auto",
};

const dropdownItemStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: "15px",
  fontWeight: "600",
  color: "#1d1d1f",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  userSelect: "none",
};

const selectedItemStyle: React.CSSProperties = {
  backgroundColor: "rgba(225, 6, 0, 0.1)",
  color: "#e10600",
};

export default App;
