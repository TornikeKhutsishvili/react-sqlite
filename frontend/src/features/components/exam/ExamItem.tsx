import React from "react";
import type { IExam } from "../../../core/interfaces/exam.interfaces";

interface ExamItemProps {
  exam: IExam;
  removeExam: (id:number) => void;
}

const ExamItem: React.FC<ExamItemProps> = ({ exam, removeExam }) => {
  return (
    <>
      <li key={exam.id} className="border rounded-md p-3 flex items-center justify-between">
        <div>
          <p className="font-medium">{exam.name}</p>
          <p className="text-sm text-gray-500">
            {exam.date}{" "}
            {exam.time_from && `· ${exam.time_from}-${exam.time_to}`}
          </p>
        </div>
        <button type="button" onClick={() => removeExam(exam.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          წაშლა
        </button>
      </li>
    </>
  );
};

export default ExamItem