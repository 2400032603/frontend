import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assessments, updateStudentQuizAttempt } from "../services/dataService";

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    background: "#f1f5f9",
    minHeight: "100vh"
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f766e",
    marginBottom: "30px"
  },
  subheader: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "10px"
  },
  quizList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  quizCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "2px solid #0f766e",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  quizCardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f766e",
    marginBottom: "10px"
  },
  quizCardSubject: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px"
  },
  startBtn: {
    background: "#0f766e",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginTop: "15px",
    width: "100%",
    transition: "all 0.3s ease"
  },
  questionContainer: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e5e7eb"
  },
  quizTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f766e",
    margin: 0
  },
  backBtn: {
    background: "#9ca3af",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px"
  },
  questionCounter: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
    fontWeight: "500"
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "25px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "#0f766e",
    transition: "width 0.3s ease"
  },
  question: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "25px",
    lineHeight: "1.5"
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "30px"
  },
  option: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    border: "2px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.3s ease",
    background: "white"
  },
  optionSelected: {
    background: "#dbeafe",
    borderColor: "#0f766e",
    fontWeight: "600"
  },
  radioInput: {
    marginRight: "12px",
    width: "18px",
    height: "18px",
    cursor: "pointer"
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "2px solid #e5e7eb"
  },
  navBtn: {
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    border: "none",
    transition: "all 0.3s ease"
  },
  prevBtn: {
    background: "#9ca3af",
    color: "white"
  },
  nextBtn: {
    background: "#0f766e",
    color: "white"
  },
  submitBtn: {
    background: "#059669",
    color: "white"
  },
  resultContainer: {
    background: "white",
    padding: "50px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  resultScore: {
    fontSize: "64px",
    fontWeight: "700",
    color: "#0f766e",
    marginBottom: "15px"
  },
  resultMessage: {
    fontSize: "20px",
    color: "#6b7280",
    marginBottom: "10px"
  },
  resultStatus: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "30px"
  },
  resultPass: {
    color: "#059669"
  },
  resultFail: {
    color: "#dc2626"
  },
  resultDetails: {
    fontSize: "15px",
    color: "#1f2937",
    marginBottom: "30px",
    textAlign: "left",
    background: "#f3f4f6",
    padding: "25px",
    borderRadius: "8px",
    maxHeight: "400px",
    overflowY: "auto"
  },
  resultItem: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #d1d5db"
  },
  resultItemLast: {
    borderBottom: "none"
  },
  resultItemQuestion: {
    fontWeight: "600",
    marginBottom: "10px",
    color: "#1f2937"
  },
  resultItemCorrect: {
    color: "#059669",
    marginBottom: "5px"
  },
  resultItemIncorrect: {
    color: "#dc2626",
    marginBottom: "5px"
  },
  backToDashboardBtn: {
    background: "#0f766e",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    marginTop: "20px"
  }
};

