import React, { useState, useEffect, useRef } from "react";
import "./Quiz.css";


const TIMER_PER_QUESTION = 15;

const questionsData = [
   {
    subject: "javascript",
    questions: [
      {
        question: "Which company developed JavaScript?",
        options: ["Netscape", "Microsoft", "Google", "Apple"],
        answer: "Netscape",
      },
      {
        question: "What is the output of: typeof NaN?",
        options: ["number", "NaN", "undefined", "object"],
        answer: "number",
      },
      {
        question: "Which method converts JSON to a JavaScript object?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"],
        answer: "JSON.parse()",
      },
      {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "#", "/* */", "<!-- -->"],
        answer: "//",
      },
      {
        question: "What does === operator do in JavaScript?",
        options: ["Checks value equality", "Checks type and value equality", "Assigns value", "Compares object references"],
        answer: "Checks type and value equality",
      },
      {
        question: "Which keyword declares a block-scoped variable in JS?",
        options: ["var", "let", "const", "both let and const"],
        answer: "both let and const",
      },
    ],
  },
  {
    subject: "python",
    questions: [
      {
        question: "What keyword is used to define a function in Python?",
        options: ["func", "def", "function", "lambda"],
        answer: "def",
      },
      {
        question: "Which of these is a mutable data type in Python?",
        options: ["tuple", "list", "string", "int"],
        answer: "list",
      },
      {
        question: "What does 'PEP' stand for in Python community?",
        options: [
          "Python Enhancement Proposal",
          "Programming Efficiency Protocol",
          "Python Error Prevention",
          "Project Execution Plan",
        ],
        answer: "Python Enhancement Proposal",
      },
      {
        question: "How do you start a comment in Python?",
        options: ["//", "#", "<!--", "/*"],
        answer: "#",
      },
      {
        question: "What is the output of print(2 ** 3) in Python?",
        options: ["6", "8", "9", "5"],
        answer: "8",
      },
      {
        question: "Which keyword is used to create a class in Python?",
        options: ["class", "def", "function", "object"],
        answer: "class",
      },
    ],
  },
  {
    subject: "java",
    questions: [
      {
        question: "Which company originally developed Java?",
        options: ["Sun Microsystems", "Microsoft", "IBM", "Oracle"],
        answer: "Sun Microsystems",
      },
      {
        question: "What keyword is used to inherit a class in Java?",
        options: ["implements", "extends", "inherits", "super"],
        answer: "extends",
      },
      {
        question: "Which of these is NOT a Java primitive type?",
        options: ["int", "float", "boolean", "string"],
        answer: "string",
      },
      {
        question: "What is the size of int in Java?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
        answer: "4 bytes",
      },
      {
        question: "Which method is the entry point for Java programs?",
        options: ["main()", "start()", "run()", "init()"],
        answer: "main()",
      },
      {
        question: "How do you declare an array in Java?",
        options: ["int arr[];", "array arr;", "int[] arr;", "Both A and C"],
        answer: "Both A and C",
      },
    ],
  },
  {
    subject: "cpp",
    questions: [
      {
        question: "Which file extension is used for C++ source files?",
        options: [".cpp", ".c", ".java", ".py"],
        answer: ".cpp",
      },
      {
        question: "Which operator is used to allocate memory dynamically?",
        options: ["malloc", "new", "alloc", "create"],
        answer: "new",
      },
      {
        question: "What is the default access modifier for class members?",
        options: ["private", "public", "protected", "default"],
        answer: "private",
      },
      {
        question: "Which of the following is used for single line comment in C++?",
        options: ["//", "#", "/* */", "<!-- -->"],
        answer: "//",
      },
      {
        question: "What does the 'const' keyword do?",
        options: ["Declares a constant value", "Declares a variable", "Creates a pointer", "Declares a function"],
        answer: "Declares a constant value",
      },
      {
        question: "Which is the correct way to declare a pointer?",
        options: ["int* ptr;", "ptr int*;", "pointer int;", "int ptr*;"],
        answer: "int* ptr;",
      },
    ],
  },
  {
    subject: "html_css",
    questions: [
      {
        question: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
          "Hyperlinking Text Marking Language",
        ],
        answer: "HyperText Markup Language",
      },
      {
        question: "Which HTML element is used to define the largest heading?",
        options: ["<h1>", "<head>", "<heading>", "<h6>"],
        answer: "<h1>",
      },
      {
        question: "Which CSS property controls the text size?",
        options: ["font-style", "text-size", "font-size", "text-style"],
        answer: "font-size",
      },
      {
        question: "How do you insert a comment in a CSS file?",
        options: ["/* this is a comment */", "// this is a comment", "<!-- this is a comment -->", "# this is a comment"],
        answer: "/* this is a comment */",
      },
      {
        question: "Which property is used to change the background color?",
        options: ["background-color", "color", "bgcolor", "background"],
        answer: "background-color",
      },
      {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["style", "class", "styles", "font"],
        answer: "style",
      },
    ],
  },

  {
  "subject": "JSON",
  "questions": [
    {
      "question": "What does JSON stand for?",
      "options": ["JavaScript Object Notation", "Java Serialized Object Notation", "JavaScript Ordered Nodes", "JavaScript Object Naming"],
      "answer": "JavaScript Object Notation"
    },
    {
      "question": "Which data types are supported in JSON?",
      "options": ["String, Number, Boolean, Array, Object, Null", "String, Integer, Float, Object", "String, Boolean, Dictionary, List", "String, Number, Tuple, Set"],
      "answer": "String, Number, Boolean, Array, Object, Null"
    },
    {
      "question": "Which function is used to convert a JSON string into a JavaScript object?",
      "options": ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"],
      "answer": "JSON.parse()"
    },
    {
      "question": "Which function is used to convert a JavaScript object into a JSON string?",
      "options": ["JSON.stringify()", "JSON.parse()", "JSON.encode()", "JSON.serialize()"],
      "answer": "JSON.stringify()"
    },
    {
      "question": "Which symbol is used to represent key-value pairs in JSON?",
      "options": [":", "=", "->", "<-"],
      "answer": ":"
    },
    {
      "question": "Which file extension is commonly used for JSON files?",
      "options": [".json", ".jsn", ".txt", ".xml"],
      "answer": ".json"
    },
    {
      "question": "Which JSON structure represents an array?",
      "options": ["{}", "[]", "<>", "||"],
      "answer": "[]"
    },
    {
      "question": "Which JSON structure represents an object?",
      "options": ["{}", "[]", "<>", "||"],
      "answer": "{}"
    },
    {
      "question": "Which method is used to check if a JSON string is valid?",
      "options": ["JSON.validate()", "JSON.parse()", "JSON.check()", "JSON.verify()"],
      "answer": "JSON.parse()"
    },
    {
      "question": "Which MIME type is used for JSON data?",
      "options": ["application/json", "text/json", "application/javascript", "text/javascript"],
      "answer": "application/json"
    }
  ]
},
{
  "subject": "Swift",
  "questions": [
    {
      "question": "Which keyword is used to declare a constant in Swift?",
      "options": ["var", "let", "const", "final"],
      "answer": "let"
    },
    {
      "question": "Which function is used to print output in Swift?",
      "options": ["print()", "echo()", "console.log()", "display()"],
      "answer": "print()"
    },
    {
      "question": "Which data type is used to store a collection of unique values in Swift?",
      "options": ["Array", "List", "Set", "Dictionary"],
      "answer": "Set"
    },
    {
      "question": "Which keyword is used to define a function in Swift?",
      "options": ["func", "function", "def", "method"],
      "answer": "func"
    },
    {
      "question": "Which operator is used for string concatenation in Swift?",
      "options": ["+", "&", ".", "*"],
      "answer": "+"
    },
    {
      "question": "Which method is used to convert a string to an integer in Swift?",
      "options": ["Int()", "parseInt()", "convert()", "toInt()"],
      "answer": "Int()"
    },
    {
      "question": "Which collection type maintains key-value pairs in Swift?",
      "options": ["Array", "Set", "Dictionary", "Tuple"],
      "answer": "Dictionary"
    },
    {
      "question": "Which function is used to iterate over elements in Swift?",
      "options": ["each()", "forEach()", "loop()", "iterate()"],
      "answer": "forEach()"
    },
    {
      "question": "Which keyword is used to create a class in Swift?",
      "options": ["class", "struct", "object", "define"],
      "answer": "class"
    },
    {
      "question": "Which function is used to convert a Swift object into JSON format?",
      "options": ["JSONEncoder()", "jsonEncode()", "convertJson()", "serializeJson()"],
      "answer": "JSONEncoder()"
    }
  ]
},
{
  "subject": "SQL",
  "questions": [
    {
      "question": "Which SQL statement is used to retrieve data from a database?",
      "options": ["SELECT", "FETCH", "GET", "RETRIEVE"],
      "answer": "SELECT"
    },
    {
      "question": "Which SQL clause is used to filter records?",
      "options": ["WHERE", "FILTER", "HAVING", "ORDER BY"],
      "answer": "WHERE"
    },
    {
      "question": "Which SQL keyword is used to remove duplicate records from a result set?",
      "options": ["DISTINCT", "UNIQUE", "REMOVE", "FILTER"],
      "answer": "DISTINCT"
    },
    {
      "question": "Which SQL statement is used to insert new records into a table?",
      "options": ["INSERT INTO", "ADD RECORD", "NEW ENTRY", "UPDATE"],
      "answer": "INSERT INTO"
    },
    {
      "question": "Which SQL function returns the number of rows in a result set?",
      "options": ["COUNT()", "SUM()", "TOTAL()", "NUMBER()"],
      "answer": "COUNT()"
    },
    {
      "question": "Which SQL clause is used to sort the result set?",
      "options": ["ORDER BY", "SORT", "GROUP BY", "ARRANGE"],
      "answer": "ORDER BY"
    },
    {
      "question": "Which SQL statement is used to delete records from a table?",
      "options": ["DELETE", "REMOVE", "DROP", "CLEAR"],
      "answer": "DELETE"
    },
    {
      "question": "Which SQL statement is used to modify existing records in a table?",
      "options": ["UPDATE", "MODIFY", "CHANGE", "ALTER"],
      "answer": "UPDATE"
    },
    {
      "question": "Which SQL clause is used to group records?",
      "options": ["GROUP BY", "ORDER BY", "FILTER", "SORT"],
      "answer": "GROUP BY"
    },
    {
      "question": "Which SQL keyword is used to create a new table?",
      "options": ["CREATE TABLE", "NEW TABLE", "ADD TABLE", "DEFINE TABLE"],
      "answer": "CREATE TABLE"
    }
  ]
},
{
  "subject": "Kotlin",
  "questions": [
    {
      "question": "Which keyword is used to declare a variable in Kotlin?",
      "options": ["var", "let", "const", "val"],
      "answer": "var"
    },
    {
      "question": "Which function is used to print output in Kotlin?",
      "options": ["print()", "echo()", "console.log()", "display()"],
      "answer": "print()"
    },
    {
      "question": "Which data type is immutable in Kotlin?",
      "options": ["Array", "List", "Set", "String"],
      "answer": "String"
    },
    {
      "question": "Which keyword is used to define a function in Kotlin?",
      "options": ["func", "function", "def", "fun"],
      "answer": "fun"
    },
    {
      "question": "Which operator is used for string concatenation in Kotlin?",
      "options": ["+", "&", ".", "*"],
      "answer": "+"
    },
    {
      "question": "Which method is used to convert a string to an integer in Kotlin?",
      "options": ["toInt()", "parseInt()", "convert()", "int()"],
      "answer": "toInt()"
    },
    {
      "question": "Which collection type maintains unique elements in Kotlin?",
      "options": ["List", "Array", "Set", "Map"],
      "answer": "Set"
    },
    {
      "question": "Which function is used to iterate over elements in Kotlin?",
      "options": ["each()", "forEach()", "loop()", "iterate()"],
      "answer": "forEach()"
    },
    {
      "question": "Which keyword is used to create a class in Kotlin?",
      "options": ["class", "struct", "object", "define"],
      "answer": "class"
    },
    {
      "question": "Which function is used to convert a Kotlin object into JSON format?",
      "options": ["toJson()", "jsonEncode()", "convertJson()", "serializeJson()"],
      "answer": "toJson()"
    }
  ]
},
{
  "subject": "Ruby",
  "questions": [
    {
      "question": "Which keyword is used to define a method in Ruby?",
      "options": ["function", "def", "method", "define"],
      "answer": "def"
    },
    {
      "question": "Which symbol is used to denote instance variables in Ruby?",
      "options": ["@", "$", "#", "&"],
      "answer": "@"
    },
    {
      "question": "Which method is used to convert a string to an integer in Ruby?",
      "options": ["to_i", "parseInt", "convert", "int()"],
      "answer": "to_i"
    },
    {
      "question": "Which data type is immutable in Ruby?",
      "options": ["Array", "Hash", "String", "Symbol"],
      "answer": "Symbol"
    },
    {
      "question": "Which method is used to add an element to the end of an array?",
      "options": ["push()", "append()", "add()", "insert()"],
      "answer": "push()"
    },
    {
      "question": "Which operator is used for string concatenation in Ruby?",
      "options": ["+", "&", ".", "*"],
      "answer": "+"
    },
    {
      "question": "Which method is used to remove whitespace from the beginning and end of a string?",
      "options": ["strip()", "trim()", "clean()", "remove_whitespace()"],
      "answer": "strip()"
    },
    {
      "question": "Which method is used to iterate over an array in Ruby?",
      "options": ["each()", "forEach()", "loop()", "iterate()"],
      "answer": "each()"
    },
    {
      "question": "Which keyword is used to create a class in Ruby?",
      "options": ["class", "struct", "object", "define"],
      "answer": "class"
    },
    {
      "question": "Which method is used to convert a Ruby object into JSON format?",
      "options": ["to_json", "json_encode", "convert_json", "serialize_json"],
      "answer": "to_json"
    }
  ]
},
{
  "subject": "PHP",
  "questions": [
    {
      "question": "Which function is used to output text in PHP?",
      "options": ["echo", "print", "display", "show"],
      "answer": "echo"
    },
    {
      "question": "Which symbol is used to denote a variable in PHP?",
      "options": ["$", "#", "&", "*"],
      "answer": "$"
    },
    {
      "question": "Which function is used to connect to a MySQL database in PHP?",
      "options": ["mysqli_connect()", "mysql_connect()", "db_connect()", "connect()"],
      "answer": "mysqli_connect()"
    },
    {
      "question": "Which PHP function is used to encode an array into JSON format?",
      "options": ["json_encode()", "json_parse()", "json_convert()", "json_stringify()"],
      "answer": "json_encode()"
    },
    {
      "question": "Which superglobal variable is used to collect form data in PHP?",
      "options": ["$_POST", "$_GET", "$_REQUEST", "$_FORM"],
      "answer": "$_POST"
    },
    {
      "question": "Which PHP function is used to include another file?",
      "options": ["include()", "require()", "import()", "load()"],
      "answer": "include()"
    },
    {
      "question": "Which PHP function is used to start a session?",
      "options": ["session_start()", "start_session()", "begin_session()", "init_session()"],
      "answer": "session_start()"
    },
    {
      "question": "Which PHP function is used to check if a file exists?",
      "options": ["file_exists()", "is_file()", "check_file()", "exists()"],
      "answer": "file_exists()"
    },
    {
      "question": "Which PHP function is used to remove whitespace from the beginning and end of a string?",
      "options": ["trim()", "strip()", "clean()", "remove_whitespace()"],
      "answer": "trim()"
    },
    {
      "question": "Which PHP function is used to redirect to another page?",
      "options": ["header()", "redirect()", "goto()", "navigate()"],
      "answer": "header()"
    }
  ]
},
  
  // Add other subjects here...
];

