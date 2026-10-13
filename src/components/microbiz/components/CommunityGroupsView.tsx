import { FC, useState } from 'react';
import { CommunityGroup, CollaborativeProject, MentorshipListing } from '../types/microbizTypes';
import { INITIAL_GROUPS, INITIAL_PROJECTS } from '../data/initialMicroBizData';
import { 
  Users, 
  Target, 
  Award, 
  Plus, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Send, 
  Tag, 
  MapPin, 
  ArrowRight,
  HandHeart,
  Calendar,
  Check
} from 'lucide-react';

interface CommunityGroupsViewProps {
  searchQuery: string;
  currentLanguage?: string;
}

export const CommunityGroupsView: FC<CommunityGroupsViewProps> = ({
  searchQuery,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [activeTab, setActiveTab] = useState<'groups' | 'projects' | 'mentors'>('groups');
  const [groups, setGroups] = useState<CommunityGroup[]>(INITIAL_GROUPS);
  const [projects, setProjects] = useState<CollaborativeProject[]>(INITIAL_PROJECTS);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set(['grp_artisan_eco']));
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [discussionReply, setDiscussionReply] = useState<string>('');
  const [appliedPosition, setAppliedPosition] = useState<Record<string, boolean>>({});

  // Mentorship Directory Mock Data
  const mentors: MentorshipListing[] = [
    {
      id: 'm1',
      mentorId: 'user_an_nguyen',
      mentorName: 'An Nguyễn',
      mentorRole: 'Master Bamboo Artisan (14 yrs exp)',
      expertiseAreas: ['Sustainable Material Sourcing', 'Workshop Ergonomics', 'Batch Quality Control'],
      languages: ['Tiếng Việt', 'English'],
      availabilityDesc: 'Available for 30-min weekly advisory on Wednesdays.',
      isAvailable: true
    },
    {
      id: 'm2',
      mentorId: 'user_mai_le',
      mentorName: 'Mai Lê',
      mentorRole: 'Food Biologist & Fermentation Entrepreneur',
      expertiseAreas: ['Food Safety Licensing', 'Glass & Natural Packaging', 'Local Farmer Contracts'],
      languages: ['Tiếng Việt'],
      availabilityDesc: 'Open for peer review of hygiene SOPs & local supply agreements.',
      isAvailable: true
    },
    {
      id: 'm3',
      mentorId: 'user_minh_tran',
      mentorName: 'Minh Trần',
      mentorRole: 'Independent Electronic Technician & Repair Mentor',
      expertiseAreas: ['Component Diagnostics', 'Soldering & Wire Safety', 'Scrap Recovery'],
      languages: ['Tiếng Việt', 'English'],
      availabilityDesc: 'Weekend community repair cafe mentor.',
      isAvailable: true
    }
  ];

  const handleToggleJoinGroup = (groupId: string) => {
    const next = new Set(joinedGroupIds);
    if (next.has(groupId)) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    setJoinedGroupIds(next);
  };

  const handleAddDiscussionReply = (discussionId: string) => {
    if (!discussionReply.trim() || !selectedGroup) return;
    const updatedDiscussions = selectedGroup.discussions.map(d => {
      if (d.id === discussionId) {
        return { ...d, repliesCount: d.repliesCount + 1 };
      }
      return d;
    });

    const updatedGroup = { ...selectedGroup, discussions: updatedDiscussions };
    setSelectedGroup(updatedGroup);
    setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    setDiscussionReply('');
  };

  const handleApplyPosition = (projectId: string, position: string) => {
    setAppliedPosition(prev => ({ ...prev, [`${projectId}_${position}`]: true }));
  };

  const filteredGroups = groups.filter(g => 
    !searchQuery || 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(p =>
    !searchQuery ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            {isVi ? 'Cộng Đồng Hợp Tác & Đồng Hành' : 'Community & Mutual Aid'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isVi 
              ? 'Kết nối các nhóm cùng nghề, chia sẻ công cụ và tham gia các dự án chung.' 
              : 'Collaborate with fellow makers, share tools, and build collective livelihoods.'}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('groups'); setSelectedGroup(null); }}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'groups' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isVi ? 'Nhóm Cộng Đồng' : 'Groups'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('projects'); setSelectedGroup(null); }}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{isVi ? 'Dự Án Chung' : 'Projects'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('mentors'); setSelectedGroup(null); }}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'mentors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HandHeart className="w-3.5 h-3.5" />
            <span>{isVi ? 'Cố Vấn Đồng Hành' : 'Mentors'}</span>
          </button>
        </div>
      </div>

      {/* 1. GROUPS TAB */}
      {activeTab === 'groups' && !selectedGroup && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map(grp => {
            const isJoined = joinedGroupIds.has(grp.id);

            return (
              <div 
                key={grp.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      {grp.category}
                    </span>
                    {grp.locality && (
                      <span className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
                        <MapPin className="w-3 h-3" />
                        <span>{grp.locality}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 font-serif">
                    {grp.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {grp.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {grp.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>{grp.membersCount} {isVi ? 'thành viên' : 'members'}</span>
                    <span>{grp.discussions.length} {isVi ? 'thảo luận' : 'threads'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleJoinGroup(grp.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${
                        isJoined 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <span>{isJoined ? (isVi ? '✓ Đã Tham Gia' : '✓ Joined') : (isVi ? 'Tham Gia Nhóm' : 'Join Group')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGroup(grp)}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      {isVi ? 'Xem Thảo Luận' : 'View Threads'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GROUP DISCUSSION THREAD DETAIL */}
      {activeTab === 'groups' && selectedGroup && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setSelectedGroup(null)}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                ←
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  {selectedGroup.name}
                </h2>
                <p className="text-xs text-slate-500">{selectedGroup.category} • {selectedGroup.membersCount} members</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleJoinGroup(selectedGroup.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                joinedGroupIds.has(selectedGroup.id)
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {joinedGroupIds.has(selectedGroup.id) ? '✓ Joined' : 'Join Group'}
            </button>
          </div>

          <div className="space-y-4">
            {selectedGroup.discussions.map(disc => (
              <div key={disc.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-slate-900">{disc.authorName}</span>
                    <span className="text-slate-400 font-mono">• {disc.createdAt}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {disc.repliesCount} {isVi ? 'phản hồi' : 'replies'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {disc.title}
                </h3>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {disc.body}
                </p>

                {/* Reply Input Box */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <input
                    type="text"
                    value={discussionReply}
                    onChange={(e) => setDiscussionReply(e.target.value)}
                    placeholder={isVi ? 'Chia sẻ ý kiến hoặc đề xuất giúp đỡ...' : 'Write an answer or offer to help...'}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDiscussionReply(disc.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Gửi' : 'Reply'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. COLLABORATIVE PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map(proj => (
            <div 
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                    {proj.status.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 font-serif mt-2">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Initiated by {proj.initiatorName} • Deadline: {proj.targetDeadline}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {proj.description}
              </p>

              {/* Tasks Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
                  {isVi ? 'Tiến Độ Đầu Việc' : 'Task Milestones'}
                </h4>
                <div className="space-y-1.5 text-xs">
                  {proj.tasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between text-slate-700">
                      <div className="flex items-center space-x-2">
                        {t.status === 'completed' ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span>{t.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.assigneeName ? `@${t.assigneeName}` : 'Unassigned'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Positions / Collaboration Call */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-800">
                  {isVi ? 'Vị Trí Đang Cần Cộng Tác Viên:' : 'Open Collaboration Calls:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {proj.openPositions.map((pos, pIdx) => {
                    const isApplied = appliedPosition[`${proj.id}_${pos}`];

                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPosition(proj.id, pos)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isApplied ? <Check className="w-3 h-3 text-emerald-700" /> : <Plus className="w-3 h-3 text-emerald-700" />}
                        <span>{pos} {isApplied ? (isVi ? '(Đã Đăng Ký)' : '(Registered)') : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. MENTORSHIP DIRECTORY TAB */}
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mentors.map(mentor => (
            <div 
              key={mentor.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-serif font-black text-lg flex items-center justify-center shadow-md">
                  {mentor.mentorName.charAt(0)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {mentor.mentorName}
                  </h3>
                  <p className="text-xs text-slate-500">{mentor.mentorRole}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
                  {mentor.availabilityDesc}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {isVi ? 'Thế Mạnh Hướng Dẫn' : 'Expertise Areas'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertiseAreas.map((area, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(isVi ? `Đã gửi lời nhắn kết nối đến cố vấn ${mentor.mentorName}!` : `Advisory request sent to mentor ${mentor.mentorName}!`)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
              >
                <HandHeart className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isVi ? 'Đặt Lịch Hỏi Cố Vấn' : 'Request Advisory Session'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
