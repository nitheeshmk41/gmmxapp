import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gym ROI Calculator | Free Tool by GMMX",
  description: "Calculate your gym's potential revenue, profit margins, and the exact ROI of upgrading to a gym management software like GMMX.",
};

export default function GymROICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
