import "./App.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./contexts/AuthContext";
import { favoritesAPI } from "./services/api";
import Login from "./components/Login";
import Register from "./components/Register";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentSection, setCurrentSection] = useState(0); // 0: hero/search, 1: favorites
  const [openMenuId, setOpenMenuId] = useState(null);
  const sectionsRef = useRef([]);
  const [visibleSections, setVisibleSections] = useState(new Set([0])); // Hero section visible on load
  const [visibleAlbums, setVisibleAlbums] = useState(new Set());
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  // Load favorites from backend when user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated()) {
        try {
          const response = await favoritesAPI.getAll();
          setFavorites(response.favorites || []);
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      } else {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get Artist Albums
    await fetch(
      "https://api.spotify.com/v1/artists/" +
      artistID +
      "/albums?include_groups=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  async function toggleFavorite(album) {
    if (!isAuthenticated()) {
      setShowLogin(true);
      return;
    }

    const isFav = favorites.some(fav => fav.album_id === album.id || fav.id === album.id);

    try {
      if (isFav) {
        // Remove from favorites
        await favoritesAPI.remove(album.id);
        setFavorites(favorites.filter(fav => (fav.album_id || fav.id) !== album.id));
      } else {
        // Add to favorites
        const albumData = {
          album_id: album.id,
          album_name: album.name,
          artist_id: album.artists[0].id,
          artist_name: album.artists[0].name,
          image_url: album.images[0]?.url || '',
          spotify_url: album.external_urls.spotify,
        };
        const response = await favoritesAPI.add(albumData);
        setFavorites([...favorites, { ...album, album_id: album.id }]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    }
  }

  function isFavorite(album) {
    return favorites.some(fav => (fav.album_id || fav.id) === album.id);
  }

  function copyAlbumLink(album) {
    navigator.clipboard.writeText(album.external_urls.spotify);
    alert("Album link copied to clipboard!");
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (openMenuId && !event.target.closest('.album-menu-button') && !event.target.closest('[data-menu]')) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Track scroll position for active section with gentle snap behavior
  useEffect(() => {
    let scrollTimeout;
    let isScrolling = false;

    const handleScroll = () => {
      const sections = sectionsRef.current;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Update current section indicator
      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setCurrentSection(index);
          }
        }
      });

      // Mark that we're scrolling
      isScrolling = true;

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Set timeout to snap to nearest section after scrolling stops (longer delay for smoother feel)
      scrollTimeout = setTimeout(() => {
        isScrolling = false;

        // Find which section is closest to being centered in viewport
        let nearestSection = -1;
        let minDistance = Infinity;
        let shouldSnap = false;

        sections.forEach((section, index) => {
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const viewportHeight = window.innerHeight;

            // Calculate how centered the section is
            const sectionCenter = (sectionTop + sectionBottom) / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);

            // Check if this section is in a "snap zone" (roughly 30-70% through)
            const percentageInView = Math.max(0, Math.min(viewportHeight, sectionBottom) - Math.max(0, sectionTop)) / viewportHeight;

            if (distance < minDistance && percentageInView > 0.3 && percentageInView < 0.95) {
              minDistance = distance;
              nearestSection = index;
              // Only snap if we're at least 30% but less than 70% of the way through
              shouldSnap = percentageInView >= 0.3 && percentageInView <= 0.7;
            }
          }
        });

        // Only snap if conditions are met and it's not already mostly aligned
        if (shouldSnap && nearestSection !== -1) {
          const targetSection = sections[nearestSection];
          const rect = targetSection.getBoundingClientRect();

          // Only snap if we're not too close already (prevents unnecessary snapping)
          if (Math.abs(rect.top) > 150) {
            window.scrollTo({
              top: targetSection.offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }, 800); // Much longer delay for very gradual feeling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const index = sectionsRef.current.indexOf(section);
          if (index !== -1) {
            setVisibleSections(prev => new Set(prev).add(index));
          }

          // For album cards
          if (entry.target.classList.contains('album-card-wrapper')) {
            const albumId = entry.target.getAttribute('data-album-id');
            if (albumId) {
              setVisibleAlbums(prev => new Set(prev).add(albumId));
            }
          }
        }
      });
    }, observerOptions);

    // Observe sections
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Observe album cards
    const albumCards = document.querySelectorAll('.album-card-wrapper');
    albumCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [albums, favorites]);

  // Scroll to section
  const scrollToSection = (index) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Side Navigation Dots */}
      <div
        className="side-nav-dots"
        style={{
          position: "fixed",
          right: "30px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {[0, 1].map((index) => (
          <div
            key={index}
            onClick={() => scrollToSection(index)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: currentSection === index ? "#1DB954" : "#555",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: currentSection === index ? "2px solid #1DB954" : "2px solid #555",
            }}
            onMouseEnter={(e) => {
              if (currentSection !== index) {
                e.target.style.backgroundColor = "#888";
                e.target.style.borderColor = "#888";
              }
            }}
            onMouseLeave={(e) => {
              if (currentSection !== index) {
                e.target.style.backgroundColor = "#555";
                e.target.style.borderColor = "#555";
              }
            }}
          />
        ))}
      </div>

      {/* Top Corner Links */}
      <div
        className="top-corner-links"
        style={{
          position: "fixed",
          top: "30px",
          right: "80px",
          zIndex: 1000,
          display: "flex",
          gap: "30px",
          alignItems: "center",
        }}
      >
        {isAuthenticated() ? (
          <>
            <span
              style={{
                color: "#1DB954",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "1px",
              }}
            >
              {user?.username}
            </span>
            <button
              onClick={logout}
              style={{
                background: "transparent",
                border: "1px solid #888",
                color: "#888",
                padding: "6px 16px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "400",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#1DB954";
                e.target.style.borderColor = "#1DB954";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#888";
                e.target.style.borderColor = "#888";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#888",
                fontSize: "14px",
                fontWeight: "400",
                letterSpacing: "1px",
                transition: "color 0.3s ease",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.color = "#1DB954"}
              onMouseLeave={(e) => e.target.style.color = "#888"}
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              style={{
                background: "#1DB954",
                border: "none",
                color: "#000",
                padding: "8px 20px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#1ed760";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#1DB954";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Register
            </button>
          </>
        )}
        <a
          href="https://github.com/mohibk0004-del"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#888",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "400",
            letterSpacing: "1px",
            transition: "color 0.3s ease",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => e.target.style.color = "#1DB954"}
          onMouseLeave={(e) => e.target.style.color = "#888"}
        >
          Github
        </a>
      </div>

      {/* Section 1: Hero/Search Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className={visibleSections.has(0) ? 'section-visible' : 'section-hidden'}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
          padding: "80px 40px 40px 40px",
        }}
      >
        {/* Hero Content */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "900px",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "6rem",
              fontWeight: "700",
              margin: "0",
              color: "#ffffff",
              letterSpacing: "10px",
              textTransform: "uppercase",
              lineHeight: "1",
            }}
          >
            Spotify Album Finder
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#888",
              marginTop: "30px",
              letterSpacing: "3px",
              fontWeight: "300",
              textTransform: "uppercase",
            }}
          >
            Find spotify albums from creators.
          </p>

          {/* Auth Section with Glass Effect */}
          {!isAuthenticated() && (
            <div
              style={{
                marginTop: "50px",
                marginBottom: "50px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(26, 26, 26, 0.7), rgba(15, 15, 15, 0.7))",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                  border: "1px solid rgba(29, 185, 84, 0.18)",
                  borderRadius: "32px",
                  padding: "40px 50px",
                  maxWidth: "500px",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#fff",
                    margin: "0",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Get Started
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#888",
                    margin: "0",
                    textAlign: "center",
                    letterSpacing: "1px",
                  }}
                >
                  Login or create an account to save your favorite albums
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() => setShowLogin(true)}
                    style={{
                      padding: "14px 35px",
                      background: "rgba(10, 10, 10, 0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#1DB954";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 15px rgba(29, 185, 84, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    style={{
                      padding: "14px 35px",
                      background: "linear-gradient(135deg, #1DB954, #1ed760)",
                      border: "none",
                      borderRadius: "12px",
                      color: "#000",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(29, 185, 84, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(29, 185, 84, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(29, 185, 84, 0.3)";
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundColor: "#1DB954",
              margin: isAuthenticated() ? "40px auto" : "30px auto",
            }}
          />

          {/* Collapsible Search Bar */}
          <div
            className="search-bar-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Collapsible Container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: isSearchExpanded ? "#1a1a1a" : "transparent",
                  borderRadius: "28px",
                  border: "2px solid #1DB954",
                  overflow: "hidden",
                  width: isSearchExpanded ? "540px" : "56px",
                  height: "56px",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isSearchExpanded ? "0 0 30px rgba(29, 185, 84, 0.3)" : "none",
                  position: "relative",
                }}
              >
                {/* Search Icon Button */}
                <button
                  onClick={() => {
                    if (!isSearchExpanded) {
                      setIsSearchExpanded(true);
                      setTimeout(() => searchInputRef.current?.focus(), 300);
                    }
                  }}
                  style={{
                    minWidth: "56px",
                    height: "56px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: isSearchExpanded ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    animation: !isSearchExpanded ? "pulseGlow 2s infinite" : "none",
                    pointerEvents: isSearchExpanded ? "none" : "auto",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSearchExpanded) {
                      e.target.style.transform = "scale(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSearchExpanded) {
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {/* Magnifying Glass SVG */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transition: "all 0.3s ease",
                    }}
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="#1DB954"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M16 16L21 21"
                      stroke="#1DB954"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Input Container - Only visible when expanded */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    opacity: isSearchExpanded ? 1 : 0,
                    pointerEvents: isSearchExpanded ? "auto" : "none",
                    transition: "opacity 0.3s ease 0.2s",
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search artist..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        search();
                      }
                      if (event.key === "Escape") {
                        setIsSearchExpanded(false);
                        setSearchInput("");
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "0 20px",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      letterSpacing: "1px",
                    }}
                  />

                  {/* Search Button */}
                  <button
                    onClick={search}
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#1DB954",
                      border: "none",
                      borderRadius: "50%",
                      margin: "0 3px",
                      color: "#000",
                      fontSize: "18px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#1ed760";
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#1DB954";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    ▶
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchInput("");
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "50%",
                      margin: "0 8px 0 4px",
                      color: "#888",
                      fontSize: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#fff";
                      e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#888";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        {albums.length > 0 && (
          <div
            style={{
              maxWidth: "1400px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "30px",
                padding: "20px 0",
              }}
            >
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className={`album-card-wrapper ${visibleAlbums.has(album.id) ? 'album-visible' : 'album-hidden'}`}
                  data-album-id={album.id}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div
                    className="album-card"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      aspectRatio: "1",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${album.images[0].url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "transform 0.5s ease",
                      }}
                      className="album-image"
                    />

                    {/* Album Info Overlay */}
                    <div
                      className="album-overlay"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        padding: "20px",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.95))",
                        color: "white",
                        opacity: "0",
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          margin: "0 0 5px 0",
                          color: "#ffffff",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {album.name}
                      </h3>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {album.artists[0].name}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="album-actions"
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        display: "flex",
                        gap: "10px",
                        opacity: "0",
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(album);
                        }}
                        style={{
                          width: "35px",
                          height: "35px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isFavorite(album) ? "#1DB954" : "white",
                          fontSize: "16px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgba(0,0,0,0.9)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "rgba(0,0,0,0.7)";
                        }}
                      >
                        {isFavorite(album) ? "♥" : "♡"}
                      </div>
                    </div>

                    {/* Play Button Center */}
                    <div
                      className="album-play"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#1DB954",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000",
                        fontSize: "20px",
                        cursor: "pointer",
                        opacity: "0",
                        transition: "all 0.3s ease",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(album.external_urls.spotify, '_blank');
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#1ed760";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#1DB954";
                      }}
                    >
                      ▶
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        <div
          className="scroll-indicator"
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#555",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
          onClick={() => scrollToSection(1)}
        >
          <div
            style={{
              width: "2px",
              height: "40px",
              backgroundColor: "#555",
              margin: "0 auto 10px",
              animation: "scrollDown 2s infinite",
            }}
          />
          Scroll
        </div>
      </section>

      {/* Section 2: Favorites Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className={visibleSections.has(1) ? 'section-visible' : 'section-hidden'}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          padding: "80px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "60px",
            }}
          >
            <h2
              style={{
                fontSize: "4rem",
                fontWeight: "700",
                margin: "0 0 20px 0",
                color: "#ffffff",
                letterSpacing: "8px",
                textTransform: "uppercase",
              }}
            >
              FAVORITES
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#888",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {favorites.length} Saved Albums
            </p>
          </div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#555",
                fontSize: "14px",
                letterSpacing: "1px",
                padding: "60px 0",
              }}
            >
              No favorites yet. Search for albums and save your favorites.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "30px",
                padding: "20px 0",
              }}
            >
              {favorites.map((album, index) => {
                const albumId = album.album_id || album.id;
                const albumName = album.album_name || album.name;
                const artistName = album.artist_name || album.artists?.[0]?.name || 'Unknown Artist';
                const imageUrl = album.image_url || album.images?.[0]?.url || '';
                const spotifyUrl = album.spotify_url || album.external_urls?.spotify || '';

                return (
                  <div
                    key={albumId}
                    className={`album-card-wrapper ${visibleAlbums.has(albumId) ? 'album-visible' : 'album-hidden'}`}
                    data-album-id={albumId}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div
                      className="album-card"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        aspectRatio: "1",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.5s ease",
                        }}
                        className="album-image"
                      />

                      {/* Album Info Overlay */}
                      <div
                        className="album-overlay"
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          padding: "20px",
                          background: "linear-gradient(transparent, rgba(0,0,0,0.95))",
                          color: "white",
                          opacity: "0",
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            margin: "0 0 5px 0",
                            color: "#ffffff",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {albumName}
                        </h3>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {artistName}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        className="album-actions"
                        style={{
                          position: "absolute",
                          top: "15px",
                          right: "15px",
                          display: "flex",
                          gap: "10px",
                          opacity: "0",
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite({ id: albumId, album_id: albumId });
                          }}
                          style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: "rgba(0,0,0,0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1DB954",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "rgba(0,0,0,0.9)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "rgba(0,0,0,0.7)";
                          }}
                        >
                          ♥
                        </div>
                      </div>

                      {/* Play Button Center */}
                      <div
                        className="album-play"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "60px",
                          height: "60px",
                          backgroundColor: "#1DB954",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontSize: "20px",
                          cursor: "pointer",
                          opacity: "0",
                          transition: "all 0.3s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(spotifyUrl, '_blank');
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#1ed760";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#1DB954";
                        }}
                      >
                        ▶
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Auth Modals */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default App;
