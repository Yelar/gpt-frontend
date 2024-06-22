// components/RoadmapItem.tsx

import React from 'react';

type RoadmapProps = {
  message: string;
};

const Roadmap: React.FC<RoadmapProps> = ( {message}) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg max-w-sm w-full">
      <ul className="list-disc list-inside space-y-2">
        {message}
      </ul>
    </div>
  );
};

export default Roadmap;
