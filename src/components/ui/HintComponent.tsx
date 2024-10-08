import React, { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

const HintComponent = ({
  show,
  onClose,
  question,
  attemptedAnswers,
  remainingAnswers,
}: {
  mcqId: string;
  show: boolean;
  onClose: () => void;
  question: string;
  attemptedAnswers: string[];
  remainingAnswers: string[];
}) => {
  const [hint, setHint] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHint = useCallback(() => {
    setLoading(true);
    fetch(`/api/hint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        attemptedAnswers,
        remainingAnswers,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hint) {
          setHint(data.hint);
        } else {
          console.error("Unexpected response format:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hint:", error);
        setLoading(false);
      });
  }, [question, attemptedAnswers, remainingAnswers]);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 50);
      if (!hint) {
        fetchHint();
      }
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [show, fetchHint, hint]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-secondary border-2 shadow-lg z-50 p-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-base-100 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold">Smart Hint</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-600 mb-5">{question}</h3>
      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="skeleton h-20 w-full mb-4"></div>
        ) : (
          <p className="text-gray-700">{hint}</p>
        )}
      </div>
    </div>
  );
};

export default HintComponent;
