'use client';

import React from 'react';
import KeywordTable from './components/KeywordTable';
import AnalysisCard from './components/AnalysisCard';
import ActionButtons from './components/ActionButtons';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">KeywordPulse</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KeywordTable />
          <ActionButtons />
        </div>
        <div>
          <AnalysisCard />
        </div>
      </div>
    </div>
  );
} 