function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({
    currentAssessment: null,
    currentQuestionIndex: 0,
    answers: {},
    showResult: false,
    quizResult: null,
    quizzesToShow: assessments
  });

  useEffect(() => {
    if (location.state?.quizId) {
      const quiz = assessments.find((a) => a.id === location.state.quizId);
      if (quiz) {
        setState((prev) => ({
          ...prev,
          currentAssessment: quiz,
          currentQuestionIndex: 0,
          answers: {},
          showResult: false,
          quizResult: null
        }));
      }
    }
  }, [location.state?.quizId]);

  const handleStart = (assessmentId) => {
    const quiz = assessments.find((a) => a.id === assessmentId);
    if (!quiz) {
      alert("Quiz not found!");
      return;
    }
    setState({
      currentAssessment: quiz,
      currentQuestionIndex: 0,
      answers: {},
      showResult: false,
      quizResult: null,
      quizzesToShow: state.quizzesToShow
    });
  };

  const handleOptionSelect = (questionId, selectedOption) => {
    setState({
      ...state,
      answers: { ...state.answers, [questionId]: selectedOption }
    });
  };

  const handleNext = () => {
    if (
      state.currentQuestionIndex <
      state.currentAssessment.questions.length - 1
    ) {
      setState({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      });
    }
  };

  const handlePrev = () => {
    if (state.currentQuestionIndex > 0) {
      setState({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1
      });
    }
  };

  const handleSubmit = () => {
    if (!state.currentAssessment) return;

    let score = 0;
    const detailedResults = [];

    state.currentAssessment.questions.forEach((q) => {
      const isCorrect = state.answers[q.id] === q.correct;
      if (isCorrect) score++;
      detailedResults.push({
        question: q.question,
        userAnswer: state.answers[q.id] || "Not answered",
        correctAnswer: q.correct,
        isCorrect
      });
    });

    const percent =
      (score / state.currentAssessment.questions.length) * 100;

    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      alert("No user found – please log in again.");
      navigate("/");
      return;
    }

    const user = JSON.parse(stored);

    const quizAttempt = {
      assessmentId: state.currentAssessment.id,
      assessmentName: state.currentAssessment.name,
      subject: state.currentAssessment.subject,
      percentage: percent,
      score: score,
      totalQuestions: state.currentAssessment.questions.length,
      date: new Date().toISOString()
    };

    const success = updateStudentQuizAttempt(user.name, quizAttempt);
    
    if (!success) {
      alert("You have already attempted this quiz. Only one attempt allowed per quiz.");
      setState({
        ...state,
        currentAssessment: null,
        currentQuestionIndex: 0,
        answers: {},
        showResult: false,
        quizResult: null
      });
      return;
    }

    setState({
      ...state,
      quizResult: {
        score,
        total: state.currentAssessment.questions.length,
        percent: percent.toFixed(2),
        detailedResults
      },
      showResult: true
    });
  };

  const handleBackToQuizzes = () => {
    setState({
      currentAssessment: null,
      currentQuestionIndex: 0,
      answers: {},
      showResult: false,
      quizResult: null,
      quizzesToShow: state.quizzesToShow
    });
  };

  const handleBackToDashboard = () => {
    navigate("/student");
  };

  if (!state.currentAssessment) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>📝 Available Quizzes</h1>
        <p style={styles.subheader}>
          Select a quiz below to test your knowledge
        </p>
        <div style={styles.quizList}>
          {state.quizzesToShow.map((assessment) => (
            <div
              key={assessment.id}
              style={styles.quizCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <h3 style={styles.quizCardTitle}>{assessment.name}</h3>
              <p style={styles.quizCardSubject}>
                Subject: {assessment.subject}
              </p>
              <p style={styles.quizCardSubject}>
                Questions: {assessment.questions.length}
              </p>
              <button
                onClick={() => handleStart(assessment.id)}
                style={styles.startBtn}
                onMouseEnter={(e) => {
                  e.target.style.background = "#115e59";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#0f766e";
                }}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state.showResult) {
    const result = state.quizResult;
    return (
      <div style={styles.container}>
        <div style={styles.resultContainer}>
          <h2 style={styles.header}>✓ Quiz Completed</h2>
          <div style={styles.resultScore}>{result.percent}%</div>
          <div style={styles.resultMessage}>
            You scored {result.score} out of {result.total} questions
          </div>
          <div
            style={{
              ...styles.resultStatus,
              ...(result.percent >= 70
                ? styles.resultPass
                : styles.resultFail)
            }}
          >
            {result.percent >= 70 ? "✅ Great job!" : "❌ Score below 60% - At Risk"}
          </div>

          <div style={styles.resultDetails}>
            {result.detailedResults.map((res, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.resultItem,
                  ...(idx === result.detailedResults.length - 1
                    ? styles.resultItemLast
                    : {})
                }}
              >
                <p style={styles.resultItemQuestion}>
                  Q{idx + 1}: {res.question}
                </p>
                <p style={styles.resultItemCorrect}>
                  Your answer: <strong>{res.userAnswer}</strong>
                  {res.isCorrect ? " ✅" : " ❌"}
                </p>
                {!res.isCorrect && (
                  <p style={styles.resultItemIncorrect}>
                    Correct answer: <strong>{res.correctAnswer}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleBackToQuizzes}
            style={{
              ...styles.backToDashboardBtn,
              marginRight: "10px",
              background: "#9ca3af"
            }}
          >
            Back to Quizzes
          </button>
          <button
            onClick={handleBackToDashboard}
            style={styles.backToDashboardBtn}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion =
    state.currentAssessment.questions[state.currentQuestionIndex];
  const totalQuestions = state.currentAssessment.questions.length;
  const progressPercent = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.questionContainer}>
        <div style={styles.quizHeader}>
          <h2 style={styles.quizTitle}>{state.currentAssessment.name}</h2>
          <button
            onClick={handleBackToQuizzes}
            style={styles.backBtn}
            onMouseEnter={(e) => {
              e.target.style.background = "#6b7280";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#9ca3af";
            }}
          >
            ← Back
          </button>
        </div>

        <p style={styles.questionCounter}>
          Question {state.currentQuestionIndex + 1} of {totalQuestions}
        </p>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressPercent}%`
            }}
          />
        </div>

        <p style={styles.question}>{currentQuestion.question}</p>

        <div style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              style={{
                ...styles.option,
                ...(state.answers[currentQuestion.id] === option
                  ? styles.optionSelected
                  : {})
              }}
              onMouseEnter={(e) => {
                if (state.answers[currentQuestion.id] !== option) {
                  e.currentTarget.style.borderColor = "#0f766e";
                  e.currentTarget.style.background = "#f0f9ff";
                }
              }}
              onMouseLeave={(e) => {
                if (state.answers[currentQuestion.id] !== option) {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={state.answers[currentQuestion.id] === option}
                onChange={() =>
                  handleOptionSelect(currentQuestion.id, option)
                }
                style={styles.radioInput}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={handlePrev}
            disabled={state.currentQuestionIndex === 0}
            style={{
              ...styles.navBtn,
              ...styles.prevBtn,
              opacity: state.currentQuestionIndex === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (state.currentQuestionIndex > 0) {
                e.target.style.background = "#6b7280";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#9ca3af";
            }}
          >
            ← Previous
          </button>

          {state.currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              style={{
                ...styles.navBtn,
                ...styles.nextBtn
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#115e59";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#0f766e";
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                ...styles.navBtn,
                ...styles.submitBtn
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#047857";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#059669";
              }}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;