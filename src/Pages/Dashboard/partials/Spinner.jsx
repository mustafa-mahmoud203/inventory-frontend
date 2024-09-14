import React from 'react';

function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}

export default Spinner;
