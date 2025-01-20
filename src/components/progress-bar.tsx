import React from "react";

type ProgressBarProps = {
  totalTasks: number;
  completedTasks: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ totalTasks, completedTasks }) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seu Progresso</h2>
      <p className="text-gray-600">
        Você completou {progress.toFixed(0)}% dos seus objetivos!
      </p>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;