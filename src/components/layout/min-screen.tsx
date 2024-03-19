import React from 'react';

const MinScreen = (
  { children }: { children: React.ReactNode; }
) => {
  return (
    <div className="flex min-h-scrn flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 bg-black/30">
        {children}
      </div>
    </div>
  );
};

export default MinScreen;