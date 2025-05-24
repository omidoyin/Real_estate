'use client';

import NextHeader from '../../components/Shared/NextHeader';
import NextFooter from '../../components/Shared/NextFooter';

export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NextHeader />
      <main className="flex-grow bg-background">
        {children}
      </main>
      <NextFooter />
    </div>
  );
}
