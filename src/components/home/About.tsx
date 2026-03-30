import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import img1 from '../../assets/logofinal.png';

const About: React.FC = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-10 sm:py-16 lg:py-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<motion.section
					className="overflow-hidden"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1, transition: { duration: 0.8 } }}
					viewport={{ once: true, amount: 0.2 }}
				>
					<div className="relative min-h-[600px]">
						{/* Left Image - Hidden on mobile, overlaps on desktop */}
						<div className="hidden lg:flex w-1/3 absolute left-0 top-0 bottom-0 items-center justify-end z-10 pr-8">
							<img
								src={img1}
								alt="VIRAGA Foundation Logo"
								className="w-full max-w-sm h-auto object-contain hover:scale-105 transition-all duration-300 rounded-2xl shadow-2xl bg-white p-6"
							/>
						</div>

						{/* Content Card - Full width on mobile, right side on desktop */}
						<div className="w-full lg:w-[75%] lg:ml-[25%] bg-gradient-to-br from-yellow-50 via-yellow-50 to-white shadow-2xl rounded-3xl p-8 sm:p-10 lg:p-16 min-h-[600px] hover:shadow-3xl transition-all duration-300">
							{/* Mobile image */}
							<div className="lg:hidden mb-8 flex justify-center">
								<img
									src={img1}
									alt="VIRAGA Foundation Logo"
									className="w-48 h-auto rounded-2xl shadow-lg bg-white p-4"
								/>
							</div>

							<div className="lg:ml-[20%]">
								{/* Title */}
								<h1 className="text-4xl sm:text-5xl text-center lg:text-6xl font-bold text-amber-800 mb-4">
									ABOUT VIRAGA
								</h1>

								{/* Hindi subtitle */}
								{/* <h2 className="text-2xl sm:text-3xl font-semibold text-orange-700 mb-8">
									नहि ज्ञानेन सदृश्य
								</h2> */}
								<p className="italic text-purple-700 font-bold text-lg">
										“Guided by Dharma, Driven by Karma, Serving with Selflessness”
								</p>
								{/* Main content */}
								<div className="space-y-6 text-amber-900 text-base sm:text-lg leading-relaxed">
									
									
									<div className="pt-4">
										<p className="text-base sm:text-lg">
											We are <span className="font-semibold text-purple-700">VIRAGA Foundation</span>, a non-governmental organization established on November 25, 2020, by dedicated individuals inspired by the timeless teachings of Swami Vivekananda. Our foundation was graciously inaugurated by Swami Hridananadji Maharaj, Secretary of Ramakrishna Mission, Vijayawada.
										</p>
									</div>

									<p className="italic text-purple-700 font-medium text-lg">
										"They alone live who live for others." — Swami Vivekananda
									</p>

									<p>
										Guided by Dharma, driven by Karma, and serving with selflessness, VIRAGA Foundation is a movement of compassionate hearts working together to create positive change. Through our seven transformative initiatives, we work tirelessly to build a society rooted in kindness, dignity, and selfless service.
									</p>

									<p className="font-semibold text-purple-700 text-lg">
										Together, we can light up lives, because service to humanity is service to God.
									</p>
								</div>

								{/* Call to action */}
								<div className="mt-10">
									<Link
										to="/about"
										className="inline-block hover:text-white bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
									>
										Explore Our Initiatives →
									</Link>
								</div>
							</div>
						</div>

						{/* Bottom decorative element */}
						<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2 rounded-b-3xl"></div>
					</div>
				</motion.section>
			</div>
		</div>
	);
};

export default About;