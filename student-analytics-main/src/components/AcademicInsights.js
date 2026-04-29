import React, { useState } from "react";

function AcademicInsights({ student, allStudents }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Calculate various metrics
  const totalSubjects = student.subjects.length;
  const average = totalSubjects > 0
    ? student.subjects.reduce((a, b) => a + b.marks, 0) / totalSubjects
    : 0;

  const weakSubjects = student.subjects
    .filter((sub) => sub.marks < 75)
    .sort((a, b) => a.marks - b.marks);

  const strongSubjects = student.subjects
    .filter((sub) => sub.marks >= 80)
    .sort((a, b) => b.marks - a.marks);

  const classAverage = allStudents.length > 0
    ? allStudents.reduce((acc, s) => {
        const avgGiven =
          s.subjects.reduce((a, b) => a + b.marks, 0) / s.subjects.length;
        return acc + avgGiven;
      }, 0) / allStudents.length
    : 0;

  const percentile = ((average / (classAverage || 1)) * 100).toFixed(0);

  // Generate personalized recommendations
  const generateRecommendations = () => {
    const recs = [];

    // Academic Performance
    if (average >= 85) {
      recs.push({
        type: "Excellence",
        priority: "high",
        icon: "🌟",
        title: "Outstanding Performance",
        description: `Your average score of ${average.toFixed(1)}% demonstrates exceptional academic excellence. Continue this momentum and consider pursuing advanced topics in your strong areas.`,
        action: "Explore advanced coursework in your areas of strength"
      });
    } else if (average >= 75) {
      recs.push({
        type: "Good",
        priority: "medium",
        icon: "✅",
        title: "Solid Academic Standing",
        description: `Your average of ${average.toFixed(1)}% shows good progress. Focus on targeted improvements in weaker areas to elevate your overall performance.`,
        action: "Create a study plan for improving weaker subjects"
      });
    } else {
      recs.push({
        type: "Improvement",
        priority: "high",
        icon: "⚠️",
        title: "Academic Support Needed",
        description: `Your current average of ${average.toFixed(1)}% indicates a need for immediate intervention. Seek tutoring or form study groups to improve your performance.`,
        action: "Schedule a consultation with your academic advisor"
      });
    }

    // Weak Subjects
    if (weakSubjects.length > 0) {
      const weakList = weakSubjects.map((s) => s.subject).join(", ");
      recs.push({
        type: "Weak Areas",
        priority: "high",
        icon: "📉",
        title: `Focus on: ${weakList}`,
        description: `Your performance in ${weakList} (${weakSubjects[0].marks}%-${weakSubjects[weakSubjects.length - 1].marks}%) requires immediate attention. Consider intensive study sessions and seek additional resources.`,
        action: "Schedule extra tutoring or study groups for these subjects"
      });
    }

    // Strong Subjects
    if (strongSubjects.length > 0) {
      recs.push({
        type: "Strengths",
        priority: "low",
        icon: "🏆",
        title: `Excel in: ${strongSubjects[0].subject}`,
        description: `You're performing exceptionally in ${strongSubjects.map((s) => s.subject).join(", ")}. Consider mentoring peers in these areas to reinforce your own understanding.`,
        action: "Help peers or pursue advanced certifications"
      });
    }

    // Class Comparison
    if (average > classAverage) {
      recs.push({
        type: "Performance",
        priority: "low",
        icon: "📊",
        title: `Performing Above Class Average`,
        description: `Your average of ${average.toFixed(1)}% is ${(average - classAverage).toFixed(1)}% above the class average of ${classAverage.toFixed(1)}%. You're on track!`,
        action: "Maintain consistent effort and help others"
      });
    } else if (average < classAverage) {
      recs.push({
        type: "Performance",
        priority: "high",
        icon: "📊",
        title: `Below Class Average`,
        description: `Your average of ${average.toFixed(1)}% is ${(classAverage - average).toFixed(1)}% below the class average. Increase study intensity to close this gap.`,
        action: "Form study groups and allocate more time to studies"
      });
    }

    // Attendance and Consistency
    recs.push({
      type: "Lifestyle",
      priority: "medium",
      icon: "📅",
      title: "Study Consistency",
      description: `Maintain regular study schedules (at least 2-3 hours daily) to build momentum and ensure long-term academic success.`,
      action: "Create and follow a structured daily timetable"
    });

    // Goal Setting
    recs.push({
      type: "Goal",
      priority: "medium",
      icon: "🎯",
      title: "Set Target Goals",
      description: `Define specific targets for each subject. Aim for at least 80% in weak subjects and maintain excellence in strong areas.`,
      action: "Create a semester plan with subject-wise goals"
    });

    return recs;
  };

  const recommendations = generateRecommendations();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  return (
    <div style={insightsContainer}>
      <div style={insightsSummary}>
        <h3 style={{ margin: "0 0 15px 0", color: "#0f766e" }}>
          📊 Your Academic Performance Summary
        </h3>
        <div style={summaryStats}>
          <div style={statBox}>
            <p style={statLabel}>Current Average</p>
            <p style={statValue}>{average.toFixed(2)}%</p>
          </div>
          <div style={statBox}>
            <p style={statLabel}>Class Average</p>
            <p style={statValue}>{classAverage.toFixed(2)}%</p>
          </div>
          <div style={statBox}>
            <p style={statLabel}>Performance Percentile</p>
            <p style={statValue}>{percentile}%</p>
          </div>
          <div style={statBox}>
            <p style={statLabel}>Total Subjects</p>
            <p style={statValue}>{totalSubjects}</p>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: "30px", marginBottom: "20px", color: "#0f766e" }}>
        💡 Personalized Recommendations
      </h3>

      <div style={recommendationsContainer}>
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            style={{
              ...recommendationItem,
              borderLeftColor: getPriorityColor(rec.priority)
            }}
          >
            <div
              style={recommendationHeader}
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
            >
              <div style={recommendationTitleSection}>
                <span style={recommendationIcon}>{rec.icon}</span>
                <div>
                  <h4 style={recommendationItemTitle}>{rec.title}</h4>
                  <span
                    style={{
                      ...priorityBadge,
                      backgroundColor: getPriorityColor(rec.priority)
                    }}
                  >
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              <span style={expandIcon}>
                {expandedIndex === idx ? "▼" : "▶"}
              </span>
            </div>

            {expandedIndex === idx && (
              <div style={recommendationContent}>
                <p style={recommendationDescription}>{rec.description}</p>
                <div style={actionBox}>
                  <strong style={{ color: "#0f766e" }}>💼 Action Item:</strong>
                  <p style={{ margin: "8px 0 0 0", color: "#374151" }}>
                    {rec.action}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={tipsSection}>
        <h3 style={{ marginTop: "30px", color: "#0f766e" }}>
          📌 Quick Tips for Success
        </h3>
        <ul style={tipsList}>
          <li style={tipsItem}>
            📚 <strong>Study Smart:</strong> Use active learning techniques like practice problems and self-testing
          </li>
          <li style={tipsItem}>
            👥 <strong>Collaborate:</strong> Form study groups and discuss challenging concepts with peers
          </li>
          <li style={tipsItem}>
            💬 <strong>Ask Questions:</strong> Don't hesitate to reach out to instructors for clarification
          </li>
          <li style={tipsItem}>
            ⏰ <strong>Time Management:</strong> Allocate dedicated study time for each subject daily
          </li>
          <li style={tipsItem}>
            🎯 <strong>Set Goals:</strong> Break down learning into smaller achievable milestones
          </li>
          <li style={tipsItem}>
            😴 <strong>Self-Care:</strong> Ensure adequate sleep and exercise for optimal cognitive function
          </li>
        </ul>
      </div>
    </div>
  );
}

