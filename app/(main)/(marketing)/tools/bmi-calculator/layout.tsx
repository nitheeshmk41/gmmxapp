import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BMI Calculator | GMMX",
  description: "Calculate your Body Mass Index (BMI) instantly with our free online tool. Perfect for fitness enthusiasts and trainers.",
};

export default function BMICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
