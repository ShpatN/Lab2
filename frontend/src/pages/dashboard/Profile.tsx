import { useAuth } from "@/context/AuthContext";
import { authAppRole, authAvatarUrl, authDisplayName } from "@/lib/authUser";

const Profile = () => {
  const { user } = useAuth();
  if (!user) return null;

  const name = authDisplayName(user);
  const role = authAppRole(user);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold">My Profile</h1>
      <div className="glass rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <img src={authAvatarUrl(user)} alt="" className="w-20 h-20 rounded-full border-2 border-primary/50" />
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-semibold capitalize">{role}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input type="text" defaultValue={name} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <input type="tel" defaultValue="" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+383 44 ..." />
          </div>
          <button className="gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
