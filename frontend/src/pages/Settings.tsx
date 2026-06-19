import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import CustomButton from '../components/CustomButton';
import {
  User,
  Users,
  Award,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  authService,
  skillService,
  UserResponse,
  SkillItem
} from '../services/api';

export default function Settings() {
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const initialName = localStorage.getItem('userName') || userEmail.split('@')[0];
  const userIdStr = localStorage.getItem('userId') || '1';
  const currentUserId = parseInt(userIdStr, 10);

  // Profile Form State
  const [userName, setUserName] = useState(initialName);
  const [email, setEmail] = useState(userEmail);
  const [successMsg, setSuccessMsg] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'skills'>('profile');

  // Lists from APIs
  const [usersList, setUsersList] = useState<UserResponse[]>([]);
  const [skillsList, setSkillsList] = useState<SkillItem[]>([]);

  // Form State for Adding Skill
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  // Loading / Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch data depending on active tab
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'skills') {
      loadSkills();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await authService.getAll();
      setUsersList(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSkills = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await skillService.getAll();
      // Filter skills belonging to the current user
      const userSkills = data.filter((s) => s.userId === currentUserId);
      setSkillsList(userSkills);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load skill inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', email);
    setSuccessMsg('Profile info updated successfully in local session!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      await skillService.create(newSkillName.trim(), newSkillLevel, currentUserId);
      setNewSkillName('');
      setSuccessMsg('Skill added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadSkills();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to add skill.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId?: number) => {
    if (!skillId) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      await skillService.delete(skillId);
      setSuccessMsg('Skill removed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadSkills();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to delete skill.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Settings & Workspace"
        description="Configure your user profile, inspect the system user directory, and manage your core technical skill inventory."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation panel */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
              activeTab === 'profile'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/15 shadow-sm'
                : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>Profile Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
              activeTab === 'users'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/15 shadow-sm'
                : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            <span>User Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
              activeTab === 'skills'
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/15 shadow-sm'
                : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Award className="h-4.5 w-4.5" />
            <span>Skill Inventory</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 glassmorphism p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          {/* Notification Messages */}
          {successMsg && (
            <div className="flex items-center space-x-2 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-sm animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-2 p-4 rounded-xl bg-red-950/25 border border-red-550/20 text-red-400 text-sm animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-400" />
                <span>Edit Profile Info</span>
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Workspace Role
                  </label>
                  <select className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-slate-100 outline-none transition-all focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer">
                    <option value="developer">Software Engineer</option>
                    <option value="lead">Technical Lead</option>
                    <option value="architect">Solutions Architect</option>
                    <option value="manager">Engineering Manager</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-900/80 flex justify-end">
                  <CustomButton type="submit">
                    Save Changes
                  </CustomButton>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: User Directory (List Users) */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>System User Directory</span>
                </h2>
                <button
                  onClick={loadUsers}
                  disabled={isLoading}
                  className="text-xs text-blue-400 hover:underline flex items-center"
                >
                  {isLoading && <Loader2 className="animate-spin h-3.5 w-3.5 mr-1" />}
                  Refresh Directory
                </button>
              </div>

              {isLoading && usersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-slate-400 text-xs">Loading registered users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-3.5">User ID</th>
                        <th className="px-6 py-3.5">Full Name</th>
                        <th className="px-6 py-3.5">Email Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-sm text-slate-350">
                      {usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-400 text-xs">{user.id}</td>
                          <td className="px-6 py-4 font-bold text-white">{user.fullName}</td>
                          <td className="px-6 py-4 text-slate-300">{user.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Skill Inventory (List and Create/Delete Skills) */}
          {activeTab === 'skills' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Skill Creation Form */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-400" />
                  <span>Register Technical Skill</span>
                </h2>
                <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-900/20 p-5 rounded-xl border border-slate-800/60">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. React, Spring Boot, MySQL"
                      className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none transition-all appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !newSkillName.trim()}
                    className="accent-gradient hover:opacity-95 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center transition-all disabled:opacity-50 h-[42px]"
                  >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-1" /> : 'Register Skill'}
                  </button>
                </form>
              </div>

              {/* Skills Listing */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-base">Your Registered Skill Inventory</h3>
                  <button
                    onClick={loadSkills}
                    disabled={isLoading}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Refresh List
                  </button>
                </div>

                {isLoading && skillsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-400 mb-2" />
                    <p className="text-slate-400 text-xs">Loading skill list...</p>
                  </div>
                ) : skillsList.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-3.5">Skill Name</th>
                          <th className="px-6 py-3.5">Experience Level</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-sm text-slate-350">
                        {skillsList.map((skill) => (
                          <tr key={skill.id} className="hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-white">{skill.skillName}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                skill.skillLevel === 'Advanced'
                                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                  : skill.skillLevel === 'Intermediate'
                                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                              }`}>
                                {skill.skillLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="text-red-400 hover:text-red-300 font-bold inline-flex items-center text-xs group"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    No registered skills in your inventory yet. Add your first skill using the form above.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
