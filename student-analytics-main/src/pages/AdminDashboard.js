import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  getAllStudentsWithQuizData,
  addStudentRecord,
  updateStudentRecord,
  removeStudentRecord
} from "../services/dataService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [loggedInStudents, setLoggedInStudents] = useState([]);

  const updatedStudents = getAllStudentsWithQuizData();

  React.useEffect(() => {
    const loadLoggedIn = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/students/logged-in");
        if (!res.ok) return;
        const data = await res.json();
        setLoggedInStudents(data);
      } catch (e) {
        console.error("Failed to load logged-in students", e);
      }
    };

    loadLoggedIn();
    const interval = setInterval(loadLoggedIn, 10_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const [studentsData, setStudentsData] = useState(getAllStudentsWithQuizData());
  const [editStudentId, setEditStudentId] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: "",
    attendance: "",
    assignmentScores: "",
    subjects: [
      { subject: "Data Structures", marks: "" },
      { subject: "Database Management", marks: "" },
      { subject: "Computer Networks", marks: "" }
    ]
  });

  const refreshStudents = () => {
    setStudentsData(getAllStudentsWithQuizData());
  };

  const totalStudents = studentsData.length;
  const totalAssessments = 12;

  const averages = studentsData.map((student) =>
    student.subjects.reduce((a, b) => a + b.marks, 0) /
    student.subjects.length
  );

  const classAverage =
    (averages.length > 0 ? averages.reduce((a, b) => a + b, 0) / averages.length : 0);

  const subjectAverages =
    studentsData.length > 0
      ? studentsData[0].subjects.map((sub, i) => ({
          subject: sub.subject,
          average:
            studentsData.reduce((acc, student) =>
              acc + (student.subjects[i]?.marks || 0), 0
            ) / studentsData.length
        }))
      : [];


  const topPerformers = studentsData
    .map((student, i) => ({
      name: student.name,
      avg: averages[i] || 0
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  const atRiskStudents = studentsData
    .map((student, i) => {
      const subjectAverage = averages[i] || 0;
      const lowestQuizScore =
        student.quizAttempts && student.quizAttempts.length > 0
          ? Math.min(...student.quizAttempts.map((q) => q.percentage))
          : null;
      return {
        id: student.id,
        name: student.name,
        subjectAvg: subjectAverage,
        attendance: student.attendance || 0,
        quizScore: lowestQuizScore
      };
    })
    .filter(
      (s) =>
        s.subjectAvg < 65 ||
        s.attendance < 75 ||
        (s.quizScore !== null && s.quizScore < 60)
    )
    .map((s) => {
      const quizRisk = s.quizScore !== null && s.quizScore < 60;
      const attendanceRisk = s.attendance < 75;
      let reason = [];
      if (quizRisk) reason.push(`Quiz Score: ${s.quizScore.toFixed(2)}%`);
      if (attendanceRisk) reason.push(`Attendance: ${s.attendance}%`);
      if (!quizRisk && !attendanceRisk)
        reason.push(`Subject Average: ${s.subjectAvg.toFixed(2)}%`);

      return {
        id: s.id,
        name: s.name,
        displayScore: quizRisk ? s.quizScore : s.subjectAvg,
        reason: reason.join(" | "),
        type: quizRisk ? "Quiz" : attendanceRisk ? "Attendance" : "Subject"
      };
    });

  const resetForm = () => {
    setEditStudentId(null);
    setStudentForm({
      name: "",
      attendance: "",
      assignmentScores: "",
      subjects: [
        { subject: "Data Structures", marks: "" },
        { subject: "Database Management", marks: "" },
        { subject: "Computer Networks", marks: "" }
      ]
    });
  };

  const handleFormChange = (field, value) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectMarkChange = (idx, value) => {
    setStudentForm((prev) => {
      const subjects = prev.subjects.map((sub, sidx) =>
        sidx === idx ? { ...sub, marks: value } : sub
      );
      return { ...prev, subjects };
    });
  };

  const handleEditStudent = (student) => {
    setEditStudentId(student.id);
    setStudentForm({
      name: student.name,
      attendance: String(student.attendance || ""),
      assignmentScores: (student.assignmentScores || []).join(", "),
      subjects: student.subjects.map((sub) => ({ ...sub }))
    });
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Confirm delete this student?")) {
      removeStudentRecord(studentId);
      refreshStudents();
    }
  };

  const handleSubmitStudent = (e) => {
    e.preventDefault();

    const normalized = {
      name: studentForm.name.trim(),
      attendance: Number(studentForm.attendance),
      assignmentScores: studentForm.assignmentScores
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((x) => !Number.isNaN(x)),
      subjects: studentForm.subjects.map((sub) => ({
        subject: sub.subject,
        marks: Number(sub.marks)
      }))
    };

    if (!normalized.name) {
      alert("Student name is required");
      return;
    }

    if (editStudentId) {
      updateStudentRecord(editStudentId, normalized);
      alert("Student updated");
    } else {
      addStudentRecord(normalized);
      alert("Student added");
    }

    resetForm();
    refreshStudents();
  };

  const trendData = [
    { month: "Jan", classAvg: 68 },
    { month: "Feb", classAvg: 70 },
    { month: "Mar", classAvg: 72 },
    { month: "Apr", classAvg: 75 },
    { month: "May", classAvg: classAverage }
  ];

  const menuItems = [
    { id: "overview", label: "📊 Overview", icon: "📊" },
    { id: "performance", label: "📈 Performance", icon: "📈" },
    { id: "topPerformers", label: "⭐ Top Performers", icon: "⭐" },
    { id: "atRisk", label: "⚠️ At Risk Students", icon: "⚠️" },
    { id: "subjects", label: "📚 Subject Analysis", icon: "📚" },
    { id: "manage", label: "👥 Manage Students", icon: "👥" },
    { id: "activeStudents", label: "🧑‍🎓 Logged-in Students", icon: "🧑‍🎓" }
  ];

  return (
    <div style={mainContainer}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Teacher Dashboard</h2>
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      <div style={contentWrapper}>
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

        <main style={mainContentStyle}>
          {activeMenu === "overview" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Dashboard Overview</h2>
              <div style={summaryGrid}>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Total Students</p>
                  <p style={summaryValue}>{totalStudents}</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Class Average</p>
                  <p style={summaryValue}>{classAverage.toFixed(2)}%</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>Total Assessments</p>
                  <p style={summaryValue}>{totalAssessments}</p>
                </div>
                <div style={summaryCard}>
                  <p style={summaryLabel}>At Risk Students</p>
                  <p style={{ ...summaryValue, color: "#dc2626" }}>
                    {atRiskStudents.length}
                  </p>
                </div>
              </div>
              <div style={card}>
                <h3 style={cardTitle}>Class Performance Trend</h3>
                <LineChart width={1000} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="classAvg"
                    stroke="#0f766e"
                    strokeWidth={2}
                    name="Class Average"
                  />
                </LineChart>
              </div>
            </div>
          )}

          {activeMenu === "performance" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Student Performance</h2>
              <div style={card}>
                <h3 style={cardTitle}>Individual Student Scores</h3>
                <BarChart width={1000} height={300} data={averages.map((avg, i) => ({
                  name: updatedStudents[i].name,
                  score: avg
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0f766e" name="Average Score" />
                </BarChart>
              </div>
              <div style={card}>
                <h3 style={cardTitle}>Subject-wise Performance</h3>
                <BarChart width={1000} height={300} data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#115e59" name="Subject Average" />
                </BarChart>
              </div>
            </div>
          )}

          {activeMenu === "topPerformers" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Top Performers</h2>
              <div style={card}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableHeaderStyle}>
                      <th style={tableCellStyle}>Rank</th>
                      <th style={tableCellStyle}>Student Name</th>
                      <th style={tableCellStyle}>Average Score</th>
                      <th style={tableCellStyle}>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPerformers.map((student, index) => (
                      <tr key={index} style={tableRowStyle}>
                        <td style={tableCellStyle}>#{index + 1}</td>
                        <td style={tableCellStyle}>{student.name}</td>
                        <td style={tableCellStyle}>
                          {student.avg.toFixed(2)}%
                        </td>
                        <td
                          style={{
                            ...tableCellStyle,
                            color: "#059669",
                            fontWeight: "600"
                          }}
                        >
                          ⭐ Excellent
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "atRisk" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>At Risk Students</h2>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
                Students with quiz scores below 60% or subject average below 65% are marked as at risk.
              </p>
              {atRiskStudents.length === 0 ? (
                <div style={card}>
                  <p style={{ textAlign: "center", color: "#059669", fontWeight: "600" }}>
                    ✓ No students at risk!
                  </p>
                </div>
              ) : (
                <div style={card}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={tableHeaderStyle}>
                        <th style={tableCellStyle}>Student Name</th>
                        <th style={tableCellStyle}>Risk Type</th>
                        <th style={tableCellStyle}>Score</th>
                        <th style={tableCellStyle}>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {atRiskStudents.map((student, index) => (
                        <tr key={index} style={tableRowStyle}>
                          <td style={tableCellStyle}>{student.name}</td>
                          <td style={tableCellStyle}>
                            <span style={{
                              background: student.type === "Quiz" ? "#fee2e2" : "#fef3c7",
                              color: student.type === "Quiz" ? "#dc2626" : "#d97706",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}>
                              {student.type}
                            </span>
                          </td>
                          <td style={{ ...tableCellStyle, color: "#dc2626", fontWeight: "600" }}>
                            {student.displayScore.toFixed(2)}%
                          </td>
                          <td style={tableCellStyle}>{student.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeMenu === "activeStudents" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Recently Logged-in Students</h2>
              <div style={card}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableHeaderStyle}>
                      <th style={tableCellStyle}>Name</th>
                      <th style={tableCellStyle}>Email</th>
                      <th style={tableCellStyle}>Last Login</th>
                      <th style={tableCellStyle}>Attendance</th>
                      <th style={tableCellStyle}>Average</th>
                      <th style={tableCellStyle}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loggedInStudents.map((student) => {
                      const avg = student.subjects && student.subjects.length
                        ? student.subjects.reduce((sum, s) => sum + (s.marks || 0), 0) / student.subjects.length
                        : 0;
                      return (
                        <tr key={student.id} style={tableRowStyle}>
                          <td style={tableCellStyle}>{student.name}</td>
                          <td style={tableCellStyle}>{student.userEmail}</td>
                          <td style={tableCellStyle}>{student.lastLogin ? new Date(student.lastLogin).toLocaleString() : "-"}</td>
                          <td style={tableCellStyle}>{student.attendance ?? 0}%</td>
                          <td style={tableCellStyle}>{avg.toFixed(2)}%</td>
                          <td style={tableCellStyle}>{/* could navigate to student profile */}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "manage" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Manage Students</h2>

              <div style={card}>
                <h3 style={cardTitle}>{editStudentId ? "Edit Student" : "Add Student"}</h3>
                <form onSubmit={handleSubmitStudent}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    <input
                      value={studentForm.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      placeholder="Name"
                      required
                      style={{ padding: "10px" }}
                    />
                    <input
                      type="number"
                      value={studentForm.attendance}
                      onChange={(e) => handleFormChange("attendance", e.target.value)}
                      placeholder="Attendance (%)"
                      min="0"
                      max="100"
                      required
                      style={{ padding: "10px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label>Assignment Scores (comma-separated)</label>
                    <input
                      value={studentForm.assignmentScores}
                      onChange={(e) => handleFormChange("assignmentScores", e.target.value)}
                      placeholder="e.g. 88, 92, 79"
                      style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontWeight: "600" }}>Subject Marks</label>
                    {studentForm.subjects.map((sub, idx) => (
                      <div key={sub.subject} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                        <span style={{ width: "160px" }}>{sub.subject}:</span>
                        <input
                          type="number"
                          value={sub.marks}
                          onChange={(e) => handleSubjectMarkChange(idx, e.target.value)}
                          min="0"
                          max="100"
                          required
                          style={{ padding: "8px", width: "100%" }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "18px" }}>
                    <button type="submit" style={{ ...logoutBtn, background: "#0f766e" }}>
                      {editStudentId ? "Update Student" : "Add Student"}
                    </button>
                    {editStudentId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        style={{ ...logoutBtn, background: "#9ca3af", marginLeft: "10px" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div style={card}>
                <h3 style={cardTitle}>Student Records</h3>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableHeaderStyle}>
                      <th style={tableCellStyle}>Name</th>
                      <th style={tableCellStyle}>Average</th>
                      <th style={tableCellStyle}>Attendance</th>
                      <th style={tableCellStyle}>Assign Scores</th>
                      <th style={tableCellStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData.map((student) => {
                      const avg =
                        student.subjects.reduce((a, b) => a + b.marks, 0) /
                        student.subjects.length;
                      return (
                        <tr key={student.id} style={tableRowStyle}>
                          <td style={tableCellStyle}>{student.name}</td>
                          <td style={tableCellStyle}>{avg.toFixed(2)}%</td>
                          <td style={tableCellStyle}>{student.attendance}%</td>
                          <td style={tableCellStyle}>{(student.assignmentScores || []).join(", ")}</td>
                          <td style={tableCellStyle}>
                            <button
                              onClick={() => handleEditStudent(student)}
                              style={{ marginRight: "10px", padding: "6px 10px", borderRadius: "6px", border: "none", background: "#2563eb", color: "white" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              style={{ padding: "6px 10px", borderRadius: "6px", border: "none", background: "#dc2626", color: "white" }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "subjects" && (
            <div style={sectionContainer}>
              <h2 style={sectionTitle}>Subject Analysis</h2>
              <div style={card}>
                <h3 style={cardTitle}>Subject-wise Class Average</h3>
                <BarChart width={1000} height={300} data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#0f766e" name="Average Score" />
                </BarChart>
              </div>
              <div style={card}>
                <h3 style={cardTitle}>Subject Performance Summary</h3>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableHeaderStyle}>
                      <th style={tableCellStyle}>Subject</th>
                      <th style={tableCellStyle}>Class Average</th>
                      <th style={tableCellStyle}>Performance Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectAverages.map((subject, index) => (
                      <tr key={index} style={tableRowStyle}>
                        <td style={tableCellStyle}>{subject.subject}</td>
                        <td style={tableCellStyle}>
                          {subject.average.toFixed(2)}%
                        </td>
                        <td
                          style={{
                            ...tableCellStyle,
                            color:
                              subject.average >= 75
                                ? "#059669"
                                : subject.average >= 65
                                ? "#d97706"
                                : "#dc2626",
                            fontWeight: "600"
                          }}
                        >
                          {subject.average >= 75
                            ? "Excellent"
                            : subject.average >= 65
                            ? "Good"
                            : "Needs Improvement"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

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

export default AdminDashboard;