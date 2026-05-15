import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { Coins } from "lucide-react";
import { serverUrl } from "../config";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
function Home() {
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];

  const [openLogin, setOpenLogin] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [websites, setWebsites] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [15, -15]);
  const rotateY = useTransform(x, [0, 800], [-15, 15]);

  const handleMouse = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const handleLogOut = async () => {
    console.log("logout click");
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) return;
    const handleGetAllWebsites = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetAllWebsites();
  }, [userData]);
  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-wide">GenWeb.ai</div>
          <div className="flex items-center gap-5">
            <div
              className="text-sm text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </div>
            {userData && (
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition"
                onClick={() => navigate("/pricing")}
              >
                <Coins size={14} className="text-yellow-400" />
                <span className="text-zinc-300">Credits</span>
                <span>{userData.credits}</span>
                <span className="font-semibold">+</span>
              </div>
            )}

            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <img
                    src={
                      userData?.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                </button>
                <AnimatePresence>
                  {openProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium truncate">
                            {userData.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {userData.email}
                          </p>
                        </div>

                        <button className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5">
                          <Coins size={14} className="text-yellow-400" />
                          <span className="text-zinc-300">Credits</span>
                          <span>{userData.credits}</span>
                          <span className="font-semibold">+</span>
                        </button>

                        <button
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5"
                          onClick={() => navigate("/dashboard")}
                        >
                          Dashboard
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5"
                          onClick={handleLogOut}
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] pointer-events-none overflow-hidden blur-[120px] opacity-30 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-screen"
        />
      </div>

      <section className="pt-44 pb-32 px-6 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Build Stunning Websites <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            with AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Describe your idea and let AI generate a modern, responsive,
          production-ready website.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition mt-12 relative z-10"
          onClick={() =>
            userData ? navigate("/dashboard") : setOpenLogin(true)
          }
        >
          {userData ? "Go to dashboard" : "Get Started"}
        </motion.button>

        {/* 3D Floating Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 mx-auto max-w-5xl relative perspective-[1200px]"
          onMouseMove={handleMouse}
          onMouseLeave={() => { x.set(400); y.set(200); }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full h-[400px] md:h-[600px] rounded-2xl bg-white/5 border border-white/20 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(168,85,247,0.4)] overflow-hidden flex flex-col transition-shadow hover:shadow-[0_0_120px_-20px_rgba(59,130,246,0.6)]"
          >
            {/* Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-black/40">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 px-3 py-1 rounded bg-white/10 text-xs text-zinc-400 font-medium tracking-wide">genweb.ai/dashboard</div>
            </div>
            {/* Body */}
            <div className="flex-1 flex">
              {/* Sidebar */}
              <div className="hidden md:block w-64 border-r border-white/10 p-4 space-y-4 bg-black/20">
                <div className="h-8 rounded bg-white/10 animate-pulse"></div>
                <div className="h-32 rounded bg-white/5 animate-pulse"></div>
                <div className="h-8 rounded bg-white/10 animate-pulse"></div>
              </div>
              {/* Main Content */}
              <div className="flex-1 p-4 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="w-full h-full rounded-xl bg-white text-black p-6 md:p-8 shadow-inner flex flex-col gap-4 relative z-10">
                  <div className="w-3/4 h-10 md:h-16 bg-zinc-200 rounded-xl"></div>
                  <div className="w-1/2 h-4 md:h-6 bg-zinc-100 rounded-lg"></div>
                  <div className="w-full flex-1 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 mt-4 flex items-center justify-center p-4 text-center">
                    <span className="text-zinc-400 font-medium text-sm md:text-base">Your Generated Website Appears Here</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
      {!userData && (
        <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors shadow-lg hover:shadow-2xl perspective-1000"
              >
                <h1 className="text-xl font-semibold mb-3">{h}</h1>
                <p className="text-sm text-zinc-400">
                  GenWeb.ai builds real websites — clean code, animations,
                  responsiveness and scalable structure.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {userData && websites?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <h3 className="text-2xl font-semibold mb-6">Your Websites</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {websites.slice(0, 3).map((w) => (
              <motion.div
                key={w._id}
                whileHover={{ scale: 1.02, y: -6, rotateY: 2, rotateX: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => navigate(`/editor/${w._id}`)}
                className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all perspective-1000"
              >
                <div className="h-40 bg-black">
                  <iframe
                    srcDoc={w.latestCode}
                    className="w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold line-clamp-2">
                    {w.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Last Updated {""}
                    {new Date(w.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} GenWeb.ai
      </footer>

      {openLogin && (
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
}

export default Home;
