"use client";

import { createContext, useContext, ReactNode } from "react";

interface SubscriptionContextType {
  isFrozen: boolean;
  isTrial: boolean;
  daysLeft: number;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isFrozen: false,
  isTrial: false,
  daysLeft: 0,
});

export function SubscriptionProvider({
  children,
  isFrozen,
  isTrial,
  daysLeft,
}: {
  children: ReactNode;
  isFrozen: boolean;
  isTrial: boolean;
  daysLeft: number;
}) {
  return (
    <SubscriptionContext.Provider value={{ isFrozen, isTrial, daysLeft }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
