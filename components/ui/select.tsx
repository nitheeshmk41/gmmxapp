import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const Select = ({ value, onValueChange, children }: { value?: string, onValueChange?: (v: string) => void, children: React.ReactNode }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  return (
    <div className="relative w-full">
      <select
        value={context.value}
        onChange={(e) => context.onValueChange?.(e.target.value)}
        className={cn(
          "block h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF5C73] disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1.25rem",
          backgroundRepeat: "no-repeat",
          paddingRight: "2.5rem"
        }}
      >
        {children}
      </select>
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return null;
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
}

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement> & { value: string }
>(({ className, children, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("bg-zinc-950 text-white", className)}
    {...props}
  >
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
