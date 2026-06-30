import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/States';
import { Trash2, UserCheck, UserX, Shield } from 'lucide-react';
import type { User as ApiUser } from '@/types/api';

export const UserManager: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { users, isLoading, isError, error, refetch, updateUser, deleteUser } = useUsers();
  
  // Confirmation Modal state
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);

  const handleToggleStatus = async (user: ApiUser) => {
    if (user.id === currentUser?.id) {
      alert("You cannot deactivate your own account.");
      return;
    }
    try {
      await updateUser({
        id: user.id,
        data: { is_active: !user.is_active }
      });
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  if (isLoading) {
    return <SkeletonCard count={3} />;
  }

  if (isError) {
    return <ErrorState message={error?.message || 'Failed to load users.'} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-border pb-5">
        <h1 className="text-3xl font-display font-bold tracking-tight">User Accounts Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Activate, deactivate, and delete user profiles for the ATR studio platform.
        </p>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No Registered Users" description="No accounts are registered in the system yet." />
      ) : (
        <div className="bg-card border border-border/80 rounded-card overflow-hidden shadow-universal">
          <div className="divide-y divide-border/80">
            {users.map((user) => {
              const isSelf = user.id === currentUser?.id;
              return (
                <div key={user.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3.5">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="h-10 w-10 rounded-full object-cover border border-border/80" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center font-display font-bold text-muted-foreground uppercase text-sm">
                        {user.full_name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground">{user.full_name}</h4>
                        {isSelf && (
                          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-medium">You</span>
                        )}
                        {user.role === 'ADMIN' && (
                          <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded font-medium">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Status Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border mr-2 uppercase ${
                      user.is_active 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>

                    {/* Toggle Activation Button */}
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={isSelf}
                      className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                        user.is_active 
                          ? 'text-rose-600 hover:bg-rose-500/10 border-rose-500/10 disabled:opacity-50' 
                          : 'text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/10 disabled:opacity-50'
                      }`}
                      title={user.is_active ? 'Deactivate User Account' : 'Activate User Account'}
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="w-4 h-4" /> Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" /> Activate
                        </>
                      )}
                    </button>

                    {/* Delete Account Button */}
                    <button
                      onClick={() => setUserToDelete(user)}
                      disabled={isSelf}
                      className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-xl border border-border/80 disabled:opacity-50 transition-all"
                      title="Delete User Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {userToDelete && (
        <ConfirmationModal
          isOpen={!!userToDelete}
          title="Delete User Account"
          message={`Are you absolutely sure you want to delete ${userToDelete.full_name}'s account? This will permanently remove all progress, quiz scores, and attempts and cannot be undone.`}
          confirmLabel="Delete Account"
          onConfirm={handleDeleteConfirm}
          onClose={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};
