import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Dog, Menu, X, Heart, Siren } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { name: 'Problem', href: '#problem' },
  { name: 'Solution', href: '#solution' },
  
  { name: 'Features', href: '#features' },
  { name: 'Digital ID', href: '#howQR' },
  { name: 'Nearby Care', href: '#nearby' },
  
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    const sectionId = href.replace('#', '')
    if (window.location.pathname === '/') {
      // If already on home page, just scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        const navHeight = 80 // Account for fixed navbar height
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementPosition - navHeight,
          behavior: 'smooth'
        })
      }
    } else {
      // If on another page, navigate to home with hash
      navigate('/' + href)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed border-b-2 border-green-200 top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-green-50/95 to-white/95 backdrop-blur-lg shadow-lg shadow-green-100/50 py-3'
          : 'bg-gradient-to-r from-green-50/80 to-white/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group cursor-pointer bg-none border-none"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-shadow duration-300">
              <Dog className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors duration-300">
            PET-CARE
            </span>
          </motion.button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-300 bg-none border-none cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.button>
            ))}
            <motion.button
              onClick={() => navigate('/emergency')}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-200/50 hover:scale-105 transition-all duration-300 cursor-pointer border-none"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                <Siren className="w-4 h-4" />
                Emergency Rescue
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/solution')}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200/50 hover:scale-105 transition-all duration-300 cursor-pointer border-none"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Detection
            </motion.button>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-green-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleNavClick(link.href)
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-all duration-300 bg-none border-none cursor-pointer text-left"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate('/emergency')
                  setIsMobileMenuOpen(false)
                }}
                className="mt-2 text-center px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <Siren className="w-4 h-4" />
                Emergency Rescue
              </button>
              
              <button
                onClick={() => {
                  navigate('/solution')
                  setIsMobileMenuOpen(false)
                }}
                className="text-center px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-xl shadow-lg cursor-pointer border-none"
              >
                Try Detection
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
