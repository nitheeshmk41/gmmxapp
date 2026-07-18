"use client";

import { useState } from "react";
import { PlanSelectionModal } from "./PlanSelectionModal";
import { BillingSummaryModal } from "./BillingSummaryModal";

interface UpgradeManagerProps {
  gym: any;
  currentPlan: string;
  isTrial: boolean;
  daysLeft: number;
}

export function UpgradeManager({ gym, currentPlan, isTrial, daysLeft }: UpgradeManagerProps) {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<"professional" | "enterprise">("professional");
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleSelectPlan = (plan: "professional" | "enterprise", period: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    setSelectedPeriod(period);
    setIsPlanModalOpen(false);
    
    if (plan === "professional") {
      setIsBillingModalOpen(true);
    }
    // Enterprise goes to mailto, so we don't open billing modal.
  };

  const proPrice = selectedPeriod === "monthly" ? 999 : 9990;

  return (
    <>
      <button
        onClick={() => setIsPlanModalOpen(true)}
        className="px-6 py-2.5 bg-[#FF5C73] hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        Upgrade Plan
      </button>

      <PlanSelectionModal 
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentPlan={currentPlan}
        onSelectPlan={handleSelectPlan}
      />

      {isBillingModalOpen && (
        <BillingSummaryModal 
          isOpen={isBillingModalOpen}
          onClose={() => setIsBillingModalOpen(false)}
          planName={selectedPlan}
          price={selectedPlan === "professional" ? proPrice : 0}
          period={selectedPeriod}
          gym={gym}
          isTrial={isTrial}
          daysLeft={daysLeft}
        />
      )}
    </>
  );
}
