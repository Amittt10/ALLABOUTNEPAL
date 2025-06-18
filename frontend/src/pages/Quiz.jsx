import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Component/ui/Card"
import { Button } from "../Component/ui/Button"
import { Progress } from "../Component/ui/Progress"
import { Badge } from "../Component/ui/Bandge"
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"
import "./Quiz.css"
import { Star, Clock, Award } from "lucide-react"

const questions = [
  {
    id: 1,
    question: "Which valley is known as the 'Living Cultural Museum' and is a UNESCO World Heritage Site?",
    options: ["Pokhara Valley", "Kathmandu Valley", "Chitwan Valley", "Mustang Valley"],
    correctAnswer: 1,
    explanation:
      "Kathmandu Valley is recognized as a UNESCO World Heritage Site and contains seven monument zones including Durbar Squares of Kathmandu, Patan, and Bhaktapur.",
    category: "UNESCO Sites",
    difficulty: "Medium",
    points: 10,
  },
  {
    id: 2,
    question: "What is the traditional Nepali greeting called?",
    options: ["Namaskar", "Namaste", "Dhanyabad", "Satsriakal"],
    correctAnswer: 1,
    explanation:
      "Namaste is the traditional Nepali greeting, performed by pressing palms together and bowing slightly. It means 'I bow to the divine in you.'",
    category: "Traditions",
    difficulty: "Easy",
    points: 5,
  },
  {
    id: 3,
    question: "Which festival is known as the 'Festival of Lights' in Nepal?",
    options: ["Dashain", "Tihar", "Holi", "Teej"],
    correctAnswer: 1,
    explanation:
      "Tihar, also called Deepawali, is the festival of lights celebrated for five days, honoring different animals and the goddess Lakshmi.",
    category: "Festivals",
    difficulty: "Easy",
    points: 5,
  },
  {
    id: 4,
    question: "What is the traditional architectural style of Nepali temples called?",
    options: ["Shikhara", "Pagoda", "Stupa", "Chaitya"],
    correctAnswer: 1,
    explanation:
      "The Pagoda style is distinctively Nepali, characterized by multi-tiered roofs. This style later influenced temple architecture in other Asian countries.",
    category: "Architecture",
    difficulty: "Medium",
    points: 10,
  },
  {
    id: 5,
    question: "Which ancient trade route passed through Nepal connecting Tibet and India?",
    options: ["Silk Road", "Spice Route", "Trans-Himalayan Trade Route", "Grand Trunk Road"],
    correctAnswer: 2,
    explanation:
      "The Trans-Himalayan Trade Route was crucial for trade between Tibet and India, with Nepal serving as an important transit point for centuries.",
    category: "History",
    difficulty: "Hard",
    points: 15,
  },
  {
    id: 6,
    question: "What is the traditional Nepali cap called?",
    options: ["Topi", "Dhaka Topi", "Bhadgaunle Topi", "All of the above"],
    correctAnswer: 3,
    explanation:
      "All are traditional Nepali caps. Dhaka Topi is made from Dhaka fabric, Bhadgaunle Topi originates from Bhaktapur, and Topi is the general term.",
    category: "Traditional Dress",
    difficulty: "Medium",
    points: 10,
  },
  {
    id: 7,
    question: "Which UNESCO World Heritage Site in Nepal is the birthplace of Lord Buddha?",
    options: ["Swayambhunath", "Boudhanath", "Lumbini", "Pashupatinath"],
    correctAnswer: 2,
    explanation:
      "Lumbini, located in southern Nepal, is recognized as the birthplace of Siddhartha Gautama (Buddha) and is a major pilgrimage site.",
    category: "UNESCO Sites",
    difficulty: "Easy",
    points: 5,
  },
  {
    id: 8,
    question: "What is the traditional Nepali musical instrument similar to a violin called?",
    options: ["Sarangi", "Tabla", "Madal", "Bansuri"],
    correctAnswer: 0,
    explanation:
      "Sarangi is a traditional string instrument played with a bow, commonly used in Nepali folk music and classical performances.",
    category: "Music",
    difficulty: "Hard",
    points: 15,
  },
  {
    id: 9,
    question: "Which festival celebrates the bond between brothers and sisters in Nepal?",
    options: ["Raksha Bandhan", "Bhai Tika", "Gai Jatra", "Indra Jatra"],
    correctAnswer: 1,
    explanation:
      "Bhai Tika, celebrated during Tihar festival, honors the relationship between brothers and sisters with sisters applying colorful tikas on their brothers' foreheads.",
    category: "Festivals",
    difficulty: "Medium",
    points: 10,
  },
  {
    id: 10,
    question: "What is the traditional Nepali fermented vegetable dish called?",
    options: ["Gundruk", "Dhido", "Sel Roti", "Momo"],
    correctAnswer: 0,
    explanation:
      "Gundruk is a traditional fermented leafy green vegetable dish, considered Nepal's national dish and an important source of nutrition.",
    category: "Cuisine",
    difficulty: "Medium",
    points: 10,
  },
]

