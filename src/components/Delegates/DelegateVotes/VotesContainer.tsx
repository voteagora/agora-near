"use client";

import React from "react";

const VotesContainer = ({
  onchainVotes,
}: {
  onchainVotes: React.ReactElement;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between items-center relative">
        <h2 className="text-primary text-2xl font-bold flex-grow">
          Past Votes
        </h2>
      </div>
      <div className="block">{onchainVotes}</div>
    </div>
  );
};

export default VotesContainer;
