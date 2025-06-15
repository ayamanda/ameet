import { UserProfile } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDialog = ({ isOpen, onClose }: UserProfileDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-white/10 bg-slate-900/80 p-0 backdrop-blur-xl">
        <UserProfile 
          routing="hash"
          appearance={{
            baseTheme: undefined, // Let Clerk handle the theme based on system preference
            variables: {
              colorPrimary: "#3b82f6",
              colorText: "white",
              colorTextSecondary: "rgba(255, 255, 255, 0.7)",
              colorBackground: "transparent"
            },
            elements: {
              card: "bg-transparent shadow-none border-0",
              navbar: "hidden",
              pageScrollBox: "bg-transparent px-4 sm:px-6",
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
              avatarImageActionsRemove: "text-red-500 hover:text-red-400",
              badge: "bg-slate-800/50 text-white",
              alertText: "text-white",
              identityPreviewText: "text-white",
              formFieldHintText: "text-white/50",
              formFieldInputShowPasswordButton: "text-white/50 hover:text-white",
              formFieldInputCopyButton: "text-blue-500 hover:text-blue-400",
              footerActionLink: "text-blue-500 hover:text-blue-400",
              footerActionText: "text-white/70",
              profileSectionPrimaryButton: "bg-blue-500 hover:bg-blue-600",
              profileSectionDestructiveButton: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
              navbarMobileMenuButton: "text-white/70 hover:text-white",
              organizationSwitcherTrigger: "bg-slate-800/50 border-white/10",
              formFieldWarningText: "text-amber-500",
              otpCodeFieldInput: "bg-slate-800/50 border-white/10 text-white"
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog; 