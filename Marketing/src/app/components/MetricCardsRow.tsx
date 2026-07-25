import React from 'react';
import MarketingReachCard from './MarketingReachCard';
import B2BProposalsCard from './B2BProposalsCard';
import CreateCampaignCard from './CreateCampaignCard';

export default function MetricCardsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <MarketingReachCard />
      <B2BProposalsCard />
      <CreateCampaignCard />
    </div>
  );
}