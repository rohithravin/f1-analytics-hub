// src/components/ScheduleViewer.tsx
import { useState, useEffect } from "react";
import { getSchedule } from "../api/f1Service";

interface RoundBase {
  RoundNumber: number;
  Country: string;
  Location: string;
  OfficialEventName: string;
  EventName: string;
  EventDate: string;
  GP: string;
  GPDateUtc: string;
}

interface RoundInfo extends RoundBase {
  EventFormat: "Conventional";
  FP1: string;
  FP1DateUtc: string;
  FP2: string;
  FP2DateUtc: string;
  FP3: string;
  FP3DateUtc: string;
  Quali: string;
  QualiDateUtc: string;
}

interface RoundSprintInfo extends RoundBase {
  EventFormat: "Sprint Qualifying";
  FP1: string;
  FP1DateUtc: string;
  SprintQuali: string;
  SprintQualiDateUtc: string;
  Sprint: string;
  SprintDateUtc: string;
  Quali: string;
  QualiDateUtc: string;
}

interface RoundSprintShootoutInfo extends RoundBase {
  EventFormat: "Sprint Shootout";
  FP1: string;
  FP1DateUtc: string;
  Quali: string;
  QualiDateUtc: string;
  FP2: string;
  FP2DateUtc: string;
  Sprint: string;
  SprintDateUtc: string;
}

type Round = RoundInfo | RoundSprintInfo | RoundSprintShootoutInfo;

interface SeasonSchedule {
  year: number;
  rounds: Round[];
}

