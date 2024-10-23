import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets_frontend/assets'

function Footer() {
    const navigate = useNavigate()
    return (
        <footer className="bg-white border-t border-gray-200 py-8 md:py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <img src={assets.logo1} alt="Mediscribe Logo" className="h-8 mb-4" />
                    </div>
                    
                    {['Resources', 'Company', 'Legal'].map((category, index) => (
                        <div key={index}>
                            <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">{category}</h2>
                            <ul className="space-y-2">
                                {category === 'Resources' && (
                                    <>
                                        <li><a href="#" className="text-gray-500 hover:text-gray-700">Blog</a></li>
                                        <li><a href="#" className="text-gray-500 hover:text-gray-700">Help Center</a></li>
                                    </>
                                )}
                                {category === 'Company' && (
                                    <>
                                        <li><button onClick={() => navigate('/about')} className="text-gray-500 hover:text-gray-700">About Us</button></li>
                                        <li><button onClick={() => navigate('/contact')} className="text-gray-500 hover:text-gray-700">Contact</button></li>
                                    </>
                                )}
                                {category === 'Legal' && (
                                    <>
                                        <li><a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a></li>
                                        <li><a href="#" className="text-gray-500 hover:text-gray-700">Terms & Conditions</a></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        © 2024 <a href="#" className="hover:underline">MediScribe™</a>. All Rights Reserved.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Facebook</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Twitter</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <span className="sr-only">LinkedIn</span>
                            <img src={assets.linkedin} alt="LinkedIn" className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer