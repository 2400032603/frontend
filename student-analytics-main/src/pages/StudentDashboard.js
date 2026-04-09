import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { students, assessments, getCurrentStudent, getAllStudentsWithQuizData } from "../services/dataService";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip,
  CartesianGrid, Legend
} from "recharts";

function StudentDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentStudent();
  const allStudents = getAllStudentsWithQuizData();

  const student =
    allStudents.find((s) => s.name === currentUser?.name) || students[0];

  const [activeMenu, setActiveMenu] = useState("overview");

  const totalSubjects = student.subjects.length;
  const totalAssessments = 12;

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const average =
    student.subjects.reduce((a, b) => a + b.marks, 0) /
    totalSubjects;

  const grade =
    average >= 85 ? "A" :
    average >= 75 ? "B" :
    average >= 65 ? "C" : "D";

  const classAverage =
    allStudents.length > 0
      ? allStudents.reduce((acc, s) => {
          const avgGiven =
            s.subjects.reduce((a, b) => a + b.marks, 0) / s.subjects.length;
          return acc + avgGiven;
        }, 0) / allStudents.length
      : 0;

  const weakSubjects = student.subjects
    .filter((sub) => sub.marks < 75)
    .sort((a, b) => a.marks - b.marks);

  const recommendations = weakSubjects.length > 0
    ? weakSubjects.map((sub) => `Improve ${sub.subject} (currently ${sub.marks}%)`) 
    : ["Keep up the excellent progress across all subjects!"];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const trendData = [
    { month: "Jan", score: 70 },
    { month: "Feb", score: 74 },
    { month: "Mar", score: 78 },
    { month: "Apr", score: 82 },
    { month: "May", score: average }
  ];

  const comparisonData = [
    { name: "You", value: average },
    { name: "Class Avg", value: classAverage.toFixed(2) }
  ];

  // Only show Data Structures and Computer Networks quizzes
  const upcomingQuizzes = assessments.filter(
    (quiz) =>
      quiz.subject === "Data Structures" ||
      quiz.subject === "Computer Networks"
  );

  const menuItems = [
    { id: "overview", label: "📊 Academic Overview", icon: "📊" },
    { id: "performance", label: "📈 Performance", icon: "📈" },
    { id: "assessments", label: "✅ Assessments", icon: "✅" },
    { id: "recommendations", label: "💡 Recommendations", icon: "💡" },
    { id: "quizzes", label: "❓ Upcoming Quizzes", icon: "❓" }
  ];

  return (
    <div style={mainContainer}>
      {/* HEADER */}
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Student Dashboard</h2>
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      <div style={contentWrapper}>
        {/* SIDEBAR */}
        <aside style={sidebarStyle}>
          <div style={sidebarHeader}>
            <h3 style={{ margin: 0, color: "white" }}>Menu</h3>
          </div>
          <nav style={navStyle}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                style={{
                  ...menuItem,
                  ...(activeMenu === item.id ? menuItemActive : {})
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main style={mainContentStyle}>
          {/* ACADEMIC OVERVIEW */}
          {activeMenu === "overview" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Academic Overview</h2>
              <div style={summaryGrid}>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Average Score</p>
                  <p style={summaryValue}>{average.toFixed(2)}%</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Current Grade</p>
                  <p style={summaryValue}>{grade}</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Total Subjects</p>
                  <p style={summaryValue}>{totalSubjects}</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Assessments</p>
                  <p style={summaryValue}>{totalAssessments}</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Attendance</p>
                  <p style={summaryValue}>{student.attendance || 0}%</p>
                </div>
              </div>
            </div>
          )}

          {/* PERFORMANCE */}
          {activeMenu === "performance" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Performance Analysis</h2>
              
              <div style={card}>
                <h3 style={cardTitle}>Performance Trend</h3>
                <LineChart width={900} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#0f766e" strokeWidth={2} />
                </LineChart>
              </div>

              <div style={card}>
                <h3 style={cardTitle}>Subject Performance</h3>
                <BarChart width={900} height={300} data={student.subjects}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marks" fill="#0f766e" />
                </BarChart>
              </div>

              <div style={card}>
                <h3 style={cardTitle}>Subject Weaknesses</h3>
                {weakSubjects.length ? (
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#dc2626" }}>
                    {weakSubjects.map((sub) => (
                      <li key={sub.subject}>
                        {sub.subject} - {sub.marks}% (focus required)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: "#059669" }}>
                    No weak subjects detected. Keep it up!
                  </p>
                )}
              </div>
              <div style={card}>
                <h3 style={cardTitle}>Your Performance vs Class Average</h3>
                <BarChart width={600} height={300} data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#115e59" />
                </BarChart>
              </div>
            </div>
          )}

          {/* ASSESSMENTS */}
          {activeMenu === "assessments" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Recent Assessments</h2>
              <div style={card}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableHeaderStyle}>
                      <th style={tableCellStyle}>Assessment</th>
                      <th style={tableCellStyle}>Score</th>
                      <th style={tableCellStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={tableRowStyle}>
                      <td style={tableCellStyle}>Data Structures Midterm</td>
                      <td style={tableCellStyle}>85%</td>
                      <td style={{ ...tableCellStyle, color: "#059669" }}>Completed</td>
                    </tr>
                    <tr style={tableRowStyle}>
                      <td style={tableCellStyle}>Computer Networks Quiz</td>
                      <td style={tableCellStyle}>78%</td>
                      <td style={{ ...tableCellStyle, color: "#059669" }}>Completed</td>
                    </tr>
                    <tr style={tableRowStyle}>
                      <td style={tableCellStyle}>Operating Systems Assignment</td>
                      <td style={tableCellStyle}>88%</td>
                      <td style={{ ...tableCellStyle, color: "#059669" }}>Completed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RECOMMENDATIONS */}
          {activeMenu === "recommendations" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Personalized Recommendations</h2>
              <div style={recommendationGrid}>
                {recommendations.map((item, idx) => (
                  <div key={idx} style={recommendationCard}>
                    <p style={recommendationIcon}>💡</p>
                    <h4 style={recommendationTitle}>Recommendation {idx + 1}</h4>
                    <p style={recommendationText}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUIZZES */}
          {activeMenu === "quizzes" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Upcoming Quizzes</h2>
              <div style={quizzesGrid}>
                {upcomingQuizzes.map((quiz) => (
                  <div key={quiz.id} style={quizCard}>
                    <h4 style={quizTitle}>{quiz.name}</h4>
                    <div style={quizDetails}>
                      <p><strong>Subject:</strong> {quiz.subject}</p>
                      <p><strong>Questions:</strong> {quiz.questions.length}</p>
                    </div>
                    <button
                      style={startBtn}
                      onClick={() =>
                        navigate("/quiz", { state: { quizId: quiz.id } })
                      }
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* STYLES */
const mainContainer = {
  background: "#f1f5f9",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column"
};

const headerStyle = {
  background: "white",
  padding: "20px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderBottom: "3px solid #0f766e"
};

const contentWrapper = {
  display: "flex",
  flex: 1,
  overflow: "hidden"
};

const sidebarStyle = {
  width: "250px",
  background: "#0f766e",
  color: "white",
  padding: "0",
  boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  overflowY: "auto"
};

const sidebarHeader = {
  background: "#064e47",
  padding: "20px",
  borderBottom: "2px solid #115e59"
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "20px 0"
};

const menuItem = {
  background: "none",
  border: "none",
  color: "white",
  padding: "15px 20px",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  borderLeft: "4px solid transparent"
};

const menuItemActive = {
  background: "#115e59",
  borderLeft: "4px solid #fbbf24",
  fontWeight: "600"
};

const mainContentStyle = {
  flex: 1,
  padding: "40px",
  overflowY: "auto",
  background: "#f1f5f9"
};

const sectionContainer = {
  animation: "fadeIn 0.3s ease"
};

const sectionTitle = {
  fontSize: "28px",
  color: "#0f766e",
  marginBottom: "30px",
  fontWeight: "700"
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "30px"
};

const summaryCard = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  border: "2px solid #0f766e",
  textAlign: "center"
};

const summaryLabel = {
  margin: "0 0 10px 0",
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500"
};

const summaryValue = {
  margin: "0",
  color: "#0f766e",
  fontSize: "32px",
  fontWeight: "700"
};

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const cardTitle = {
  margin: "0 0 20px 0",
  color: "#0f766e",
  fontSize: "18px",
  fontWeight: "600"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const tableHeaderStyle = {
  background: "#0f766e",
  color: "white"
};

const tableRowStyle = {
  borderBottom: "1px solid #e5e7eb"
};

const tableCellStyle = {
  padding: "12px 15px",
  textAlign: "left",
  fontSize: "14px"
};

const recommendationGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px"
};

const recommendationCard = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  textAlign: "center",
  border: "2px solid #e5e7eb",
  transition: "transform 0.3s ease"
};

const recommendationIcon = {
  fontSize: "40px",
  margin: "0 0 15px 0"
};

const recommendationTitle = {
  margin: "0 0 10px 0",
  color: "#0f766e",
  fontSize: "16px",
  fontWeight: "600"
};

const recommendationText = {
  margin: "0",
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "1.6"
};

const quizzesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "25px"
};

const quizCard = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  border: "2px solid #115e59"
};

const quizTitle = {
  margin: "0 0 15px 0",
  color: "#0f766e",
  fontSize: "18px",
  fontWeight: "600"
};

const quizDetails = {
  background: "#f0f9ff",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "15px"
};

const startBtn = {
  width: "100%",
  background: "#0f766e",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background 0.3s ease"
};

const logoutBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background 0.3s ease"
};

export default StudentDashboard;