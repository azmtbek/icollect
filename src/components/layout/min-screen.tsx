import React from 'react';

const MinScreen = (
  { children }: { children: React.ReactNode; }
) => {
  return (
    <div className="flex min-h-scrn flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 rounded-xl ">
        {children}
      </div>
    </div>
  );
};

export default MinScreen;