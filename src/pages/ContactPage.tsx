import { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import bgpic from '../assets/contact.png';

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		message: '',
	});
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		
		// Show success modal
		setShowSuccessModal(true);
		
		// Reset form
		setFormData({
			name: '',
			email: '',
			phone: '',
			message: '',
		});
	};

	const closeModal = () => {
		setShowSuccessModal(false);
	};

	return (
		<div className="bg-white">
			{/* ================= HERO SECTION ================= */}
			<section className="relative h-[70vh] sm:h-[90vh] w-full">
				<img src={bgpic} alt="Contact Us" className="h-full w-full object-cover" />
				<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
					<h1 className="text-4xl md:text-7xl text-center font-bold text-white tracking-wide">
						Lets Connect <br />&<br /> Make a Difference Together
					</h1>
				</div>
			</section>

			{/* ================= CONTACT DETAILS ================= */}
			<section className="py-10 px-6">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">VIRAGA FOUNDATION</h2>

					<p className="text-lg text-gray-700 font-bold leading-relaxed">
						Plot No.8, Road No.2, Sector-V,
						<br />
						Lotus Land Mark, Ayodhyanagar,
						<br />
						Vijayawada – 520003
					</p>

					<p className="mt-6 text-lg text-gray-700">
						<strong>Email:</strong>{' '}
						<a href="mailto:viragafoundation@gmail.com" className="text-blue-700 hover:underline">
							viragafoundation@gmail.com
						</a>
					</p>

					<p className="mt-2 text-lg text-gray-700">
						<strong>Mobile & WhatsApp:</strong>{' '}
						<a href="tel:9492940941" className="text-blue-700 hover:underline">
							9492940941
						</a>
					</p>

					<p className="mt-2 text-lg text-gray-700">
						<strong>Website:</strong>{' '}
						<a
							href="https://viraga.org"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-700 hover:underline"
						>
							www.viraga.org
						</a>
					</p>
				</div>
			</section>

			{/* ================= NGO EXTRA CONTENT ================= */}
			<section className="bg-gray-50 py-10 px-6">
				<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
					<div className="mx-auto max-w-6xl grid gap-5 text-center">
						<div className="rounded-xl bg-white p-8 shadow-md">
							<h3 className="text-xl font-semibold mb-3">🤝 Volunteer With Us</h3>
							<p className="text-gray-700 leading-relaxed">
								Join our mission and become a part of meaningful change. Your time, skills, and
								compassion can help uplift lives and strengthen communities.
							</p>
						</div>

						<div className="rounded-xl bg-white p-8 shadow-md">
							<h3 className="text-xl font-semibold mb-3">🌱 Support Our Cause</h3>
							<p className="text-gray-700 leading-relaxed">
								Every contribution matters. Your support enables us to provide food, education,
								healthcare, and hope to those who need it most.
							</p>
						</div>

						<div className="rounded-xl bg-white p-8 shadow-md">
							<h3 className="text-xl font-semibold mb-3">🤲 Partner With Us</h3>
							<p className="text-gray-700 leading-relaxed">
								We welcome collaborations with individuals, institutions, and organizations who share
								our vision of service, compassion, and empowerment.
							</p>
						</div>
					</div>
					<div className=" ">
						<div className="bg-white rounded-2xl shadow-2xl w-full sm:px-16 overflow-hidden ">
							{/* Form Header */}
							<div className=" mt-4 p-4  rounded-lg">
								<h3 className="text-black font-bold text-lg text-start ">Send us a Message</h3>
							</div>

							{/* Form Body */}
							<form onSubmit={handleSubmit} className="p-6 space-y-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="Your name"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="your@email.com"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="Your phone number"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
									<textarea
										name="message"
										value={formData.message}
										onChange={handleInputChange}
										required
										rows={3}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
										placeholder="How can we help you?"
									/>
								</div>

								<button
									type="submit"
									className="w-full bg-orange-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
								>
									Send Message
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>

			{/* ================= CLOSING MESSAGE ================= */}
			<section className="py-16 px-6 text-center">
				<div className="mx-auto max-w-4xl">
					<p className="text-xl font-medium text-gray-900">
						🌸 Together, let us serve humanity with compassion and purpose.
					</p>
					<p className="mt-4 text-lg text-gray-700">
						Reach out to us — your support, questions, and involvement make a meaningful difference.
					</p>
				</div>
			</section>

			{/* ================= SUCCESS MODAL ================= */}
			{showSuccessModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
					{/* Backdrop */}
					<div 
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={closeModal}
					/>
					
					{/* Modal */}
					<div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
						{/* Decorative Background Elements */}
						<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
						<div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-3xl" />
						
						{/* Close Button */}
						<button
							onClick={closeModal}
							className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
						>
							<X className="w-5 h-5 text-gray-600" />
						</button>

						{/* Content */}
						<div className="relative p-8 text-center">
							{/* Success Icon */}
							<div className="mb-6 flex justify-center">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
									<CheckCircle className="relative w-20 h-20 text-green-500 animate-bounce-once" />
								</div>
							</div>

							{/* Sparkles */}
							<div className="absolute top-8 left-12">
								<Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
							</div>
							<div className="absolute top-16 right-16">
								<Sparkles className="w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
							</div>
							<div className="absolute bottom-20 left-16">
								<Sparkles className="w-5 h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
							</div>

							{/* Title */}
							<h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">
								Message Sent Successfully!
							</h3>

							{/* Message */}
							<p className="text-gray-700 text-lg mb-6 leading-relaxed">
								Thank you for reaching out to us! 🙏
								<br />
								<span className="text-purple-600 font-semibold">We will get back to you soon.</span>
							</p>

							{/* Decorative Line */}
							<div className="flex items-center justify-center gap-2 mb-6">
								<div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
								<div className="w-2 h-2 bg-orange-500 rounded-full" />
								<div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" />
							</div>

							{/* Close Button */}
							<button
								onClick={closeModal}
								className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ================= CUSTOM STYLES ================= */}
			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes scale-up {
					from {
						transform: scale(0.9);
						opacity: 0;
					}
					to {
						transform: scale(1);
						opacity: 1;
					}
				}

				@keyframes bounce-once {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}

				.animate-scale-up {
					animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
				}

				.animate-bounce-once {
					animation: bounce-once 0.6s ease-out;
				}
			`}</style>
		</div>
	);
};

export default ContactPage;







// import bgpic from '../assets/contact.png'
// const ContactPage = () => {
//   return (
//     <div className="bg-white">
//       {/* ================= HERO SECTION ================= */}
//       <section className="relative h-[70vh] sm:h-[90vh] w-full">
//         <img
//           src={bgpic}
//           alt="Contact Us"
//           className="h-full w-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
//           <h1 className="text-4xl md:text-7xl text-center font-bold text-white tracking-wide">
//             Lets Connect <br/>&<br/> Make a Difference Together
//           </h1>
//         </div>
//       </section>

//       {/* ================= CONTACT DETAILS ================= */}
//       <section className="py-10 px-6">
//         <div className="mx-auto max-w-4xl text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             VIRAGA FOUNDATION
//           </h2>

//           <p className="text-lg text-gray-700 font-bold leading-relaxed">
//             Plot No.8, Road No.2, Sector-V,
//             <br />
//             Lotus Land Mark, Ayodhyanagar,
//             <br />
//             Vijayawada – 520003
//           </p>

//           <p className="mt-6 text-lg text-gray-700">
//             <strong>Email:</strong>{" "}
//             <a
//               href="mailto:viragafoundation@gmail.com"
//               className="text-blue-700 hover:underline"
//             >
//               viragafoundation@gmail.com
//             </a>
//           </p>

//           <p className="mt-2 text-lg text-gray-700">
//             <strong>Mobile & WhatsApp:</strong>{" "}
//             <a
//               href="tel:9492940941"
//               className="text-blue-700 hover:underline"
//             >
//               9492940941
//             </a>
//           </p>

//           <p className="mt-2 text-lg text-gray-700">
//             <strong>Website:</strong>{" "}
//             <a
//               href="https://viragafoundation.org"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-700 hover:underline"
//             >
//               www.viragafoundation.org
//             </a>
//           </p>
//         </div>
//       </section>

//       {/* ================= NGO EXTRA CONTENT ================= */}
//       <section className="bg-gray-50 py-10 px-6">
//         <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-3 text-center">
//           <div className="rounded-xl bg-white p-8 shadow-md">
//             <h3 className="text-xl font-semibold mb-3">
//               🤝 Volunteer With Us
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               Join our mission and become a part of meaningful change.
//               Your time, skills, and compassion can help uplift lives
//               and strengthen communities.
//             </p>
//           </div>

//           <div className="rounded-xl bg-white p-8 shadow-md">
//             <h3 className="text-xl font-semibold mb-3">
//               🌱 Support Our Cause
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               Every contribution matters. Your support enables us
//               to provide food, education, healthcare, and hope
//               to those who need it most.
//             </p>
//           </div>

//           <div className="rounded-xl bg-white p-8 shadow-md">
//             <h3 className="text-xl font-semibold mb-3">
//               🤲 Partner With Us
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               We welcome collaborations with individuals,
//               institutions, and organizations who share our
//               vision of service, compassion, and empowerment.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================= CLOSING MESSAGE ================= */}
//       <section className="py-16 px-6 text-center">
//         <div className="mx-auto max-w-4xl">
//           <p className="text-xl font-medium text-gray-900">
//             🌸 Together, let us serve humanity with compassion and purpose.
//           </p>
//           <p className="mt-4 text-lg text-gray-700">
//             Reach out to us — your support, questions, and involvement
//             make a meaningful difference.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ContactPage;