export default function Quiz() {
  const [playerName, setPlayerName] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_QUESTION);
  const [showReview, setShowReview] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!subject || showResult || showReview) return;
    setTimeLeft(TIMER_PER_QUESTION);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => handleNext(), TIMER_PER_QUESTION * 1000);
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, subject, showResult, showReview]);

  useEffect(() => {
    if (!subject || showResult || showReview || timeLeft <= 0) return;
    const countdown = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timeLeft, subject, showResult, showReview]);

  const startQuiz = (selectedSubject) => {
    const subjData = questionsData.find(q => q.subject === selectedSubject);
    const shuffled = subjData.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
    setSubject(selectedSubject);
    setQuestions(shuffled);
    setAnswers(Array(5).fill(null));
    setCurrentIndex(0);
    setScore(0);
    setShowReview(false);
    setShowResult(false);
  };

  const selectAnswer = (option) => {
    if (answers[currentIndex] !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = option;
    setAnswers(newAnswers);
    clearTimeout(timerRef.current);
    setTimeout(() => handleNext(), 300);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowReview(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const submitQuiz = () => {
    const correct = questions.reduce(
      (acc, q, i) => (q.answer === answers[i] ? acc + 1 : acc),
      0
    );
    setScore(correct);
    setShowResult(true);
    setShowReview(false);
  };

  const resetQuiz = () => {
    setSubject("");
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setShowResult(false);
    setScore(0);
    setTimeLeft(TIMER_PER_QUESTION);
  };

  return (
    <div className="quizmain-container">
    <div className="quiz-container">
      <h1>🧠 Programming Quiz</h1>

      {!subject ? (
        <>
          <input
            className="input"
            placeholder="Enter your name (optional)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <p>Select a subject:</p>
          {questionsData.map(({ subject }) => (
            <button key={subject} className="btn" onClick={() => startQuiz(subject)}>
              {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </button>
          ))}
        </>
      ) : showResult ? (
        <div className="result-screen">
          <h2>Your Score: {score} / {questions.length}</h2>
          <button className="btn" onClick={resetQuiz}>Play Again</button>
        </div>
      ) : showReview ? (
        <div className="review-screen">
          <h2>Review Your Answers</h2>
          <ul>
            {questions.map((q, i) => (
              <li key={i}>
                <strong>Q{i + 1}:</strong> {q.question}
                <br />
                <span className={answers[i] === q.answer ? "correct" : "incorrect"}>
                  Your answer: {answers[i] || "None"}
                </span>
                {answers[i] !== q.answer && (
                  <span className="correct"> | Correct: {q.answer}</span>
                )}
              </li>
            ))}
          </ul>
          <button className="btn" onClick={submitQuiz}>Submit</button>
        </div>
      ) : (
        <>
          <div className="question-meta">
            Question {currentIndex + 1} / {questions.length}
          </div>
          <div className="question-text">{questions[currentIndex].question}</div>
          <div className="options">
            {questions[currentIndex].options.map((opt) => (
              <button
                key={opt}
                className={`option-btn ${answers[currentIndex] === opt ? "selected" : ""}`}
                onClick={() => selectAnswer(opt)}
                disabled={answers[currentIndex] !== null}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(timeLeft / TIMER_PER_QUESTION) * 100}%` }}
            />
          </div>
          <div className="nav-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="btn">
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={answers[currentIndex] === null}
              className="btn"
            >
              {currentIndex === questions.length - 1 ? "Review" : "Next"}
            </button>
          </div>
        </>
      )}
    </div>
    </div>
  );
}
