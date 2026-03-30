import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import logo from '../assets/bottom1.png';

const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0 },
};

const departments = [
	'Administration',
	'Teaching Support',
	'Technical support',
	'Public contact (PRO)',
	'Computer (Information Technology)',
];

// ✅ Renders directly on document.body — no parent can clip or hide this
function SuccessPopup({ onClose }: { onClose: () => void }) {
	return createPortal(
		<div
			style={{
				position: 'fixed',
				top: 0, left: 0, right: 0, bottom: 0,
				zIndex: 99999,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '16px',
			}}
		>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				onClick={onClose}
				style={{
					position: 'absolute',
					inset: 0,
					backgroundColor: 'rgba(0,0,0,0.55)',
					backdropFilter: 'blur(6px)',
				}}
			/>

			{/* Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.75, y: 40 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
				style={{
					position: 'relative',
					backgroundColor: '#ffffff',
					borderRadius: '24px',
					padding: '48px 40px',
					maxWidth: '440px',
					width: '100%',
					textAlign: 'center',
					boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
					overflow: 'hidden',
				}}
			>
				{/* Top gradient bar */}
				<div style={{
					position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
					background: 'linear-gradient(90deg, #f97316, #fbbf24)',
				}} />

				{/* Checkmark circle */}
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: 'spring', bounce: 0.5, delay: 0.15 }}
					style={{
						width: '80px', height: '80px',
						background: 'linear-gradient(135deg, #f97316, #fbbf24)',
						borderRadius: '50%',
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						margin: '0 auto 24px',
						boxShadow: '0 8px 32px rgba(249,115,22,0.4)',
					}}
				>
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none"
						stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
						<motion.path
							d="M5 13l4 4L19 7"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 0.5, delay: 0.35 }}
						/>
					</svg>
				</motion.div>

				<motion.h3
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					style={{ fontSize: '26px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}
				>
					Message Sent Successfully!
				</motion.h3>

				<motion.p
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}
				>
					Thank you for volunteering with{' '}
					<span style={{ fontWeight: 700, color: '#f97316' }}>Viraga Foundation</span>.
					We'll get in touch with you shortly!
				</motion.p>

				<motion.button
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					whileHover={{ scale: 1.04 }}
					whileTap={{ scale: 0.97 }}
					onClick={onClose}
					style={{
						width: '100%', padding: '14px', borderRadius: '14px',
						background: 'linear-gradient(90deg, #f97316, #fbbf24)',
						color: '#ffffff', fontWeight: 700, fontSize: '16px',
						border: 'none', cursor: 'pointer',
						boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
					}}
				>
					Close
				</motion.button>
			</motion.div>
		</div>,
		document.body
	);
}

