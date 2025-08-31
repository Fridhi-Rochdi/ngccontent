import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
              card: "bg-slate-800 border-slate-700",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-300",
              socialButtonsIconButton: "border-slate-600 hover:bg-slate-700",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-700 border-slate-600 text-white",
              footerActionLink: "text-purple-400 hover:text-purple-300"
            }
          }}
        />
      </div>
    </div>
  );
}
