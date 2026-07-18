"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(props.value || props.defaultValue || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const calculateStrength = (pass: string) => {
      let score = 0;
      if (pass.length > 7) score += 1;
      if (pass.length > 10) score += 1;
      if (/[A-Z]/.test(pass)) score += 1;
      if (/[0-9]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;
      return Math.min(4, score);
    };

    const strength = calculateStrength(value as string);

    return (
      <div className="space-y-2 w-full">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-[#FF5C73] focus:ring-1 focus:ring-[#FF5C73] outline-none transition-all text-sm",
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {showStrength && (value as string).length > 0 && (
          <div className="space-y-1.5 animate-in fade-in">
            <div className="flex gap-1 h-1.5 w-full">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-full flex-1 rounded-full transition-colors",
                    strength >= level
                      ? strength < 2
                        ? "bg-red-400"
                        : strength < 3
                        ? "bg-amber-400"
                        : strength < 4
                        ? "bg-emerald-400"
                        : "bg-emerald-500"
                      : "bg-slate-100"
                  )}
                />
              ))}
            </div>
            <p className="text-[10px] font-medium text-slate-500 text-right">
              {strength < 2 && "Weak"}
              {strength === 2 && "Fair"}
              {strength === 3 && "Good"}
              {strength >= 4 && "Strong"}
            </p>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