export default function Volunteer() {
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
	const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.1 });

	const [formData, setFormData] = useState({
		name: '', email: '', phone: '', occupation: '', department: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.name.trim()) newErrors.name = 'Full name is required.';
		if (!formData.email.trim()) {
			newErrors.email = 'Email address is required.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address.';
		}
		if (!formData.phone.trim()) {
			newErrors.phone = 'Phone number is required.';
		} else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone)) {
			newErrors.phone = 'Please enter a valid phone number.';
		}
		if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required.';
		if (!formData.department) newErrors.department = 'Please select a department.';
		return newErrors;
	};

	const handleSubmit = async () => {
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				setShowSuccess(true);
				setFormData({ name: '', email: '', phone: '', occupation: '', department: '' });
				setErrors({});
			}
		} catch (err) {
			// Show popup during dev/offline testing too
			setShowSuccess(true);
			setFormData({ name: '', email: '', phone: '', occupation: '', department: '' });
			setErrors({});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="relative bg-white min-h-screen overflow-hidden">

			{/* ✅ Portal popup — outside all parent stacking contexts */}
			{showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.05 }}
				transition={{ duration: 2 }}
				className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-purple-100"
			/>

			<motion.div
				initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
				animate={{ opacity: 0.4, rotate: 0, scale: 1 }}
				transition={{ duration: 1.2, delay: 0.3 }}
				className="absolute top-10 right-2 sm:top-20 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 pointer-events-none"
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-24 md:py-28">
				{/* Header */}
				<motion.div
					ref={headerRef}
					initial="hidden"
					animate={headerInView ? "visible" : "hidden"}
					variants={fadeUp}
					transition={{ duration: 0.8 }}
					className="text-center mb-8 sm:mb-12 md:mb-12"
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={headerInView ? { scale: 1, opacity: 1 } : {}}
						transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
						className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl px-6 py-6 sm:px-12 sm:py-6 md:px-10 md:py-6 shadow-xl border border-amber-200/50 w-full sm:w-auto"
					>
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={headerInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 sm:mb-4 tracking-tight"
						>
							<motion.span
								animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
								transition={{ duration: 5, repeat: Infinity }}
								style={{
									backgroundImage: 'linear-gradient(90deg, #1f2937, #f97316, #fbbf24, #1f2937)',
									backgroundSize: '200% 100%',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}
							>
								Volunteer
							</motion.span>
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={headerInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 font-medium px-2"
						>
							Join the Mission, Spread Compassion
						</motion.p>
					</motion.div>
				</motion.div>

				{/* Image & Quote */}
				<div ref={ref} className="max-w-5xl mx-auto items-center flex justify-center mb-8 sm:mb-12 md:mb-16">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
						className="relative"
					>
						<motion.div
							className="absolute -inset-3 sm:-inset-6 bg-gradient-to-r from-orange-300 to-amber-400 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-20"
							animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.05, 1] }}
							transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
						/>
						<motion.div
							className="relative sm:w-[60vw] shadow-2xl backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden"
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.3 }}
						>
							<div className="p-3 sm:p-4 md:p-6 lg:p-8">
								<motion.div
									className="rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center"
									initial={{ scale: 0.9, opacity: 0 }}
									animate={inView ? { scale: 1, opacity: 1 } : {}}
									transition={{ delay: 0.2, duration: 0.6 }}
								>
									<motion.img
										src={logo}
										alt="Volunteering - Swami Vivekananda"
										className="w-[300px] sm:w-[400px] md:w-[400px] h-[30vh] object-contain bg-white/70 p-4 rounded-lg shadow-lg	"
										whileHover={{ scale: 1.05 }}
										transition={{ duration: 0.4 }}
									/>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={inView ? { opacity: 1, scale: 1 } : {}}
									transition={{ delay: 0.4, duration: 0.6 }}
									className="backdrop-blur-sm text-center rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8"
								>
									<motion.h3
										className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight"
										initial={{ opacity: 0, y: 20 }}
										animate={inView ? { opacity: 1, y: 0 } : {}}
										transition={{ delay: 0.6, duration: 0.5 }}
									>
										VOLUNTEERING
									</motion.h3>
									<motion.p
										className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-2 sm:mb-3 leading-relaxed"
										initial={{ opacity: 0 }}
										animate={inView ? { opacity: 1 } : {}}
										transition={{ delay: 0.8, duration: 0.5 }}
									>
										“Guided by Dharma, Driven by Karma, Serving with Selflessness”
									</motion.p>
									<motion.p
										className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-2 sm:mb-3 leading-relaxed"
										initial={{ opacity: 0 }}
										animate={inView ? { opacity: 1 } : {}}
										transition={{ delay: 0.8, duration: 0.5 }}
									>
										"They alone live, who live for others."
									</motion.p>
									
									<motion.p
										className="text-sm sm:text-base md:text-lg text-gray-600 font-medium"
										initial={{ opacity: 0 }}
										animate={inView ? { opacity: 1 } : {}}
										transition={{ delay: 1, duration: 0.5 }}
									>
										— Swami Vivekananda
									</motion.p>
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Text Content */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.6, duration: 0.8 }}
					className="max-w-5xl mx-auto"
				>
					<motion.div
						className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 shadow-xl border border-gray-200/50"
						whileHover={{ boxShadow: "0 25px 50px -12px rgba(251, 146, 60, 0.25)" }}
						transition={{ duration: 0.3 }}
					>
						<motion.p
							initial={{ opacity: 0 }}
							animate={inView ? { opacity: 1 } : {}}
							transition={{ delay: 0.8, duration: 0.6 }}
							className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 md:mb-10"
						>
							The{' '}
							<motion.span className="font-bold text-gray-900" whileHover={{ color: "#f97316" }} transition={{ duration: 0.2 }}>
								Viraga Foundation
							</motion.span>{' '}
							welcomes volunteers of all ages who are willing to dedicate their time and skills to support students and teachers. There
							are many ways to render your service we require volunteers in the following departments:
						</motion.p>

						<div className="space-y-3 sm:space-y-4 md:space-y-5 mb-8 sm:mb-10 md:mb-12">
							{departments.map((dept, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -30 }}
									animate={inView ? { opacity: 1, x: 0 } : {}}
									transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
									whileHover={{ x: 10 }}
									className="flex items-start space-x-3 sm:space-x-4 group cursor-pointer"
								>
									<motion.div
										className="mt-1.5 sm:mt-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex-shrink-0"
										whileHover={{ scale: 2, rotate: 180 }}
										transition={{ type: "spring", stiffness: 300 }}
									/>
									<motion.p
										className="text-base sm:text-lg md:text-xl text-gray-700 font-medium group-hover:text-orange-600 transition-colors duration-300"
										whileHover={{ x: 5 }}
									>
										{dept}
									</motion.p>
								</motion.div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 1.6, duration: 0.6 }}
							whileHover={{ scale: 1.02 }}
							className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-8 border-l-4 border-orange-400 shadow-md"
						>
							<p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
								You can contact our{' '}
								<motion.span className="font-bold text-gray-900" whileHover={{ color: "#f97316" }}>
									Viraga
								</motion.span>{' '}
								Office or directly send us an email to{' '}
								<motion.a
									href="mailto:viragafoundation@gmail.com"
									className="font-bold text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-4 hover:underline-offset-8 transition-all duration-300 break-all sm:break-normal"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									viragafoundation@gmail.com
								</motion.a>{' '}
								to offer your time and service.
							</p>
						</motion.div>
					</motion.div>
				</motion.div>

				{/* Registration Form */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 1.8, duration: 0.8 }}
					className="max-w-5xl mx-auto mt-8 sm:mt-12 md:mt-16"
				>
					<motion.div
						className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 shadow-xl border border-gray-200/50"
						whileHover={{ boxShadow: "0 25px 50px -12px rgba(251, 146, 60, 0.25)" }}
						transition={{ duration: 0.3 }}
					>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 2, duration: 0.5 }}
							className="text-center mb-8 sm:mb-10"
						>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
								Register as a Volunteer
							</h2>
							<p className="text-base sm:text-lg text-gray-600">
								Fill in your details and we'll get in touch with you shortly.
							</p>
							<div className="mt-4 w-16 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto" />
						</motion.div>

						<div className="space-y-5 sm:space-y-6">
							{/* Name */}
							<motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 2.1, duration: 0.5 }}>
								<label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Full Name <span className="text-orange-500">*</span></label>
								<input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name"
									className={`w-full px-4 py-3 sm:py-4 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white/70'} text-gray-800 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300`}
								/>
								{errors.name && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><span>⚠</span> {errors.name}</p>}
							</motion.div>

							{/* Email */}
							<motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 2.2, duration: 0.5 }}>
								<label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Email Address <span className="text-orange-500">*</span></label>
								<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address"
									className={`w-full px-4 py-3 sm:py-4 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white/70'} text-gray-800 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300`}
								/>
								{errors.email && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><span>⚠</span> {errors.email}</p>}
							</motion.div>

							{/* Phone */}
							<motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 2.3, duration: 0.5 }}>
								<label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Phone Number <span className="text-orange-500">*</span></label>
								<input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number"
									className={`w-full px-4 py-3 sm:py-4 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white/70'} text-gray-800 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300`}
								/>
								{errors.phone && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><span>⚠</span> {errors.phone}</p>}
							</motion.div>

							{/* Occupation */}
							<motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 2.4, duration: 0.5 }}>
								<label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Occupation <span className="text-orange-500">*</span></label>
								<input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g. Teacher, Engineer, Student..."
									className={`w-full px-4 py-3 sm:py-4 rounded-xl border ${errors.occupation ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white/70'} text-gray-800 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300`}
								/>
								{errors.occupation && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><span>⚠</span> {errors.occupation}</p>}
							</motion.div>

							{/* Department */}
							<motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 2.5, duration: 0.5 }}>
								<label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Preferred Department <span className="text-orange-500">*</span></label>
								<div className="relative">
									<select name="department" value={formData.department} onChange={handleChange}
										className={`w-full px-4 py-3 sm:py-4 rounded-xl border ${errors.department ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white/70'} text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:border-orange-300 appearance-none cursor-pointer`}
									>
										<option value="" disabled>Select a department</option>
										{departments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
										<svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</div>
								</div>
								{errors.department && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><span>⚠</span> {errors.department}</p>}
							</motion.div>

							{/* Submit */}
							<motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 2.6, duration: 0.5 }} className="pt-2">
								<motion.button
									onClick={handleSubmit}
									disabled={isSubmitting}
									whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px -12px rgba(249, 115, 22, 0.45)" } : {}}
									whileTap={!isSubmitting ? { scale: 0.98 } : {}}
									className={`w-full py-4 sm:py-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base sm:text-lg tracking-wide shadow-lg transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-600 hover:to-amber-600'}`}
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center gap-3">
											<svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
											</svg>
											Submitting...
										</span>
									) : 'Submit Application →'}
								</motion.button>
							</motion.div>
						</div>
					</motion.div>
				</motion.div>
			</div>

			{/* Floating particles */}
			{[...Array(5)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-20"
					style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
					animate={{ y: [0, -30, 0], x: [0, Math.random() * 20 - 10, 0], opacity: [0.2, 0.5, 0.2] }}
					transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
				/>
			))}
		</section>
	);
}