import React, { useState } from "react";

interface ReviewItem {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

const REVIEWS_LIST: ReviewItem[] = [
  {
    id: "REV-001",
    patientName: "Riya Shah",
    rating: 5,
    date: "18 Jun 2025",
    comment: "Very good experience! The staff is friendly and the clinic is very clean. Highly recommended for any root canal treatments.",
    reply: "Thank you Riya! Glad we could help you feel comfortable.",
  },
  {
    id: "REV-002",
    patientName: "Amit Patel",
    rating: 5,
    date: "17 Jun 2025",
    comment: "Dr. Denish explained everything clearly. Very gentle during the procedure. Will visit again.",
    reply: "Thank you Amit for the kind words!",
  },
  {
    id: "REV-003",
    patientName: "Vikram Singh",
    rating: 4,
    date: "15 Jun 2025",
    comment: "Great treatment. The wait time was a bit long (about 20 minutes) but overall consultation was detailed.",
  },
  {
    id: "REV-004",
    patientName: "Neha Joshi",
    rating: 5,
    date: "12 Jun 2025",
    comment: "Clean clinic, professional doctors, and reasonable pricing for dental fillings.",
  },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_LIST);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleReplySubmit = (id: string) => {
    if (!replyText[id]?.trim()) return;
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, reply: replyText[id] } : r))
    );
    setReplyText({ ...replyText, [id]: "" });
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Patient Reviews & Feedback</h2>
          <p className="sec-subtitle">View and respond to online patient reviews</p>
        </div>
      </div>

      <div className="sec-reviews-list">
        {reviews.map((r) => (
          <div key={r.id} className="sec-review-card-full">
            <div className="sec-review-header">
              <strong>{r.patientName}</strong>
              <span className="sec-review-stars">{renderStars(r.rating)}</span>
              <span className="sec-review-date">{r.date}</span>
            </div>
            <p className="sec-review-body">{r.comment}</p>

            {r.reply ? (
              <div className="sec-review-reply">
                <strong>Response from clinic:</strong>
                <p>{r.reply}</p>
              </div>
            ) : (
              <div className="sec-review-reply-form">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText[r.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [r.id]: e.target.value })
                  }
                />
                <button onClick={() => handleReplySubmit(r.id)}>Reply</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
