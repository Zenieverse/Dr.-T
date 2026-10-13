import { FC, useState } from 'react';
import { MicroBizPost, PostCategory, ReactionType, MicroBizProfile } from '../types/microbizTypes';
import { MicroBizService } from '../services/microbizService';
import { 
  Heart, 
  ThumbsUp, 
  Sparkles, 
  Lightbulb, 
  HandHeart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Send, 
  Plus, 
  Flag, 
  UserPlus, 
  UserCheck, 
  Check, 
  ExternalLink,
  Filter
} from 'lucide-react';

interface DiscoveryFeedProps {
  posts: MicroBizPost[];
  setPosts: (posts: MicroBizPost[]) => void;
  searchQuery: string;
  currentLanguage?: string;
  currentUser?: MicroBizProfile;
  isAuthenticated?: boolean;
}

export const DiscoveryFeed: FC<DiscoveryFeedProps> = ({
  posts,
  setPosts,
  searchQuery,
  currentLanguage = 'en',
  currentUser,
  isAuthenticated = false
}) => {
  const isVi = currentLanguage === 'vi';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set(currentUser?.followingUserIds || []));
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(currentUser?.bookmarkedPostIds || []));
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  
  // Post Creator State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<PostCategory>('learning_story');
  const [newTags, setNewTags] = useState('MadeForAll, SkillShare');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Reporting State
  const [reportingPost, setReportingPost] = useState<MicroBizPost | null>(null);
  const [reportReason, setReportReason] = useState<'misleading_claims' | 'unsolicited_spam' | 'inappropriate_content' | 'other'>('misleading_claims');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Reaction Trigger
  const handleReact = async (postId: string, type: ReactionType) => {
    const updated = await MicroBizService.reactToPost(postId, type);
    setPosts(updated);
  };

  // Follow Toggle
  const toggleFollow = (authorId: string) => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (next.has(authorId)) {
        next.delete(authorId);
      } else {
        next.add(authorId);
      }
      return next;
    });
  };

  // Bookmark Toggle
  const toggleBookmark = (postId: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Submit Comment
  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    const updated = await MicroBizService.addComment(postId, commentText.trim());
    setPosts(updated);
    setCommentText('');
    setActiveCommentPostId(null);
  };

  // Submit New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setIsSubmittingPost(true);

    try {
      const tagsArray = newTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
      const created = await MicroBizService.createPost({
        authorId: currentUser?.id || MicroBizService.getCurrentUserId(),
        authorName: currentUser?.name || (isVi ? 'Thành viên cộng đồng' : 'Community Member'),
        authorHandle: currentUser?.handle || '@community',
        authorRole: currentUser?.role === 'creator' ? 'Artisan / Maker' : 'Community Member',
        title: newTitle.trim() || undefined,
        content: newContent.trim(),
        category: newCategory,
        tags: tagsArray,
        language: isVi ? 'vi' : 'en',
        imageUrl: newImageUrl.trim() || undefined,
        learningResourceLink: newResourceLink.trim() || undefined
      });

      setPosts([created, ...posts]);
      setNewTitle('');
      setNewContent('');
      setNewImageUrl('');
      setNewResourceLink('');
      setIsComposerOpen(false);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Submit Report
  const handleSubmitReport = async () => {
    if (!reportingPost) return;
    await MicroBizService.submitReport({
      targetType: 'post',
      targetId: reportingPost.id,
      targetTitle: reportingPost.title || reportingPost.content.slice(0, 40),
      reporterUserId: currentUser?.id || MicroBizService.getCurrentUserId(),
      reason: reportReason,
      notes: reportNotes
    });
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportingPost(null);
      setReportNotes('');
    }, 1500);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = post.title?.toLowerCase().includes(q) || false;
      const inContent = post.content.toLowerCase().includes(q);
      const inAuthor = post.authorName.toLowerCase().includes(q);
      const inTags = post.tags.some(t => t.toLowerCase().includes(q));
      return inTitle || inContent || inAuthor || inTags;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: isVi ? 'Tất cả' : 'All Updates' },
    { id: 'learning_story', label: isVi ? 'Câu chuyện học tập' : 'Learning Stories' },
    { id: 'skill_tip', label: isVi ? 'Mẹo kỹ năng' : 'Skill Tips' },
    { id: 'project_update', label: isVi ? 'Tiến độ dự án' : 'Project Updates' },
    { id: 'collaboration_call', label: isVi ? 'Tìm cộng sự' : 'Collaboration Calls' }
  ];

  return (
    <div className="space-y-6">
      {/* Feed Action Bar & Category Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-700 uppercase tracking-wider">
              {isVi ? 'Lọc theo chủ đề:' : 'Filter Topics:'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsComposerOpen(prev => !prev)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isVi ? 'Chia sẻ câu chuyện hoặc mẹo kỹ năng' : 'Share a Story or Skill Tip'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold border border-emerald-300/80 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post Composer Drawer / Modal */}
      {isComposerOpen && (
        <form onSubmit={handleCreatePost} className="bg-white rounded-3xl border border-emerald-300/80 p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                ✍️
              </div>
              <h3 className="font-serif font-black text-sm text-slate-900">
                {isVi ? 'Tạo bài đăng cộng đồng mới' : 'Publish Community Post'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {isVi ? 'Tiêu đề (tùy chọn)' : 'Post Title (Optional)'}
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder={isVi ? 'Ví dụ: Cách chúng tôi tối ưu vật liệu...' : 'e.g. How we reduced raw material waste...'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {isVi ? 'Phân loại bài viết' : 'Category'}
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as PostCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden cursor-pointer"
              >
                <option value="learning_story">{isVi ? 'Câu chuyện học tập & kinh nghiệm' : 'Learning Story'}</option>
                <option value="skill_tip">{isVi ? 'Mẹo kỹ năng thực tiễn' : 'Practical Skill Tip'}</option>
                <option value="project_update">{isVi ? 'Tiến độ dự án hợp tác' : 'Collaborative Project Update'}</option>
                <option value="business_milestone">{isVi ? 'Cột mốc kinh doanh nhỏ' : 'Micro-Business Milestone'}</option>
                <option value="collaboration_call">{isVi ? 'Tìm cộng sự & giao lưu' : 'Call for Collaborators'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              {isVi ? 'Nội dung chia sẻ *' : 'Post Content *'}
            </label>
            <textarea
              required
              rows={4}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder={isVi ? 'Chia sẻ kiến thức, bài học thực tế, hoặc câu chuyện chân thành của bạn...' : 'Share practical knowledge, honest lessons, or collaborative ideas...'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {isVi ? 'Thẻ kỹ năng (cách nhau bằng dấu phẩy)' : 'Tags (comma separated)'}
              </label>
              <input
                type="text"
                value={newTags}
                onChange={e => setNewTags(e.target.value)}
                placeholder="SustainableCrafts, LocalTools, Bookkeeping"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {isVi ? 'Đường dẫn ảnh hoặc tài liệu tham khảo' : 'Image URL or Resource Link (Optional)'}
              </label>
              <input
                type="text"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="https://... (image or guide link)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {isVi ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmittingPost || !newContent.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingPost ? (isVi ? 'Đang đăng...' : 'Publishing...') : (isVi ? 'Đăng bài' : 'Publish')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <span className="text-3xl block">🌱</span>
            <h4 className="font-serif font-black text-slate-800 text-base">
              {isVi ? 'Chưa tìm thấy bài viết phù hợp' : 'No posts found in this category'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isVi 
                ? 'Hãy là người đầu tiên chia sẻ mẹo làm nghề, kinh nghiệm học tập, hoặc câu chuyện kinh doanh nhỏ cùng cộng đồng!' 
                : 'Be the first to share an honest lesson, maker insight, or community question!'}
            </p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isFollowing = followingIds.has(post.authorId);
            const isBookmarked = bookmarkedIds.has(post.id);
            const effectiveUid = currentUser?.id || MicroBizService.getCurrentUserId();
            const userReaction = post.userReactions?.[effectiveUid];

            return (
              <article key={post.id} className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-sm transition space-y-4">
                {/* Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center font-serif text-sm shadow-2xs shrink-0">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                        <span className="text-xs text-slate-400 font-mono">{post.authorHandle}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md border border-emerald-100 text-[10px]">
                          {post.authorRole}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-400">{post.createdAt.includes('T') ? new Date(post.createdAt).toLocaleDateString() : post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Follow */}
                  <div className="flex items-center space-x-1.5">
                    {post.authorId !== effectiveUid && (
                      <button
                        type="button"
                        onClick={() => toggleFollow(post.authorId)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                          isFollowing 
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                        }`}
                      >
                        {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isFollowing ? (isVi ? 'Đang theo dõi' : 'Following') : (isVi ? 'Theo dõi' : 'Follow')}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleBookmark(post.id)}
                      className={`p-1.5 rounded-xl transition cursor-pointer ${
                        isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isVi ? 'Lưu bài viết' : 'Bookmark post'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setReportingPost(post)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title={isVi ? 'Báo cáo vi phạm' : 'Report content'}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  {post.title && (
                    <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg leading-snug">
                      {post.title}
                    </h3>
                  )}
                  <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans">
                    {post.content}
                  </p>
                </div>

                {/* Image if available */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title || 'MicroBiz Community Image'} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 5 Real Reactions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Like */}
                    <button
                      type="button"
                      onClick={() => handleReact(post.id, 'like')}
                      className={`px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                        userReaction === 'like' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Like"
                    >
                      <span>👍</span>
                      <span>{post.reactions.like}</span>
                    </button>

                    {/* Love */}
                    <button
                      type="button"
                      onClick={() => handleReact(post.id, 'love')}
                      className={`px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                        userReaction === 'love' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Love"
                    >
                      <span>❤️</span>
                      <span>{post.reactions.love}</span>
                    </button>

                    {/* Celebrate */}
                    <button
                      type="button"
                      onClick={() => handleReact(post.id, 'celebrate')}
                      className={`px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                        userReaction === 'celebrate' ? 'bg-amber-100 text-amber-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Celebrate"
                    >
                      <span>🎉</span>
                      <span>{post.reactions.celebrate}</span>
                    </button>

                    {/* Insightful */}
                    <button
                      type="button"
                      onClick={() => handleReact(post.id, 'insightful')}
                      className={`px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                        userReaction === 'insightful' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Insightful"
                    >
                      <span>💡</span>
                      <span>{post.reactions.insightful}</span>
                    </button>

                    {/* Support */}
                    <button
                      type="button"
                      onClick={() => handleReact(post.id, 'support')}
                      className={`px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                        userReaction === 'support' ? 'bg-teal-100 text-teal-800 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Support"
                    >
                      <span>🤝</span>
                      <span>{post.reactions.support}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-500">
                    <button
                      type="button"
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center space-x-1.5 hover:text-slate-800 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments.length} {isVi ? 'bình luận' : 'comments'}</span>
                    </button>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{post.sharesCount}</span>
                    </span>
                  </div>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                    {/* Existing Comments */}
                    {post.comments.map(c => (
                      <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-150 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{c.authorName}</span>
                          <span className="text-slate-400 font-mono">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-sans">{c.content}</p>
                      </div>
                    ))}

                    {/* Comment Input */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder={isVi ? 'Viết bình luận mang tính xây dựng...' : 'Write constructive feedback or question...'}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Gửi' : 'Reply'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Community Report Modal */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
                <Flag className="w-4 h-4" />
                <span>{isVi ? 'Báo cáo vi phạm cộng đồng' : 'Report Community Content'}</span>
              </div>
              <button
                type="button"
                onClick={() => setReportingPost(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-center text-xs font-bold space-y-1">
                <span>✓ {isVi ? 'Đã gửi báo cáo đến ban điều hành MicroBiz!' : 'Report submitted to MicroBiz moderators.'}</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  {isVi 
                    ? 'MicroBiz cam kết bảo vệ không gian học tập an toàn, không có thông tin sức khỏe giả mạo hay lừa đảo tài chính.' 
                    : 'MicroBiz enforces strict boundaries against misleading claims, financial spam, and unauthorized copying.'}
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isVi ? 'Lý do báo cáo:' : 'Reason for report:'}
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="misleading_claims">{isVi ? 'Tuyên bố sai lệch hoặc thông tin sức khỏe chưa kiểm chứng' : 'Misleading claims or unverified health cures'}</option>
                    <option value="unsolicited_spam">{isVi ? 'Spam thương mại hoặc rủ rê tiền ảo' : 'Spam or unsolicited promotions'}</option>
                    <option value="inappropriate_content">{isVi ? 'Nội dung thiếu tôn trọng hoặc quấy rối' : 'Harassment or disrespectful behavior'}</option>
                    <option value="other">{isVi ? 'Lý do khác' : 'Other'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isVi ? 'Ghi chú bổ sung:' : 'Additional details:'}
                  </label>
                  <textarea
                    rows={3}
                    value={reportNotes}
                    onChange={e => setReportNotes(e.target.value)}
                    placeholder={isVi ? 'Mô tả chi tiết để điều hành viên kiểm tra...' : 'Describe why this content violates community safety...'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPost(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    {isVi ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReport}
                    className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    {isVi ? 'Gửi báo cáo' : 'Submit Report'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
