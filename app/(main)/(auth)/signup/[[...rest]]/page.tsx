import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center py-4">
      <SignUp 
        path="/signup"
        signInUrl="/signin"
        forceRedirectUrl="/onboarding"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#FF5C73] hover:bg-rose-600 text-white transition-all',
            footerActionLink: 'text-[#FF5C73] hover:text-rose-600 font-bold',
            card: 'shadow-none border-0 p-0 w-full',
            headerTitle: 'text-2xl font-black text-slate-950 tracking-tight',
            headerSubtitle: 'text-[15px] leading-relaxed text-slate-500 font-medium',
          }
        }}
      />
    </div>
  );
}
