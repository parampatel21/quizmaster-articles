// frontend for AI generated hint

import React, { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";

interface HintPaneProps {
  mcqId: string;
  show: boolean;
  onClose: () => void;
  question: string;
  attemptedAnswers: string[];
  remainingAnswers: string[];
}

const HintPane: React.FC<HintPaneProps> = ({
  show,
  onClose,
  question,
  attemptedAnswers,
  remainingAnswers,
}) => {
  const [hint, setHint] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    let isMounted = true;
    setIsVisible(true);
    setLoading(true);

    fetch(`/api/mcq/hint`, {
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
        if (isMounted && data && data.hint) {
          setHint(data.hint);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Error fetching hint:", error);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [question, attemptedAnswers, remainingAnswers, show]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-secondary border-2 shadow-lg z-50 p-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-base-100 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-pane-title"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold">Smart Hint</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <Icons.X className="w-6 h-6" />
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

export default HintPane;
