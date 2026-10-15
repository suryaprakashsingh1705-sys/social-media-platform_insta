import Auth from "./Auth.jsx";    
import React, { useMemo, useState , useRef} from "react";
import {
  House,
  Search,
  Compass,
  Clapperboard,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  Instagram,
  MoreHorizontal,
  Bookmark,
  Send,
  Smile,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  UserRound,
  CircleHelp,
  Sun,
  Moon
} from "lucide-react";

const initialStories = [
  { id: 1, name: "your_story", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop", own: true },
  { id: 2, name: "ananya.jpg", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop" },
  { id: 3, name: "rohan_creates", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop" },
  { id: 4, name: "travelwithme", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=160&h=160&fit=crop" },
  { id: 5, name: "mehak.art", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop" },
  { id: 6, name: "dev_daily", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop" },
  { id: 7, name: "foodie.diary", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop" }
];

const initialPosts = [
  {
    id: 101, user: "ananya.jpg", location: "Jaipur, Rajasthan",
    avatar: initialStories[1].image,
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000&auto=format&fit=crop",
    caption: "Golden hour, quiet mind ✨", likes: 1284, liked: false, saved: false, comments: ["This light is unreal!", "Need this kind of evening 🌅"], time: "2 HOURS AGO"
  },
  {
    id: 102, user: "rohan_creates", location: "New Delhi",
    avatar: initialStories[2].image,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1000&auto=format&fit=crop",
    caption: "A little reminder to look up. 🌙", likes: 847, liked: false, saved: false, comments: ["Beautiful shot", "What camera did you use?"], time: "5 HOURS AGO"
  },
  {
    id: 103, user: "travelwithme", location: "Somewhere in the mountains",
    avatar: initialStories[3].image,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop",
    caption: "Collect moments, not things. 🏔️", likes: 2301, liked: false, saved: false, comments: ["On my bucket list!", "Take me here please"], time: "1 DAY AGO"
  }
];

const suggestions = [
  { name: "mehak.art", detail: "Followed by ananya.jpg", image: initialStories[4].image },
  { name: "dev_daily", detail: "Suggested for you", image: initialStories[5].image },
  { name: "foodie.diary", detail: "New to Instagram", image: initialStories[6].image }
];

function Avatar({ src, name, size = "normal", ring = false, onClick }) {
  return (
    <button className={`avatar ${size} ${ring ? "story-ring" : ""}`} onClick={onClick} aria-label={`${name} profile`}>
      <img src={src} alt="" />
    </button>
  );
}

function Sidebar({ active, setActive, onCreate, onProfile }) {
  const items = [
    { label: "Home", icon: House },
    { label: "Search", icon: Search },
    { label: "Explore", icon: Compass },
    { label: "Reels", icon: Clapperboard },
    { label: "Messages", icon: Send },
    { label: "Notifications", icon: Heart },
    { label: "Create", icon: PlusSquare, action: onCreate },
    { label: "Profile", icon: UserRound, action: onProfile }
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setActive("Home")} aria-label="Instagram home">
        <span className="brand-word">Instagram</span><Instagram className="brand-icon" size={27} />
      </button>
      <nav>
        {items.map(({ label, icon: Icon, action }) => (
          <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => action ? action() : setActive(label)}>
            <Icon size={24} strokeWidth={active === label ? 2.5 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="nav-item more-button" onClick={() => setActive(active === "More" ? "Home" : "More")}><Menu size={24}/><span>More</span></button>
    </aside>
  );
}

function TopBar({ active, onSearch }) {
  return (
    <header className="mobile-topbar">
      <button className="mobile-brand" aria-label="Instagram home"><Instagram size={26}/><span>Instagram</span></button>
      <div className="mobile-actions">
        <button aria-label="Search" onClick={onSearch}><Search size={23}/></button>
        <button aria-label="Notifications"><Heart size={23}/></button>
        <button aria-label="Messages"><Send size={22}/></button>
      </div>
    </header>
  );
}

function Stories({ stories, onOpen }) {
  return (
    <section className="stories" aria-label="Stories">
      {stories.map(story => (
        <button className="story" key={story.id} onClick={() => onOpen(story)}>
          <span className={`story-image ${story.own ? "own-story" : ""}`}><img src={story.image} alt="" />{story.own && <span className="add-story">+</span>}</span>
          <span className="story-name">{story.name}</span>
        </button>
      ))}
    </section>
  );
}

function Post({ post, onLike, onSave, onComment, onProfile }) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  function doubleLike() {
    if (!post.liked) onLike(post.id);
    setHeartPop(true);
    window.setTimeout(() => setHeartPop(false), 700);
  }

  function submitComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    onComment(post.id, comment.trim());
    setComment("");
    setShowComments(true);
  }

  return (
    <article className="post">
      <header className="post-header">
        <Avatar src={post.avatar} name={post.user} ring onClick={() => onProfile(post.user)} />
        <button className="post-user-info" onClick={() => onProfile(post.user)}>
          <strong>{post.user}</strong><span>{post.location}</span>
        </button>
        <button className="icon-button post-more" aria-label="More post options" onClick={() => setShowMore(!showMore)}><MoreHorizontal size={24}/></button>
        {showMore && <div className="post-menu"><button onClick={() => { onSave(post.id); setShowMore(false); }}> {post.saved ? "Remove from saved" : "Save post"} </button><button onClick={() => setShowMore(false)}>Cancel</button></div>}
      </header>
      <div className="post-image-wrap" onDoubleClick={doubleLike}>
        <img className="post-image" src={post.image} alt={`Post by ${post.user}`} />
        {heartPop && <Heart className="big-heart" size={95} fill="white" stroke="white" />}
      </div>
      <div className="post-actions">
        <div className="left-actions">
          <button className={`icon-button ${post.liked ? "liked" : ""}`} aria-label={post.liked ? "Unlike post" : "Like post"} onClick={() => onLike(post.id)}><Heart size={25} fill={post.liked ? "currentColor" : "none"}/></button>
          <button className="icon-button" aria-label="View comments" onClick={() => setShowComments(!showComments)}><MessageCircle size={24}/></button>
          <button className="icon-button" aria-label="Share post" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Send size={23}/></button>
        </div>
        <button className={`icon-button ${post.saved ? "saved" : ""}`} aria-label={post.saved ? "Unsave post" : "Save post"} onClick={() => onSave(post.id)}><Bookmark size={24} fill={post.saved ? "currentColor" : "none"}/></button>
      </div>
      <div className="post-content">
        <strong className="like-count">{post.likes.toLocaleString("en-US")} likes</strong>
        <p className="caption"><strong>{post.user}</strong> {post.caption}</p>
        {post.comments.length > 0 && <button className="view-comments" onClick={() => setShowComments(!showComments)}>{showComments ? "Hide comments" : `View all ${post.comments.length} comments`}</button>}
        {showComments && <div className="comments-list">{post.comments.map((item, i) => <p key={`${post.id}-${i}`}><strong>{["pixel.pal", "you"][i % 2]}</strong> {item}</p>)}</div>}
        <p className="post-time">{post.time}</p>
      </div>
      <form className="comment-form" onSubmit={submitComment}>
        <input aria-label="Add a comment" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
        {comment.trim() && <button type="submit">Post</button>}
        <button type="button" className="emoji-button" aria-label="Add emoji" onClick={() => setComment(v => v + " 😊")}><Smile size={19}/></button>
      </form>
    </article>
  );
}

function RightRail({ onProfile }) {
  const [followed, setFollowed] = useState([]);
  return (
    <aside className="right-rail">
      <div className="my-account">
        <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop" name="your profile" size="large" onClick={() => onProfile("your_profile")} />
        <div className="account-text"><strong>your_profile</strong><span>Surya Prakash Singh</span></div>
        <button className="link-button">Switch</button>
      </div>
      <div className="suggestions-heading"><strong>Suggested for you</strong><button>See All</button></div>
      <div className="suggestions-list">
        {suggestions.map(s => <div className="suggestion" key={s.name}>
          <Avatar src={s.image} name={s.name} onClick={() => onProfile(s.name)}/>
          <div className="suggestion-info"><strong>{s.name}</strong><span>{s.detail}</span></div>
          <button className={`link-button ${followed.includes(s.name) ? "following" : ""}`} onClick={() => setFollowed(old => old.includes(s.name) ? old.filter(n => n !== s.name) : [...old, s.name])}>{followed.includes(s.name) ? "Following" : "Follow"}</button>
        </div>)}
      </div>
      <p className="footer-links">About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified</p>
      <p className="copyright">© 2026 INSTAGRAM FROM META</p>
    </aside>
  );
}

function CreateModal({ onClose, onCreate }) {    // create new post .. 
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be under 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
      setImageUrl("");
      setError("");
    };

    reader.onerror = () => {
      setError("Could not read this image.");
    };

    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();

    const image = selectedImage || imageUrl.trim();

    if (!image) {
      setError("Please select a photo or enter an image URL.");
      return;
    }

    if (!selectedImage) {
      try {
        const url = new URL(image);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setError("Enter a valid public image URL.");
        return;
      }
    }

    onCreate({
      image,
      caption: caption.trim() || "A new moment ✨",
    });

    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-title"
      >
        <header>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>

          <strong id="create-title">Create new post</strong>

          <button
            type="button"
            className="share-button"
            onClick={submit}
          >
            Share
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="upload-icon">
            <ImageIcon size={48} />
          </div>

          <h3>Add a photo to your post</h3>
          <p>Select a photo from your device or paste an image URL.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label="Choose photo"
          />

          <p>Or use a public image URL</p>

          <input
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setSelectedImage("");
              setError("");
            }}
            placeholder="https://example.com/photo.jpg"
            aria-label="Image URL"
          />

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Post preview"
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "contain",
                marginBottom: "12px",
              }}
            />
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            aria-label="Post caption"
          />

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit">
            Share post
          </button>
        </form>
      </section>
    </div>
  );
}



function StoryModal({ story, onClose, onNext, onPrevious }) {
  return <div className="story-backdrop" onClick={onClose}>
    <button className="story-close" onClick={onClose} aria-label="Close story"><X/></button>
    <button className="story-arrow left" onClick={e => {e.stopPropagation(); onPrevious();}} aria-label="Previous story"><ChevronLeft/></button>
    <div className="story-viewer" onClick={e => e.stopPropagation()}>
      <div className="story-progress"><span/></div>
      <div className="story-viewer-user"><Avatar src={story.image} name={story.name}/><strong>{story.name}</strong><span>2h</span></div>
      <img src={story.image} alt={`Story from ${story.name}`}/>
    </div>
    <button className="story-arrow right" onClick={e => {e.stopPropagation(); onNext();}} aria-label="Next story"><ChevronRight/></button>
  </div>;
}

function ExploreView({ posts, onProfile }) {
  return <section className="explore-view"><div className="explore-heading"><h2>Explore</h2><p>Discover photos and moments from the community.</p></div><div className="explore-grid">{posts.map((post, i) => <button key={post.id} onClick={() => onProfile(post.user)} className={`explore-tile tile-${i % 5}`}><img src={post.image} alt={post.caption}/><span><Heart size={18} fill="white"/> {post.likes.toLocaleString()}</span></button>)}{[...initialStories].slice(1).map((s, i) => <button key={s.id} className={`explore-tile tile-${i % 5}`} onClick={() => onProfile(s.name)}><img src={s.image.replace("160&h=160", "600&h=600")} alt={`Explore by ${s.name}`}/><span><Heart size={18} fill="white"/> {((i + 4) * 213).toLocaleString()}</span></button>)}</div></section>;
}

function ProfileView({ posts, onCreate }) {
  const [tab, setTab] = useState("posts");
  const ownPosts = posts.filter(p => p.user === "your_profile" || p.user === "you");
  return <section className="profile-view">
    <div className="profile-top"><Avatar src={initialStories[0].image} name="your profile" size="profile-avatar"/><div className="profile-details"><div className="profile-name-row"><h2>your_profile</h2><button className="secondary-button">Edit profile</button><button className="secondary-button">View archive</button><Settings size={22}/></div><div className="profile-stats"><span><strong>{ownPosts.length}</strong> posts</span><span><strong>248</strong> followers</span><span><strong>310</strong> following</span></div><strong>Surya Prakash Singh</strong><p>Building things, one line at a time ✨<br/>📍 India · Developer in progress</p></div></div>
    <div className="profile-tabs"><button className={tab === "posts" ? "selected" : ""} onClick={() => setTab("posts")}><ImageIcon size={14}/> POSTS</button><button className={tab === "saved" ? "selected" : ""} onClick={() => setTab("saved")}><Bookmark size={14}/> SAVED</button></div>
    {tab === "posts" && ownPosts.length === 0 ? <div className="empty-profile"><div className="empty-icon"><ImageIcon size={32}/></div><h2>Share your first photo</h2><p>When you share photos, they will appear on your profile.</p><button className="link-button" onClick={onCreate}>Share your first photo</button></div> : <div className="profile-grid">{(tab === "saved" ? posts.filter(p => p.saved) : ownPosts).map(p => <img key={p.id} src={p.image} alt={p.caption}/>)}</div>}
  </section>;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // auth line 
  const [posts, setPosts] = useState(initialPosts);
  const [active, setActive] = useState("Home");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const stories = initialStories;
  const filteredPosts = useMemo(() => posts.filter(p => `${p.user} ${p.caption} ${p.location}`.toLowerCase().includes(search.toLowerCase())), [posts, search]);
  if (!currentUser) {
    return (
      <Auth onLogin={(username) => setCurrentUser(username)} />
    );
  } 
  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }
  function toggleLike(id) {
    setPosts(old => old.map(p => p.id === id ? {...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1)} : p));
  }
  function toggleSave(id) {
    setPosts(old => old.map(p => p.id === id ? {...p, saved: !p.saved} : p));
    notify("Post saved state updated");
  }
  function addComment(id, comment) {
    setPosts(old => old.map(p => p.id === id ? {...p, comments: [...p.comments, comment]} : p));
  }
  function addPost({image, caption}) {
    setPosts(old => [{id: Date.now(), user: "your_profile", location: "Your profile", avatar: initialStories[0].image, image, caption, likes: 0, liked: false, saved: false, comments: [], time: "JUST NOW"}, ...old]);
    setActive("Profile");
    notify("Your demo post was added");
  }
  function openProfile(name) {
    setActive("Profile");
    if (name && name !== "your_profile") notify(`Profile preview: ${name}`);
  }
  function storyStep(direction) {
    const index = stories.findIndex(s => s.id === activeStory.id);
    setActiveStory(stories[(index + direction + stories.length) % stories.length]);
  }
  function chooseNav(label) {
    if (label === "Search") { setSearchOpen(v => !v); setActive("Home"); return; }
    if (label === "Notifications") { notify("You're all caught up ❤️"); return; }
    if (label === "Messages") { notify("Messaging will be connected in the backend step."); return; }
    if (label === "Reels") { notify("Reels page can be built in the next step."); return; }
    if (label === "More") { notify("More settings coming in a later step."); return; }
    if (label === "Explore") { setActive("Explore"); return; }
    setActive(label);
  }

  return <div className="app-shell">
    <Sidebar active={active} setActive={chooseNav} onCreate={() => setCreateOpen(true)} onProfile={() => setActive("Profile")}/>
    <TopBar active={active} onSearch={() => setSearchOpen(v => !v)}/>
    <main className={`main-content ${active !== "Home" ? "non-home" : ""}`}>
      {active === "Home" && <div className="home-layout">
        <section className="feed-column">
          {searchOpen && <div className="search-panel"><Search size={19}/><input autoFocus placeholder="Search people, captions, places..." value={search} onChange={e => setSearch(e.target.value)}/><button onClick={() => {setSearch(""); setSearchOpen(false);}} aria-label="Close search"><X size={18}/></button></div>}
          <Stories stories={stories} onOpen={setActiveStory}/>
          <div className="feed-posts">{filteredPosts.length ? filteredPosts.map(post => <Post key={post.id} post={post} onLike={toggleLike} onSave={toggleSave} onComment={addComment} onProfile={openProfile}/>) : <div className="no-results">No posts found for “{search}”.</div>}</div>
        </section>
        <RightRail onProfile={openProfile}/>
      </div>}
      {active === "Explore" && <ExploreView posts={posts} onProfile={openProfile}/>}
      {active === "Profile" && <ProfileView posts={posts} onCreate={() => setCreateOpen(true)}/>}
      {!["Home", "Explore", "Profile"].includes(active) && <div className="placeholder-view"><div className="empty-icon"><Compass size={34}/></div><h2>{active}</h2><p>This section is a frontend demo. We can build its full functionality in the next step.</p><button className="primary-button" onClick={() => setActive("Home")}>Back to Home</button></div>}
    </main>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <button className={active === "Home" ? "active" : ""} onClick={() => setActive("Home")} aria-label="Home"><House/></button>
      <button className={active === "Explore" ? "active" : ""} onClick={() => setActive("Explore")} aria-label="Explore"><Compass/></button>
      <button onClick={() => setCreateOpen(true)} aria-label="Create post"><PlusSquare/></button>
      <button onClick={() => notify("Messaging will be connected in the backend step.")} aria-label="Messages"><Send/></button>
      <button className={active === "Profile" ? "active" : ""} onClick={() => setActive("Profile")} aria-label="Profile"><img src={initialStories[0].image} alt=""/></button>
    </nav>
    {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreate={addPost}/>}
    {activeStory && <StoryModal story={activeStory} onClose={() => setActiveStory(null)} onNext={() => storyStep(1)} onPrevious={() => storyStep(-1)}/>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}
