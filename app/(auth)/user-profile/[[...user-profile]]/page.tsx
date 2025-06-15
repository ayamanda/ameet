import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <UserProfile 
        appearance={{
          baseTheme: undefined, // Let Clerk handle the theme based on system preference
          variables: {
            colorPrimary: "#3b82f6",
            colorText: "white",
            colorTextSecondary: "rgba(255, 255, 255, 0.7)",
            colorBackground: "rgb(15, 23, 42)"
          },
          elements: {
            card: "bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl",
            navbar: "hidden",
            pageScrollBox: "bg-transparent",
            formFieldInput: "bg-slate-800/50 border-white/10 text-white",
            formFieldLabel: "text-white/70",
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
            formButtonReset: "hover:bg-white/10",
            formFieldSuccessText: "text-emerald-500",
            formFieldErrorText: "text-red-500",
            dividerLine: "bg-white/10",
            dividerText: "text-white/50",
            headerTitle: "text-white",
            headerSubtitle: "text-white/70",
            profileSectionTitleText: "text-white/90",
            accordionTriggerButton: "hover:bg-white/5",
            profileSectionContent: "gap-6",
            navbarButton: "text-white/70 hover:text-white hover:bg-white/10",
            navbarButtonIcon: "text-white/70 group-hover:text-white",
            avatarImageActionsUpload: "text-blue-500 hover:text-blue-400",
            avatarImageActionsRemove: "text-red-500 hover:text-red-400"
          }
        }}
      />
    </div>
  );
};

export default UserProfilePage; 