export default function ScheduleViewer({ selectedYear }: { selectedYear: number }) {
  const [schedule, setSchedule] = useState<SeasonSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const toggleRound = (roundNumber: number) => {
    setExpandedRound(expandedRound === roundNumber ? null : roundNumber);
  };

  const fetchSchedule = async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSchedule(year);
      setSchedule(data);
    } catch (err) {
      setError("Failed to fetch schedule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(selectedYear);
  }, [selectedYear]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) {
      return "CANCELLED";
    }
    // FastF1 returns UTC times without the 'Z' suffix, so we need to append it
    // to ensure JavaScript parses it as UTC before converting to local time
    const utcDateStr = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
    return new Date(utcDateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={containerStyle}>
      {loading && (
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>Loading schedule...</p>
        </div>
      )}
      {error && <p style={errorStyle}>{error}</p>}

      {schedule && !loading && (
        <div style={cardsContainerStyle}>
          {schedule.rounds.map((round) => {
            const isExpanded = expandedRound === round.RoundNumber;
            return (
              <div
                key={round.RoundNumber}
                style={{
                  ...cardStyle,
                  ...(isExpanded ? expandedCardStyle : {}),
                }}
              >
                <div
                  style={cardHeaderStyle}
                  onClick={() => toggleRound(round.RoundNumber)}
                >
                  <div style={cardMainInfoStyle}>
                    <div style={roundInfoContainerStyle}>
                      <span style={roundBadgeStyle}>{round.RoundNumber}</span>
                      <div style={locationInfoStyle}>
                        <h3 style={countryNameStyle}>{round.Country}</h3>
                        <p style={locationNameStyle}>{round.Location}</p>
                      </div>
                    </div>
                    <div style={raceInfoContainerStyle}>
                      <h4 style={raceNameStyle}>{round.OfficialEventName}</h4>
                      <p style={raceDateStyle}>
                        {new Date(round.EventDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      style={
                        round.EventFormat === "Sprint Qualifying" || round.EventFormat === "Sprint Shootout"
                          ? sprintBadgeStyle
                          : conventionalBadgeStyle
                      }
                    >
                      {round.EventFormat}
                    </span>
                  </div>
                  <button style={expandButtonStyle}>
                    {isExpanded ? "−" : "+"}
                  </button>
                </div>

                {isExpanded && (
                  <div style={cardContentStyle}>
                    <div style={sessionsGridStyle}>
                      {round.EventFormat === "Conventional" ? (
                        <>
                          <SessionCard
                            label="Practice 1"
                            time={formatDate(round.FP1DateUtc)}
                          />
                          <SessionCard
                            label="Practice 2"
                            time={formatDate(round.FP2DateUtc)}
                          />
                          <SessionCard
                            label="Practice 3"
                            time={formatDate(round.FP3DateUtc)}
                          />
                          <SessionCard
                            label="Qualifying"
                            time={formatDate(round.QualiDateUtc)}
                            isImportant
                          />
                          <SessionCard
                            label="Race"
                            time={formatDate(round.GPDateUtc)}
                            isRace
                          />
                        </>
                      ) : round.EventFormat === "Sprint Qualifying" ? (
                        <>
                          <SessionCard
                            label="Practice 1"
                            time={formatDate(round.FP1DateUtc)}
                          />
                          <SessionCard
                            label="Sprint Qualifying"
                            time={formatDate(round.SprintQualiDateUtc)}
                            isImportant
                          />
                          <SessionCard
                            label="Sprint Race"
                            time={formatDate(round.SprintDateUtc)}
                            isImportant
                          />
                          <SessionCard
                            label="Qualifying"
                            time={formatDate(round.QualiDateUtc)}
                            isImportant
                          />
                          <SessionCard
                            label="Race"
                            time={formatDate(round.GPDateUtc)}
                            isRace
                          />
                        </>
                      ) : (
                        <>
                          <SessionCard
                            label="Practice 1"
                            time={formatDate(round.FP1DateUtc)}
                          />
                          <SessionCard
                            label="Qualifying"
                            time={formatDate(round.QualiDateUtc)}
                            isImportant
                          />
                          <SessionCard
                            label="Practice 2"
                            time={formatDate(round.FP2DateUtc)}
                          />
                          <SessionCard
                            label="Sprint Race"
                            time={formatDate(round.SprintDateUtc)}
                            isImportant
                          />
                          <SessionCard
                            label="Race"
                            time={formatDate(round.GPDateUtc)}
                            isRace
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SessionCard = ({
  label,
  time,
  isImportant = false,
  isRace = false,
}: {
  label: string;
  time: string;
  isImportant?: boolean;
  isRace?: boolean;
}) => (
  <div
    style={{
      ...sessionCardStyle,
      ...(isRace ? raceSessionCardStyle : {}),
      ...(isImportant && !isRace ? importantSessionCardStyle : {}),
    }}
  >
    <div style={sessionCardLabelStyle}>{label}</div>
    <div style={sessionCardTimeStyle}>{time}</div>
  </div>
);

const containerStyle: React.CSSProperties = {
  padding: "40px",
  maxWidth: "100%",
  width: "100%",
  margin: "0 auto",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
  boxSizing: "border-box",
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  color: "#666",
};

const spinnerStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #e10600",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: "16px",
};

const errorStyle: React.CSSProperties = {
  color: "#e10600",
  backgroundColor: "#ffebee",
  padding: "16px",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: "600",
};

const cardsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
};

const expandedCardStyle: React.CSSProperties = {
  transform: "translateY(-2px)",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(225, 6, 0, 0.1)",
};

const cardHeaderStyle: React.CSSProperties = {
  padding: "28px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.3s ease",
  background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)",
  gap: "20px",
};

const cardMainInfoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  flex: 1,
  minWidth: 0,
};

const roundInfoContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  minWidth: "200px",
};

const raceInfoContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: 1,
  minWidth: "250px",
  justifyContent: "center",
};

const raceNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "600",
  color: "#1d1d1f",
  letterSpacing: "-0.2px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const raceDateStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "#86868b",
  fontWeight: "500",
};

const locationInfoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const countryNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "600",
  color: "#1d1d1f",
  letterSpacing: "-0.5px",
};

const locationNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "15px",
  color: "#86868b",
  fontWeight: "500",
};

const expandButtonStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "2px solid rgba(225, 6, 0, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  color: "#e10600",
  fontSize: "24px",
  fontWeight: "300",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  flexShrink: 0,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};

const cardContentStyle: React.CSSProperties = {
  padding: "24px 28px 28px 28px",
  borderTop: "1px solid rgba(0, 0, 0, 0.06)",
  animation: "slideDown 0.3s ease",
  background: "rgba(255, 255, 255, 0.3)",
};

const sessionsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const sessionCardStyle: React.CSSProperties = {
  backgroundColor: "rgba(245, 245, 247, 0.6)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const importantSessionCardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 248, 225, 0.8)",
  border: "1.5px solid rgba(255, 193, 7, 0.4)",
  boxShadow: "0 4px 12px rgba(255, 193, 7, 0.15)",
};

const raceSessionCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255, 235, 238, 0.95) 0%, rgba(255, 245, 245, 0.95) 100%)",
  border: "2px solid rgba(225, 6, 0, 0.3)",
  boxShadow: "0 4px 16px rgba(225, 6, 0, 0.2)",
};

const sessionCardLabelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#1d1d1f",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const sessionCardTimeStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6e6e73",
  fontWeight: "500",
};

const roundBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #e10600 0%, #ff1744 100%)",
  color: "white",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  fontWeight: "700",
  fontSize: "17px",
  flexShrink: 0,
  boxShadow: "0 4px 12px rgba(225, 6, 0, 0.3)",
};

const conventionalBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "linear-gradient(135deg, #34c759 0%, #30d158 100%)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "24px",
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: "0.3px",
  marginRight: "16px",
  boxShadow: "0 2px 8px rgba(52, 199, 89, 0.25)",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const sprintBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "linear-gradient(135deg, #ff9500 0%, #ff9f0a 100%)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "24px",
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: "0.3px",
  marginRight: "16px",
  boxShadow: "0 2px 8px rgba(255, 149, 0, 0.25)",
  whiteSpace: "nowrap",
  flexShrink: 0,
};
