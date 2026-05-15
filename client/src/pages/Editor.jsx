import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useState } from 'react'
import { ArrowLeft, Code, Code2, MessageCircle, MessageSquare, Monitor, Rocket, Send, X, Download, Save, History, Palette, Image as ImageIcon, Copy, Loader2 } from 'lucide-react'
import { useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'

import Editor from '@monaco-editor/react';

const THEMES = [
    { name: "Default Light", color: "#ffffff" },
    { name: "Midnight", color: "#0f172a" },
    { name: "Ocean", color: "#0c4a6e" },
    { name: "Forest", color: "#064e3b" },
    { name: "Sunset", color: "#7c2d12" },
    { name: "Cyberpunk", color: "#fdf12a" },
    { name: "Rose", color: "#881337" }
];
function WebsiteEditor() {
    const { id } = useParams()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    
    // New States
    const [showHistory, setShowHistory] = useState(false)
    const [showAssets, setShowAssets] = useState(false)
    const [showTheme, setShowTheme] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [assets, setAssets] = useState([])
    const [isSaving, setIsSaving] = useState(false)
    const thinkingSteps = [
        "Understanding your request…",
        "Planning layout changes…",
        "Improving responsiveness…",
        "Applying animations…",
        "Finalizing update…",
    ]
    const handleUpdate = async () => {
        if (!prompt) return
        setUpdateLoading(true)
        const text = prompt
        setPrompt("")
        setMessages((m) => [...m, { role: "user", content: prompt }])
        try {
            const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true })
            console.log(result)
            setUpdateLoading(false)
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            setUpdateLoading(false)
            console.log(error)
            alert("Update failed: " + (error.response?.data?.message || error.message))
        }
    }

    const handleDeploy = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
                window.open(`${result.data.url}`, "_blank")
               
            } catch (error) {
                console.log(error)
            }
        }

    const handleSaveCode = async () => {
        setIsSaving(true)
        try {
            await axios.post(`${serverUrl}/api/website/save-code/${id}`, { code }, { withCredentials: true })
            const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
            setWebsite(result.data)
        } catch (error) {
            console.log(error)
            alert("Failed to save code")
        }
        setIsSaving(false)
    }

    const handleExport = () => {
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${website?.title || 'website'}.html`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleAssetUpload = async (e) => {
        const file = e.target.files[0]
        if(!file) return
        setUploading(true)
        
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if (data.secure_url) {
                setAssets(prev => [...prev, data.secure_url])
            } else {
                console.log(data)
                alert("Upload failed: " + (data.error?.message || "Unknown error"))
            }
        } catch(error) {
            console.log(error)
            alert("Upload failed")
        }
        setUploading(false)
    }

    const handleRestoreVersion = async (versionId) => {
        try {
            const result = await axios.post(`${serverUrl}/api/website/revert/${id}`, { versionId }, { withCredentials: true })
            setCode(result.data.code)
            const result2 = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
            setWebsite(result2.data)
            setShowHistory(false)
        } catch(error) {
            console.log(error)
            alert("Restore failed")
        }
    }

    const handleThemeSelect = (color) => {
        let newCode = code
        const themeCss = `<style id="genweb-theme"> :root { --primary: ${color}; } body { background-color: ${color === '#ffffff' ? '#ffffff' : color} !important; color: ${color === '#ffffff' ? '#000000' : '#ffffff'} !important; } </style>`
        
        if (newCode.includes('<style id="genweb-theme">')) {
            newCode = newCode.replace(/<style id="genweb-theme">.*?<\/style>/s, themeCss)
        } else {
            newCode = newCode.replace('</head>', `  ${themeCss}\n</head>`)
        }
        setCode(newCode)
        setShowTheme(false)
    }


    useEffect(() => {
        if (!updateLoading) return;
        const interval = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)

        return () => clearInterval(interval)
    }, [updateLoading, thinkingSteps.length])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
            }
        }
        handleGetWebsite()
    }, [id])


    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>
                Loading...
            </div>
        )
    }



    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80'>
                <Header />
                <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"
                                    }`}
                            >

                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                        ? "bg-white text-black"
                                        : "bg-white/5 border border-white/10 text-zinc-200"
                                        }`}
                                >

                                    {m.content}

                                </div>

                            </div>
                        ))}

                        {updateLoading &&

                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                            </div>}




                    </div>
                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate}><Send size={14} /></button>
                        </div>
                    </div>

                </>
            </aside>

            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80 overflow-x-auto whitespace-nowrap'>
                    <span className='text-xs text-zinc-400 hidden sm:inline'>Live Preview</span>
                    <div className='flex gap-2 items-center'>
                        
                        <button onClick={() => setShowTheme(true)} className='flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition'><Palette size={14} /> <span className='hidden sm:inline'>Theme</span></button>
                        <button onClick={() => setShowAssets(true)} className='flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition'><ImageIcon size={14} /> <span className='hidden sm:inline'>Assets</span></button>
                        <button onClick={() => setShowHistory(true)} className='flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition'><History size={14} /> <span className='hidden sm:inline'>History</span></button>
                        <div className='hidden sm:block w-px h-4 bg-white/10 mx-1'></div>
                        <button onClick={handleExport} className='flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition'><Download size={14} /> <span className='hidden sm:inline'>Export</span></button>

                        {website.deployed ?"": <button className='flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-xs sm:text-sm font-semibold hover:scale-105 transition'
                        onClick={handleDeploy}
                        ><Rocket size={14} /> <span className='hidden sm:inline'>Deploy</span></button>}
                       
                        <button className='p-2 lg:hidden' onClick={() => setShowChat(true)}><MessageSquare size={18} /></button>

                        <button className='p-2' onClick={() => setShowCode(true)}><Code2 size={18} /></button>
                        <button className='p-2' onClick={() => setShowFullPreview(true)}><Monitor size={18} /></button>
                    </div>

                </div>

                <iframe ref={iframeRef} sandbox='allow-scripts allow-forms' className='flex-1 w-full bg-white' />
            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col"
                    >
                   <Header onclose={()=>setShowChat(false)}/>
                   <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"
                                    }`}
                            >

                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                        ? "bg-white text-black"
                                        : "bg-white/5 border border-white/10 text-zinc-200"
                                        }`}
                                >

                                    {m.content}

                                </div>

                            </div>
                        ))}

                        {updateLoading &&

                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                            </div>}




                    </div>
                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate}><Send size={14} /></button>
                        </div>
                    </div>

                </>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col"
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                            <span className='text-sm font-medium'>index.html</span>
                            <div className='flex gap-3 items-center'>
                                <button onClick={handleSaveCode} disabled={isSaving} className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:scale-105 transition'>
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Code
                                </button>
                                <button onClick={() => setShowCode(false)}><X size={18} /></button>
                            </div>
                        </div>
                        <Editor
                            theme='vs-dark'
                            value={code}
                            language='html'
                            onChange={(v) => setCode(v)}
                        />

                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black"
                    >
                        <iframe className='w-full h-full bg-white' srcDoc={code} sandbox='allow-scripts allow-forms'/>
                        <button onClick={() => setShowFullPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg'><X /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Panel */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[350px] z-[9999] bg-[#0a0a0a] border-l border-white/10 flex flex-col"
                    >
                        <div className='h-14 px-4 flex justify-between items-center border-b border-white/10'>
                            <div className='flex items-center gap-2 font-medium'><History size={16}/> Version History</div>
                            <button onClick={() => setShowHistory(false)}><X size={18} /></button>
                        </div>
                        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                            {website?.versions?.map((v, i) => (
                                <div key={v._id || i} className='p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center'>
                                    <div>
                                        <p className='text-sm font-medium'>Version {website.versions.length - i}</p>
                                        <p className='text-xs text-zinc-400'>{new Date(v.timestamp).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => handleRestoreVersion(v._id)} className='px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition'>
                                        Restore
                                    </button>
                                </div>
                            ))?.reverse()}
                            {(!website?.versions || website.versions.length === 0) && (
                                <p className='text-zinc-500 text-sm text-center mt-10'>No history available</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assets Panel */}
            <AnimatePresence>
                {showAssets && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[350px] z-[9999] bg-[#0a0a0a] border-l border-white/10 flex flex-col"
                    >
                        <div className='h-14 px-4 flex justify-between items-center border-b border-white/10'>
                            <div className='flex items-center gap-2 font-medium'><ImageIcon size={16}/> Assets</div>
                            <button onClick={() => setShowAssets(false)}><X size={18} /></button>
                        </div>
                        <div className='p-4 border-b border-white/10'>
                            <label className='flex items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-indigo-500 bg-white/5 cursor-pointer transition'>
                                <div className='flex flex-col items-center gap-1 text-zinc-400'>
                                    {uploading ? <Loader2 className='animate-spin' size={20}/> : <ImageIcon size={20}/>}
                                    <span className='text-xs font-medium'>{uploading ? "Uploading..." : "Click to upload image"}</span>
                                </div>
                                <input type='file' accept='image/*' className='hidden' onChange={handleAssetUpload} disabled={uploading}/>
                            </label>
                        </div>
                        <div className='flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start'>
                            {assets.map((url, i) => (
                                <div key={i} className='group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10'>
                                    <img src={url} alt="asset" className='w-full h-full object-cover'/>
                                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                                        <button onClick={() => { navigator.clipboard.writeText(url); alert("URL copied!") }} className='p-2 rounded-lg bg-white/20 hover:bg-white/30'><Copy size={16}/></button>
                                    </div>
                                </div>
                            ))}
                            {assets.length === 0 && (
                                <p className='text-zinc-500 text-sm text-center col-span-2 mt-4'>No assets uploaded yet</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Theme Panel */}
            <AnimatePresence>
                {showTheme && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[350px] z-[9999] bg-[#0a0a0a] border-l border-white/10 flex flex-col"
                    >
                        <div className='h-14 px-4 flex justify-between items-center border-b border-white/10'>
                            <div className='flex items-center gap-2 font-medium'><Palette size={16}/> Theme</div>
                            <button onClick={() => setShowTheme(false)}><X size={18} /></button>
                        </div>
                        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                            <p className='text-xs text-zinc-400 mb-4'>Click a color palette to instantly update the primary color of your website.</p>
                            {THEMES.map((t, i) => (
                                <button key={i} onClick={() => handleThemeSelect(t.color)} className='w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-3 transition'>
                                    <div className='w-8 h-8 rounded-full border border-white/20' style={{ backgroundColor: t.color }}></div>
                                    <span className='font-medium'>{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )

    function Header({onclose}) {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                <span className='font-semibold truncate'>{website.title}</span>
                {onclose &&  <button onClick={onclose}><X size={18} color='white'/></button>}
           
            </div>
        )
    }



}





export default WebsiteEditor
