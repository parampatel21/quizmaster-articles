import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type Submission = {
  id: number;
  selected_answer: number;
  is_correct: boolean;
  submitted_at: string;
};

const SubmissionHistory = ({
  mcqId,
  show,
  onClose,
}: {
  mcqId: string;
  show: boolean;
  onClose: () => void;
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (show) {
      // Fetch submission history from the API
      fetch(`/api/mcq/${mcqId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.submissions)) {
            setSubmissions(data.submissions);
          } else {
            console.error("Unexpected response format:", data);
          }
        })
        .catch((error) => console.error("Error fetching submissions:", error));
    }
  }, [show, mcqId]);

  if (!show) return null;

  return (
    <div className="fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-base-300 border-2 shadow-lg z-50 p-4 rounded-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Submission History</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="overflow-y-auto flex-grow">
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
                <td>{submission.selected_answer}</td>
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
      </div>
    </div>
  );
};

export default SubmissionHistory;
