import { ProfileForm } from "@/features/profile/profile-form";

export default function LandlordProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account </p>
      </div>
      <ProfileForm />
    </div>
  );
}