// Styles
const insightsContainer = {
  padding: "20px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const insightsSummary = {
  background: "#f0f9ff",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: "4px solid #0f766e"
};

const summaryStats = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "15px"
};

const statBox = {
  background: "white",
  padding: "15px",
  borderRadius: "8px",
  textAlign: "center",
  border: "2px solid #e5e7eb"
};

const statLabel = {
  margin: "0 0 8px 0",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "500"
};

const statValue = {
  margin: "0",
  color: "#0f766e",
  fontSize: "24px",
  fontWeight: "700"
};

const recommendationsContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const recommendationItem = {
  background: "#fafafa",
  border: "1px solid #e5e7eb",
  borderLeft: "4px solid #0f766e",
  borderRadius: "8px",
  padding: "15px",
  transition: "all 0.3s ease",
  cursor: "pointer"
};

const recommendationHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const recommendationTitleSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flex: 1
};

const recommendationIcon = {
  fontSize: "24px",
  lineHeight: "1",
  minWidth: "30px"
};

const recommendationItemTitle = {
  margin: "0 0 5px 0",
  color: "#0f766e",
  fontSize: "15px",
  fontWeight: "600"
};

const priorityBadge = {
  display: "inline-block",
  color: "white",
  padding: "3px 10px",
  borderRadius: "12px",
  fontSize: "10px",
  fontWeight: "600",
  textTransform: "uppercase"
};

const expandIcon = {
  color: "#0f766e",
  fontWeight: "bold",
  fontSize: "12px"
};

const recommendationContent = {
  marginTop: "15px",
  paddingTop: "15px",
  borderTop: "1px solid #e5e7eb"
};

const recommendationDescription = {
  margin: "0 0 15px 0",
  color: "#374151",
  fontSize: "13px",
  lineHeight: "1.6"
};

const actionBox = {
  background: "#f0fdf4",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #bbf7d0",
  color: "#0f766e"
};

const tipsSection = {
  background: "#fef3c7",
  padding: "20px",
  borderRadius: "8px",
  marginTop: "20px",
  borderLeft: "4px solid #f59e0b"
};

const tipsList = {
  margin: "15px 0 0 0",
  paddingLeft: "20px",
  color: "#374151"
};

const tipsItem = {
  lineHeight: "1.8",
  marginBottom: "10px",
  fontSize: "13px"
};

export default AcademicInsights;
