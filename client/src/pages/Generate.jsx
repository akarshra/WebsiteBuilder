import { ArrowLeft } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react"
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
];

const TEMPLATES = [
    {
        title: "SaaS Landing Page",
        description: "Modern landing page with hero, features, pricing, and footer.",
        prompt: "Create a modern SaaS landing page for an AI productivity tool. Include a hero section with a compelling headline and two call to action buttons, a features section with 3 distinct feature cards and icons, a pricing table with 3 tiers (Free, Pro, Enterprise), and a clean footer. Use a sleek dark theme with vibrant purple and blue gradient accents. Make sure there are smooth micro-animations on hover and the layout is fully responsive."
    },
    {
        title: "Developer Portfolio",
        description: "Showcase your skills, projects, and contact info.",
        prompt: "Create a minimalist and professional developer portfolio website. Include a hero section introducing the developer with a profile picture area and short bio, a 'Skills' section using a neat grid layout, a 'Projects' section featuring 3 project cards (with image placeholder, title, description, and link button), and a functional-looking contact form. Use a clean, monochromatic light theme with a high-contrast accent color like electric blue and modern sans-serif typography."
    },
    {
        title: "Local Coffee Shop",
        description: "Warm, inviting local business website with a menu.",
        prompt: "Create a beautiful website for a local artisanal coffee shop. Include a welcoming hero section with a cozy background image placeholder and a 'View Menu' button. Add a menu section with 2 columns (Coffee, Pastries) and prices, an 'About Us' section detailing the origin of the beans, and a footer with address, operating hours, and social links. Use a warm, earthy color palette with rich browns, creams, and subtle gold accents."
    }
];
function Generate() {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error,setError]=useState("")
    const handleGenerateWebsite = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/website/generate`, { prompt }, { withCredentials: true })
            console.log(result)
            setProgress(100)
            setLoading(false)
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setError(error.response.data.message || "something went wrong")
            console.log(error)
        }
    }

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setPhaseIndex(0)
                setProgress(0)
            }, 0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {
            const increment = value < 20
                ? Math.random() * 1.5
                : value < 60
                    ? Math.random() * 1.2
                    : Math.random() * 0.6;
            value += increment

            if (value >= 93) value = 93;

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length), PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate("/")}><ArrowLeft size={16} /></button>
                        <h1 className='text-lg font-semibold'>Genweb<span className='text-zinc-400'>.ai</span></h1>
                    </div>

                </div>
            </div>

            <div className='max-w-6xl mx-auto px-6 py-16'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
                        Build Websites with
                        <span className='block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent'>Real AI Power</span>
                    </h1>
                    <p className='text-zinc-400 max-w-2xl mx-auto'>
                        This process may take several minutes.
                        genweb.ai focuses on quality, not shortcuts.
                    </p>

                </motion.div>
                <div className='mb-14'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-xl font-semibold'>Describe your website</h1>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                        {TEMPLATES.map((t, i) => (
                            <div 
                                key={i} 
                                onClick={() => setPrompt(t.prompt)}
                                className='p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition flex flex-col gap-2'
                            >
                                <h3 className='font-semibold text-white'>{t.title}</h3>
                                <p className='text-xs text-zinc-400'>{t.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className='relative'>
                        <textarea
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            placeholder='Or describe your website in detail manually...'
                            className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20'></textarea>
                    </div>
                    

                    {error && <p className='mt-4 text-sm text-red-400'>{error}</p>}

                </div>
                <div className='flex justify-center'>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleGenerateWebsite}
                        disabled={!prompt.trim() && loading}
                        className={`px-14 py-4 rounded-2xl font-semibold text-lg ${prompt.trim() && !loading
                            ? "bg-white text-black"
                            : "bg-white/20 text-zinc-400 cursor-not-allowed"
                            }`}
                    >
                        Generate Website
                    </motion.button>
                </div>


                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-xl mx-auto mt-12"
                    >
                        <div className='flex justify-between mb-2 text-xs text-zinc-400'>
                            <span >{PHASES[phaseIndex]}</span>
                            <span >{progress}%</span>
                        </div>

                        <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                            <motion.div
                                className="h-full bg-linear-to-r from-white to-zinc-300"
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                            />
                        </div>

                        <div className='text-center text-xs text-zinc-400 mt-4'>
                            Estimated time remaining:{" "}
                            <span className="text-white font-medium">
                                ~8–12 minutes
                            </span>
                        </div>

                    </motion.div>
                )}


            </div>
        </div>
    )
}

export default Generate
