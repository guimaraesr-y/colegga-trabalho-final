import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex items-center">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-500 border-solid rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-gray-600">Carregando...</span>
      </div>
    </div>
  );
};

export default Loading;