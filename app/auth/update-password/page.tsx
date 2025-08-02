import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-sm sm:max-w-md">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
