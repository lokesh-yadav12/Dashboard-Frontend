import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, Heart } from 'lucide-react';
import logo from '../../assets/bottom.png';

interface LinkItem {
	label: string;
	href: string;
}

interface SocialLink {
	icon: React.ReactNode;
	href: string;
	label: string;
	color: string;
}

const Footer: React.FC = () => {
	const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>(
		[],
	);

	useEffect(() => {
		const newParticles = Array.from({ length: 20 }, (_, i) => ({
			id: i,
			left: `${Math.random() * 100}%`,
			delay: `${Math.random() * 5}s`,
			duration: `${Math.random() * 3 + 6}s`,
		}));
		setParticles(newParticles);
	}, []);

	const quickLinks: LinkItem[] = [
		{ label: 'Home', href: '/' },
		{ label: 'Activities', href: '/activities' },
		{ label: 'Administration', href: '/administration' },
		{ label: 'Donations', href: '/donation' },
		{ label: 'Yearly Reports', href: '/yearly-reports' },
		{ label: 'Contact Us', href: '/contactPage' },
	];

	const socialLinks: SocialLink[] = [
		{ icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook', color: 'from-blue-600 to-blue-700' },
		{ icon: <Twitter className="w-5 h-5" />, href: 'https://x.com/viraga2022?s=21', label: 'Twitter', color: 'from-sky-500 to-sky-600' },
		{
			icon: <Instagram className="w-5 h-5" />,
			href: 'https://www.instagram.com/viragafoundation',
			label: 'Instagram',
			color: 'from-pink-600 to-purple-600',
		},
		{ icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn', color: 'from-blue-700 to-blue-800' },
	];

	return (
		<div className="flex flex-col text-white">
			{/* Footer */}
			<footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 sm:px-5 text-white overflow-hidden">
				{/* Animated Grid Background */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0" style={{
						backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.1) 1px, transparent 1px),
						linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px)`,
						backgroundSize: '50px 50px'
					}} />
				</div>

				{/* Animated Glow Orbs with enhanced effects */}
				<div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-glow" />
				<div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl animate-pulse-glow-delayed" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl animate-pulse-glow-slow" />

				{/* Floating Particles with trail effect */}
				{particles.map((particle) => (
					<div
						key={particle.id}
						className="absolute w-2 h-2 rounded-full animate-float-up-enhanced"
						style={{
							left: particle.left,
							bottom: '0',
							background: 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(251, 146, 60, 0) 70%)',
							animationDelay: particle.delay,
							animationDuration: particle.duration,
							boxShadow: '0 0 10px rgba(251, 146, 60, 0.4)',
						}}
					/>
				))}

				{/* Elegant Top Border with shimmer */}
				<div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer" />

				{/* Footer Content */}
				<div className="relative max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10">
					{/* Main Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8	 lg:gap-12 mb-12 sm:mb-16">
						{/* About Section */}
						<div className="sm:col-span-2 lg:col-span-2 space-y-6 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
							<div className="group">
								<div className="flex items-center gap-3  mb-2 transform transition-all duration-500 hover:scale-105">
									<div className="relative flex-shrink-0">
										<div className="absolute inset-0  rounded-2xl  transition-all duration-500" />
										<img src={logo} alt="Viraga Foundation Logo" className="h-32 pl-2 sm:pl-4 w-68 object-contain relative z-10 drop-shadow-2xl" />
									</div>
								</div>
							</div>
							<div className="relative">
								<div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-500 via-orange-600 to-transparent rounded-full opacity-60" />
								<p className="text-slate-300 leading-relaxed text-sm sm:text-base pl-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
									VIRAGA FOUNDATION was established on November 25, 2020, by a group of dedicated
									individuals inspired by the timeless teachings of Swami Vivekananda. Our journey began
									with a vision to serve humanity with compassion, and our foundation was graciously
									inaugurated by Swami Hridananadji Maharaj, Secretary of Ramakrishna Mission, Vijayawada.
								</p>
							</div>
						</div>

						{/* Quick Links */}
						<div className="animate-fade-slide-up px-4 sm:px-1" style={{ animationDelay: '0.3s' }}>
							<div className="mb-8">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
									QUICK LINKS
								</h3>
								<div className="flex gap-1">
									<div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-expand" />
									<div className="h-1 w-8 bg-gradient-to-r from-orange-600 to-transparent rounded-full animate-expand-delayed" />
								</div>
							</div>
							<ul className="space-y-3">
								{quickLinks.map((link, index) => (
									<li key={index} className="group animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
										<Link
											to={link.href}
											className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-all duration-300 group-hover:translate-x-2"
										>
											<div className="relative w-6 h-6 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-orange-500/20 group-hover:to-orange-600/20 transition-all duration-300 flex-shrink-0 overflow-hidden">
												<div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
												<ArrowRight className="w-4 h-4 text-orange-500 transition-transform group-hover:translate-x-1 relative z-10" />
											</div>
											<span className="font-medium text-sm sm:text-base relative">
												{link.label}
												<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300" />
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Social Links */}
						<div className="animate-fade-slide-up px-4 sm:px-1" style={{ animationDelay: '0.4s' }}>
							<div className="mb-8">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
									CONNECT WITH US
								</h3>
								<div className="flex gap-1">
									<div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-expand" />
									<div className="h-1 w-8 bg-gradient-to-r from-orange-600 to-transparent rounded-full animate-expand-delayed" />
								</div>
							</div>
							<p className="text-slate-400 text-sm mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s' }}>
								Follow us on social media to stay updated with our latest activities and initiatives.
							</p>
							<div className="flex flex-wrap sm:gap-3 gap-1">
								{socialLinks.map((social, index) => (
									<a
										key={index}
										href={social.href}
										aria-label={social.label}
										className="group relative w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/30 overflow-hidden animate-scale-in"
										style={{ animationDelay: `${0.6 + index * 0.1}s` }}
									>
										<div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
										<div className="relative z-10 text-white group-hover:scale-110 transition-transform duration-300">
											{social.icon}
										</div>
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Footer Bottom */}
						<div className="relative">
						<div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
						<div className="flex flex-col items-center gap-3 pt-4">
							<div className="text-slate-400 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
								<p className="font-medium flex items-center flex-wrap justify-center text-base sm:text-lg gap-2">
									<span>© 2026</span>
									<span className="text-orange-500 font-bold">VIRAGA FOUNDATION.</span>
									<span className="text-green-500"></span>
									<span>All rights reserved.</span>
								</p>
							</div>
							<div className="h-px w-64 sm:w-80 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
							<div className="flex items-center gap-1 sm:gap-2 text-slate-400 animate-fade-in" style={{ animationDelay: '0.8s' }}>
								<span className="text-sm sm:text-lg">Built with</span>
								<div className="relative">
									<Heart className="w-5 h-5 text-red-500 animate-heartbeat" fill="currentColor" />
									<div className="absolute inset-0 animate-ping-slow">
										<Heart className="w-5 h-5 text-red-500 opacity-20" />
									</div>
								</div>
								<span className="text-sm sm:text-lg">by</span>
								<a 
									href="https://elite8digital.in" 
									target="_blank" 
									rel="noopener noreferrer"
									className="group flex items-center gap-1 sm:gap-2"
								>
									<span className="text-blue-400 font-semibold text-sm sm:text-lg group-hover:text-blue-300 transition-colors duration-300">
										Elite8 Digital
									</span>
									<div className="relative overflow-hidden rounded-lg">
										<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
										<img
											src="/elite8digital-nav.png"
											alt="Elite8Digital"
											className="h-12 w-12 sm:h-16 sm:w-16 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
										/>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Custom Styles */}
				<style>{`
					@keyframes fade-slide-up {
						from {
							opacity: 0;
							transform: translateY(40px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes fade-in {
						from {
							opacity: 0;
						}
						to {
							opacity: 1;
						}
					}

					@keyframes scale-in {
						from {
							opacity: 0;
							transform: scale(0.8);
						}
						to {
							opacity: 1;
							transform: scale(1);
						}
					}

					@keyframes float-up-enhanced {
						0% {
							transform: translateY(0) translateX(0) scale(0);
							opacity: 0;
						}
						10% {
							opacity: 1;
							transform: scale(1);
						}
						50% {
							opacity: 0.8;
						}
						90% {
							opacity: 0.3;
						}
						100% {
							transform: translateY(-120vh) translateX(60px) scale(0);
							opacity: 0;
						}
					}

					@keyframes pulse-glow {
						0%, 100% {
							opacity: 0.05;
							transform: scale(1);
						}
						50% {
							opacity: 0.15;
							transform: scale(1.2);
						}
					}

					@keyframes pulse-glow-delayed {
						0%, 100% {
							opacity: 0.05;
							transform: scale(1) rotate(0deg);
						}
						50% {
							opacity: 0.15;
							transform: scale(1.15) rotate(5deg);
						}
					}

					@keyframes pulse-glow-slow {
						0%, 100% {
							opacity: 0.03;
							transform: scale(1);
						}
						50% {
							opacity: 0.08;
							transform: scale(1.3);
						}
					}

					@keyframes heartbeat {
						0%, 100% {
							transform: scale(1);
						}
						10%, 30% {
							transform: scale(1.1);
						}
						20%, 40% {
							transform: scale(1);
						}
					}

					@keyframes ping-slow {
						0% {
							transform: scale(1);
							opacity: 1;
						}
						100% {
							transform: scale(2);
							opacity: 0;
						}
					}

					@keyframes shimmer {
						0% {
							background-position: -200% center;
						}
						100% {
							background-position: 200% center;
						}
					}

					@keyframes expand {
						from {
							width: 0;
						}
						to {
							width: 4rem;
						}
					}

					@keyframes expand-delayed {
						0%, 30% {
							width: 0;
						}
						100% {
							width: 2rem;
						}
					}

					.animate-fade-slide-up {
						animation: fade-slide-up 0.8s ease-out forwards;
						opacity: 0;
					}

					.animate-fade-in {
						animation: fade-in 0.8s ease-out forwards;
						opacity: 0;
					}

					.animate-scale-in {
						animation: scale-in 0.6s ease-out forwards;
						opacity: 0;
					}

					.animate-float-up-enhanced {
						animation: float-up-enhanced 10s infinite;
					}

					.animate-pulse-glow {
						animation: pulse-glow 6s ease-in-out infinite;
					}

					.animate-pulse-glow-delayed {
						animation: pulse-glow-delayed 8s ease-in-out infinite;
						animation-delay: 1s;
					}

					.animate-pulse-glow-slow {
						animation: pulse-glow-slow 10s ease-in-out infinite;
						animation-delay: 2s;
					}

					.animate-heartbeat {
						animation: heartbeat 2s ease-in-out infinite;
					}

					.animate-ping-slow {
						animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
					}

					.animate-shimmer {
						background-size: 200% auto;
						animation: shimmer 3s linear infinite;
					}

					.animate-expand {
						animation: expand 0.8s ease-out forwards;
					}

					.animate-expand-delayed {
						animation: expand-delayed 1.2s ease-out forwards;
					}

					@media (prefers-reduced-motion: reduce) {
						.animate-fade-slide-up,
						.animate-fade-in,
						.animate-scale-in,
						.animate-float-up-enhanced,
						.animate-pulse-glow,
						.animate-pulse-glow-delayed,
						.animate-pulse-glow-slow,
						.animate-heartbeat,
						.animate-ping-slow,
						.animate-shimmer,
						.animate-expand,
						.animate-expand-delayed {
							animation: none;
							opacity: 1;
							transform: none;
						}
					}
				`}</style>
			</footer>
		</div>
	);
};

export default Footer;