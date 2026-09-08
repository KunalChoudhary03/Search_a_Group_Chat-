import React from 'react';

export const SimilarityScore = ({ score = 0 }) => {
  const formattedScore = Number(score).toFixed(2);
  const percentage = Math.round(Number(score) * 100);

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-800/60 border border-zinc-700/50"
      title={`Cosine Similarity: ${Number(score).toFixed(4)}`}
    >
      <span className="text-zinc-500">score:</span>
      <span className="text-zinc-200 font-semibold">{formattedScore}</span>
    </span>
  );
};

export default SimilarityScore;