export default function NepalHeritageQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(new Array(questions.length).fill(false))
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [userAnswers, setUserAnswers] = useState({})

  const handleStartQuiz = () => {
    setQuizStarted(true)
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setQuizCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleAnswerSelect = (index) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    setShowResult(true)

    const updated = [...answeredQuestions]
    updated[currentQuestion] = true
    setAnsweredQuestions(updated)

    // Store user answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: selectedAnswer,
    }))

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
      setTotalPoints(totalPoints + questions[currentQuestion].points)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTotalPoints(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
    setQuizCompleted(false)
    setQuizStarted(false)
    setTimeLeft(600)
    setUserAnswers({})
  }

  const getScoreMessage = () => {
    const percent = (score / questions.length) * 100
    if (percent >= 90) return "Excellent! You're a Nepal cultural heritage expert! 🏆"
    if (percent >= 70) return "Great job! You have good knowledge of Nepali culture! 🎉"
    if (percent >= 50) return "Good effort! Keep learning about Nepal's rich heritage! 👍"
    return "Keep exploring Nepal's beautiful culture and traditions! 📚"
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerClass = () => {
    if (timeLeft <= 60) return "timer critical"
    if (timeLeft <= 120) return "timer warning"
    return "timer"
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAchievements = () => {
    const achievements = []
    const percent = (score / questions.length) * 100

    if (percent === 100) {
      achievements.push({ icon: "🎯", name: "Perfect Score", description: "Answered all questions correctly!" })
    }
    if (percent >= 80) {
      achievements.push({ icon: "🏆", name: "Heritage Expert", description: "Scored 80% or higher!" })
    }
    if (timeLeft > 300) {
      achievements.push({ icon: "⚡", name: "Speed Scholar", description: "Completed with time to spare!" })
    }
    if (score >= 5) {
      achievements.push({
        icon: "📚",
        name: "Culture Enthusiast",
        description: "Demonstrated good cultural knowledge!",
      })
    }

    return achievements
  }

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">Nepal Cultural Heritage Quiz</h1>
          <p className="quiz-subtitle">
            Test your knowledge about Nepal's rich cultural heritage, traditions, and history
          </p>
          <div className="heritage-badges">
            <Badge variant="outline" className="heritage-badge">
              <Star className="w-4 h-4 mr-1" />
              {questions.length} Questions
            </Badge>
            <Badge variant="outline" className="heritage-badge">
              <Clock className="w-4 h-4 mr-1" />
              10 Minutes
            </Badge>
            <Badge variant="outline" className="heritage-badge">
              <Award className="w-4 h-4 mr-1" />
              Multiple Categories
            </Badge>
          </div>
        </div>
        <div className="button-container">
          <Button className="btn btn-primary" onClick={handleStartQuiz}>
            <span>🚀</span>
            Start Quiz
          </Button>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const achievements = getAchievements()
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0)

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">Quiz Completed!</h1>
        </div>

        <div className="score-container">
          <div className="score-circle">{Math.round((score / questions.length) * 100)}%</div>
          <div className="score-text">
            You scored {score} out of {questions.length} questions correctly
          </div>
          <div className="score-text">
            Total Points: {totalPoints} / {maxPoints}
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="achievement-container">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-badge earned">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-name">{achievement.name}</div>
              </div>
            ))}
          </div>
        )}

        <Card className="heritage-card">
          <CardContent className="heritage-card-content">
            <Progress value={(score / questions.length) * 100} className="mb-4" />
            <p className="heritage-significance">{getScoreMessage()}</p>
            <div className="button-container">
              <Button className="btn btn-primary" onClick={resetQuiz}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">Nepal Cultural Heritage Quiz</h1>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="timer-container">
        <div className={getTimerClass()}>
          <Clock className="timer-icon" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="question-section">
        <div className="question-number">Question {currentQuestion + 1}</div>
        <div className="heritage-badges">
          <Badge className={`quiz-type-indicator ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="heritage-badge">
            {question.category}
          </Badge>
          <Badge variant="outline" className="heritage-badge">
            {question.points} points
          </Badge>
        </div>
        <div className="question-text">{question.question}</div>
      </div>

      <div className="options-container multiple-choice">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            className={`quiz-option ${
              selectedAnswer === index
                ? showResult
                  ? index === question.correctAnswer
                    ? "correct-answer"
                    : "wrong-answer"
                  : "selected"
                : showResult && index === question.correctAnswer
                  ? "correct-answer"
                  : ""
            }`}
          >
            <div className="option-label">{String.fromCharCode(65 + index)}</div>
            <div className="option-text">{option}</div>
            {showResult && (
              <>
                {index === question.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                ) : selectedAnswer === index ? (
                  <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                ) : null}
              </>
            )}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="explanation-box">
          <div className="explanation-title">Explanation</div>
          <p>{question.explanation}</p>
        </div>
      )}

      <div className="button-container">
        <div className="heritage-inscription-info">
          Score: {score} / {answeredQuestions.filter(Boolean).length} | Points: {totalPoints}
        </div>
        {!showResult ? (
          <Button className="btn btn-primary" onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
            Submit Answer
          </Button>
        ) : (
          <Button className="btn btn-success" onClick={handleNextQuestion}>
            {currentQuestion === questions.length - 1 ? (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Finish Quiz
              </>
            ) : (
              <>
                Next Question
                <span>→</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
export function Quiz() {
  return <NepalHeritageQuiz />
}