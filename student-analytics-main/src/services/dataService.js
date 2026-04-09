export const students = [
  {
    id: 1,
    name: "Rahul",
    subjects: [
      { subject: "Data Structures", marks: 75 },
      { subject: "Database Management", marks: 82 },
      { subject: "Computer Networks", marks: 68 }
    ],
    attendance: 88,
    assignmentScores: [72, 80, 78],
    quizAttempts: []
  },
  {
    id: 2,
    name: "Anjali",
    subjects: [
      { subject: "Data Structures", marks: 88 },
      { subject: "Database Management", marks: 79 },
      { subject: "Computer Networks", marks: 90 }
    ],
    attendance: 92,
    assignmentScores: [85, 88, 90],
    quizAttempts: []
  }
];

export const assessments = [
  {
    id: 1,
    name: "Data Structures Quiz",
    subject: "Data Structures",
    questions: [
      {
        id: 1,
        question: "What is a stack?",
        options: ["LIFO", "FIFO", "Random", "None"],
        correct: "LIFO"
      },
      {
        id: 2,
        question: "Time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: "O(log n)"
      },
      {
        id: 3,
        question: "Which data structure uses FIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correct: "Queue"
      }
    ]
  },
  {
    id: 2,
    name: "Database Management Quiz",
    subject: "Database Management",
    questions: [
      {
        id: 4,
        question: "What is a primary key?",
        options: ["Unique identifier", "Foreign key", "Index", "Constraint"],
        correct: "Unique identifier"
      },
      {
        id: 5,
        question: "SQL stands for?",
        options: ["Structured Query Language", "Simple Query List", "System Query Language", "None"],
        correct: "Structured Query Language"
      },
      {
        id: 6,
        question: "Which is a NoSQL database?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
        correct: "MongoDB"
      }
    ]
  },
  {
    id: 3,
    name: "Computer Networks Quiz",
    subject: "Computer Networks",
    questions: [
      {
        id: 7,
        question: "What does TCP stand for?",
        options: ["Transmission Control Protocol", "Transfer Control Process", "Transmission Connection Protocol", "None"],
        correct: "Transmission Control Protocol"
      },
      {
        id: 8,
        question: "Which layer is responsible for routing?",
        options: ["Application Layer", "Network Layer", "Transport Layer", "Data Link Layer"],
        correct: "Network Layer"
      },
      {
        id: 9,
        question: "What is the default port for HTTP?",
        options: ["80", "443", "8080", "3000"],
        correct: "80"
      }
    ]
  },
  {
    id: 4,
    name: "Operating Systems Quiz",
    subject: "Operating Systems",
    questions: [
      {
        id: 10,
        question: "What is a process?",
        options: ["Running program", "Memory address", "CPU instruction", "System call"],
        correct: "Running program"
      },
      {
        id: 11,
        question: "Which scheduling algorithm is preemptive?",
        options: ["FCFS", "Round Robin", "SJF", "Priority"],
        correct: "Round Robin"
      },
      {
        id: 12,
        question: "What is a deadlock?",
        options: ["Process termination", "Circular wait", "Memory overflow", "CPU overflow"],
        correct: "Circular wait"
      }
    ]
  }
];

const STORAGE_KEY_STUDENTS = "studentsData";

const loadStoredStudents = () => {
  const s = localStorage.getItem(STORAGE_KEY_STUDENTS);
  if (s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      console.error("parse error", e);
    }
  }
  return students;
};

const saveStoredStudents = (arr) => {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(arr));
};

// ensure there is always a copy in storage
if (!localStorage.getItem(STORAGE_KEY_STUDENTS)) {
  saveStoredStudents(students);
}

export const getCurrentStudent = () => {
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing currentUser:", error);
      return null;
    }
  }
  return null;
};

/**
 * add a quiz attempt for the named student;
 * returns false if the student is not found or already attempted that quiz.
 */
export const updateStudentQuizAttempt = (studentName, quizAttempt) => {
  const all = loadStoredStudents();
  const idx = all.findIndex((s) => s.name === studentName);
  if (idx === -1) {
    console.warn("student not found:", studentName);
    return false;
  }
  if (!Array.isArray(all[idx].quizAttempts)) {
    all[idx].quizAttempts = [];
  }
  const already = all[idx].quizAttempts.some(
    (a) => a.assessmentId === quizAttempt.assessmentId
  );
  if (already) {
    return false;
  }
  all[idx].quizAttempts.push(quizAttempt);
  saveStoredStudents(all);

  // keep exported array in sync
  const eidx = students.findIndex((s) => s.name === studentName);
  if (eidx !== -1) {
    students[eidx].quizAttempts = all[idx].quizAttempts;
  }

  // if the current user is that student, update it too
  const cur = getCurrentStudent();
  if (cur && cur.name === studentName) {
    cur.quizAttempts = all[idx].quizAttempts;
    localStorage.setItem("currentUser", JSON.stringify(cur));
  }

  return true;
};

export const getAllStudentsWithQuizData = () => {
  return loadStoredStudents();
};

export const addStudentRecord = (record) => {
  const all = loadStoredStudents();
  const nextId = Math.max(0, ...all.map((s) => s.id)) + 1;
  const newStudent = {
    id: nextId,
    name: record.name,
    subjects: record.subjects || [],
    attendance: record.attendance || 0,
    assignmentScores: record.assignmentScores || [],
    quizAttempts: record.quizAttempts || []
  };
  all.push(newStudent);
  saveStoredStudents(all);
  return newStudent;
};

export const updateStudentRecord = (studentId, updates) => {
  const all = loadStoredStudents();
  const idx = all.findIndex((s) => s.id === studentId);
  if (idx === -1) return false;
  all[idx] = {
    ...all[idx],
    ...updates,
    subjects: updates.subjects || all[idx].subjects,
    attendance: updates.attendance != null ? updates.attendance : all[idx].attendance,
    assignmentScores: updates.assignmentScores || all[idx].assignmentScores
  };
  saveStoredStudents(all);
  return true;
};

export const removeStudentRecord = (studentId) => {
  const all = loadStoredStudents();
  const filtered = all.filter((s) => s.id !== studentId);
  if (filtered.length === all.length) return false;
  saveStoredStudents(filtered);
  return true;
};