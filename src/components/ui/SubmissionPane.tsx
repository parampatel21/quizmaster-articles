import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type Submission = {
  id: number;
  selected_answer: string;
  is_correct: boolean;
  submitted_at: string;
};

const SubmissionPane = ({
  mcqId,
  show,
  onClose,
  question,
}: {
  mcqId: string;
  show: boolean;
  onClose: () => void;
  question: string;
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 50);

      // Fetch submission history from the API
      fetch(`/api/mcq/${mcqId}`)
        .then((res) => {
          if (res.status === 404) {
            console.log(`No submissions found for mcq_id: ${mcqId}`);
            return { submissions: [] };
          }
          if (!res.ok) {
            throw new Error("Unexpected response status");
          }
          return res.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.submissions)) {
            setSubmissions(data.submissions);
          } else {
            console.error("Unexpected response format:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching submissions:", error);
        });
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300); // Match this with the transition duration
    }
  }, [show, mcqId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match this with the transition duration
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-neutral border-2 shadow-lg z-50 p-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-base-100  ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold">Submission History</h2>
        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <h3 className="text-sm font-semibold text-gray-600 mb-5">{question}</h3>
      <div className="overflow-y-auto flex-grow">
        {submissions.length === 0 ? (
          <p className="text-center text-gray-500">No submissions available.</p>
        ) : (
          <table className="table w-full table-xs">
            <thead className="sticky top-0 bg-base-100 shadow-sm z-10">
              <tr>
                <th>#</th>
                <th>Selected Answer</th>
                <th>Correct</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission.id} className="hover:bg-base-200">
                  <th>{index + 1}</th>
                  <td>
                    {submission.selected_answer.length > 20
                      ? submission.selected_answer.slice(0, 17) + "..."
                      : submission.selected_answer}
                  </td>
                  <td
                    className={
                      submission.is_correct ? "text-success" : "text-error"
                    }
                  >
                    {submission.is_correct ? "Yes" : "No"}
                  </td>
                  <td>{new Date(submission.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubmissionPane;
