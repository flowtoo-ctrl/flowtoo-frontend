import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaReply, FaTimes, FaCheckCircle } from "react-icons/fa";
import "./CommunityQA.css";

export default function CommunityQA({ productId, productName }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock data - In production, fetch from API
  useEffect(() => {
    const mockQuestions = [
      {
        id: 1,
        question: "Is this product compatible with my setup?",
        asker: "John D.",
        date: "2 days ago",
        likes: 12,
        answers: [
          {
            id: 1,
            text: "Yes, it's compatible with most standard setups!",
            answerer: "Store Admin",
            isOfficial: true,
            date: "1 day ago",
            likes: 8,
          },
          {
            id: 2,
            text: "I have the same setup and it works perfectly.",
            answerer: "Sarah M.",
            isOfficial: false,
            date: "1 day ago",
            likes: 5,
          },
        ],
      },
      {
        id: 2,
        question: "What's the warranty period?",
        asker: "Mike T.",
        date: "5 days ago",
        likes: 8,
        answers: [
          {
            id: 1,
            text: "We offer a 2-year manufacturer's warranty.",
            answerer: "Store Admin",
            isOfficial: true,
            date: "4 days ago",
            likes: 15,
          },
        ],
      },
    ];
    setQuestions(mockQuestions);
  }, [productId]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!newQuestion.trim() || !userEmail.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // In production, send to backend
      const question = {
        id: questions.length + 1,
        question: newQuestion,
        asker: userEmail.split("@")[0],
        date: "just now",
        likes: 0,
        answers: [],
      };

      setQuestions([question, ...questions]);
      setNewQuestion("");
      setUserEmail("");
      setShowQuestionForm(false);
      alert("✓ Question posted! Thanks for your inquiry.");
    } catch (err) {
      alert("Failed to post question");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (questionId) => {
    if (!replyText.trim() || !userEmail.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // In production, send to backend
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: q.answers.length + 1,
                text: replyText,
                answerer: userEmail.split("@")[0],
                isOfficial: false,
                date: "just now",
                likes: 0,
              },
            ],
          };
        }
        return q;
      });

      setQuestions(updatedQuestions);
      setReplyText("");
      setReplyingTo(null);
      setUserEmail("");
      alert("✓ Reply posted!");
    } catch (err) {
      alert("Failed to post reply");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (questionId, answerId = null) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId && !answerId) {
        return { ...q, likes: q.likes + 1 };
      }
      if (answerId) {
        return {
          ...q,
          answers: q.answers.map((a) =>
            a.id === answerId ? { ...a, likes: a.likes + 1 } : a
          ),
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  return (
    <div className="community-qa">
      <div className="qa-header">
        <h3>💬 Community Q&A</h3>
        <p>Have a question about {productName}? Ask our community!</p>
      </div>

      {/* Ask Question Button */}
      {!showQuestionForm && (
        <button
          className="btn-ask-question"
          onClick={() => setShowQuestionForm(true)}
        >
          + Ask a Question
        </button>
      )}

      {/* Ask Question Form */}
      {showQuestionForm && (
        <div className="question-form-container animate-slideInLeft">
          <div className="form-header">
            <h4>Ask a Question</h4>
            <button
              className="close-btn"
              onClick={() => setShowQuestionForm(false)}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleAskQuestion} className="qa-form">
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="question">Your Question</label>
              <textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask something about this product..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Posting..." : "Post Question"}
            </button>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="questions-list">
        {questions.length === 0 ? (
          <p className="no-questions">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <div className="question-info">
                  <h4>{question.question}</h4>
                  <p className="meta">
                    Asked by <strong>{question.asker}</strong> • {question.date}
                  </p>
                </div>
                <button
                  className="like-btn"
                  onClick={() => handleLike(question.id)}
                  title="Helpful"
                >
                  <FaThumbsUp /> {question.likes}
                </button>
              </div>

              {/* Answers */}
              {question.answers.length > 0 && (
                <div className="answers-section">
                  <h5>{question.answers.length} Answer(s)</h5>
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="answer-card">
                      <div className="answer-header">
                        <div className="answerer-info">
                          {answer.isOfficial && (
                            <span className="official-badge">
                              <FaCheckCircle /> Official
                            </span>
                          )}
                          <strong>{answer.answerer}</strong>
                          <span className="answer-date">{answer.date}</span>
                        </div>
                        <button
                          className="like-btn"
                          onClick={() => handleLike(question.id, answer.id)}
                          title="Helpful"
                        >
                          <FaThumbsUp /> {answer.likes}
                        </button>
                      </div>
                      <p className="answer-text">{answer.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === question.id ? (
                <div className="reply-form-container">
                  <form
                    onSubmit={() => handleAddReply(question.id)}
                    className="qa-form"
                  >
                    <div className="form-group">
                      <label htmlFor={`reply-email-${question.id}`}>Your Email</label>
                      <input
                        type="email"
                        id={`reply-email-${question.id}`}
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`reply-text-${question.id}`}>Your Answer</label>
                      <textarea
                        id={`reply-text-${question.id}`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Share your answer..."
                        rows="3"
                        required
                      />
                    </div>

                    <div className="reply-buttons">
                      <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Posting..." : "Post Answer"}
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                          setUserEmail("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  className="btn-reply"
                  onClick={() => setReplyingTo(question.id)}
                >
                  <FaReply /> Answer This Question
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
