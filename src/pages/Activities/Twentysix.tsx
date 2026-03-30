import React, { useState, useEffect, useCallback } from 'react';

// ── BLOCK 4: Closing Ceremony ──
import b4img1 from '../../assets/closing1.jpeg';
import b4img2 from '../../assets/closing2.jpeg';
import b4img3 from '../../assets/closing3.jpeg';
import b4img4 from '../../assets/closing4.jpeg';
import b4img5 from '../../assets/closing5.jpeg';
import b4img6 from '../../assets/closing6.jpeg';
import b4img7 from '../../assets/closing7.jpeg';
import b4img8 from '../../assets/closing8.jpeg';
import b4img9 from '../../assets/closing9.jpeg';
import b4img10 from '../../assets/closing10.jpeg';
import b4img11 from '../../assets/closing11.jpeg';
import b4img12 from '../../assets/closing12.jpeg';
import b4img13 from '../../assets/closing13.jpeg';
import b4img14 from '../../assets/closing14.jpeg';
import b4img15 from '../../assets/closing15.jpeg';
import b4img16 from '../../assets/closing16.jpeg';
import b4img17 from '../../assets/closing17.jpeg';
import b4img18 from '../../assets/closing18.jpeg';
import b4img19 from '../../assets/closing19.jpeg';
import b4img20 from '../../assets/closing20.jpeg';

// ── BLOCK 5: Guest Lectures ──
import b5img1 from '../../assets/guest1.jpeg';
import b5img2 from '../../assets/guest2.jpeg';
import b5img3 from '../../assets/guest3.jpeg';
import b5img4 from '../../assets/guest4.jpeg';
import b5img5 from '../../assets/guest5.jpeg';
import b5img6 from '../../assets/guest6.jpeg';
import b5img7 from '../../assets/guest7.jpeg';
import b5img8 from '../../assets/guest8.jpeg';
import b5img9 from '../../assets/guest9.jpeg';
import b5img10 from '../../assets/guest10.jpeg';
import b5img11 from '../../assets/guest11.jpeg';
import b5img12 from '../../assets/guest12.jpeg';
import b5img13 from '../../assets/guest13.jpeg';
import b5img14 from '../../assets/guest14.jpeg';
import b5img15 from '../../assets/guest15.jpeg';
import b5img16 from '../../assets/guest16.jpeg';
import b5img17 from '../../assets/guest17.jpeg';
import b5img18 from '../../assets/guest18.jpeg';
import b5img19 from '../../assets/guest19.jpeg';
import b5img20 from '../../assets/guest19.jpeg';

// ── BLOCK 6: Registration, Class & Exam Pics ──
import b6img1 from '../../assets/class1.jpeg';
import b6img2 from '../../assets/class2.jpeg';
import b6img3 from '../../assets/class3.jpeg';
import b6img4 from '../../assets/class4.jpeg';
import b6img5 from '../../assets/class5.jpeg';
import b6img6 from '../../assets/class6.jpeg';
import b6img7 from '../../assets/class7.jpeg';
import b6img8 from '../../assets/class8.jpeg';
import b6img9 from '../../assets/class9.jpeg';
import b6img10 from '../../assets/class10.jpeg';
import b6img11 from '../../assets/class11.jpeg';
import b6img12 from '../../assets/class12.jpeg';
import b6img13 from '../../assets/class13.jpeg';
import b6img14 from '../../assets/class14.jpeg';
import b6img15 from '../../assets/class15.jpeg';
import b6img16 from '../../assets/class16.jpeg';
import b6img17 from '../../assets/class17.jpeg';
import b6img18 from '../../assets/class18.jpeg';
import b6img19 from '../../assets/class19.jpeg';
import b6img20 from '../../assets/class20.jpeg';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type MediaItem = {
	id: number;
	type: 'image' | 'video';
	src: string;
	caption: string;
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const block4Items: MediaItem[] = [
	{ id: 1, type: 'image', src: b4img1, caption: 'Closing Ceremony Photo 1' },
	{ id: 2, type: 'image', src: b4img2, caption: 'Closing Ceremony Photo 2' },
	{ id: 3, type: 'image', src: b4img3, caption: 'Closing Ceremony Photo 3' },
	{ id: 4, type: 'image', src: b4img4, caption: 'Closing Ceremony Photo 4' },
	{ id: 5, type: 'image', src: b4img5, caption: 'Closing Ceremony Photo 5' },
	{ id: 6, type: 'image', src: b4img6, caption: 'Closing Ceremony Photo 6' },
	{ id: 7, type: 'image', src: b4img7, caption: 'Closing Ceremony Photo 7' },
	{ id: 8, type: 'image', src: b4img8, caption: 'Closing Ceremony Photo 8' },
	{ id: 9, type: 'image', src: b4img9, caption: 'Closing Ceremony Photo 9' },
	{ id: 10, type: 'image', src: b4img10, caption: 'Closing Ceremony Photo 10' },
	{ id: 11, type: 'image', src: b4img11, caption: 'Closing Ceremony Photo 11' },
	{ id: 12, type: 'image', src: b4img12, caption: 'Closing Ceremony Photo 12' },
	{ id: 13, type: 'image', src: b4img13, caption: 'Closing Ceremony Photo 13' },
	{ id: 14, type: 'image', src: b4img14, caption: 'Closing Ceremony Photo 14' },
	{ id: 15, type: 'image', src: b4img15, caption: 'Closing Ceremony Photo 15' },
	{ id: 16, type: 'image', src: b4img16, caption: 'Closing Ceremony Photo 16' },
	{ id: 17, type: 'image', src: b4img17, caption: 'Closing Ceremony Photo 17' },
	{ id: 18, type: 'image', src: b4img18, caption: 'Closing Ceremony Photo 18' },
	{ id: 19, type: 'image', src: b4img19, caption: 'Closing Ceremony Photo 19' },
	{ id: 20, type: 'image', src: b4img20, caption: 'Closing Ceremony Photo 20' },
];

const block5Items: MediaItem[] = [
	{ id: 1, type: 'image', src: b5img1, caption: 'Guest Lecture Photo 1' },
	{ id: 2, type: 'image', src: b5img2, caption: 'Guest Lecture Photo 2' },
	{ id: 3, type: 'image', src: b5img3, caption: 'Guest Lecture Photo 3' },
	{ id: 4, type: 'image', src: b5img4, caption: 'Guest Lecture Photo 4' },
	{ id: 5, type: 'image', src: b5img5, caption: 'Guest Lecture Photo 5' },
	{ id: 6, type: 'image', src: b5img6, caption: 'Guest Lecture Photo 6' },
	{ id: 7, type: 'image', src: b5img7, caption: 'Guest Lecture Photo 7' },
	{ id: 8, type: 'image', src: b5img8, caption: 'Guest Lecture Photo 8' },
	{ id: 9, type: 'image', src: b5img9, caption: 'Guest Lecture Photo 9' },
	{ id: 10, type: 'image', src: b5img10, caption: 'Guest Lecture Photo 10' },
	{ id: 11, type: 'image', src: b5img11, caption: 'Guest Lecture Photo 11' },
	{ id: 12, type: 'image', src: b5img12, caption: 'Guest Lecture Photo 12' },
	{ id: 13, type: 'image', src: b5img13, caption: 'Guest Lecture Photo 13' },
	{ id: 14, type: 'image', src: b5img14, caption: 'Guest Lecture Photo 14' },
	{ id: 15, type: 'image', src: b5img15, caption: 'Guest Lecture Photo 15' },
	{ id: 16, type: 'image', src: b5img16, caption: 'Guest Lecture Photo 16' },
	{ id: 17, type: 'image', src: b5img17, caption: 'Guest Lecture Photo 17' },
	{ id: 18, type: 'image', src: b5img18, caption: 'Guest Lecture Photo 18' },
	{ id: 19, type: 'image', src: b5img19, caption: 'Guest Lecture Photo 19' },
	{ id: 20, type: 'image', src: b5img20, caption: 'Guest Lecture Photo 20' },
];

const block6Items: MediaItem[] = [
	{ id: 1, type: 'image', src: b6img1, caption: 'Registration / Class / Exam Photo 1' },
	{ id: 2, type: 'image', src: b6img2, caption: 'Registration / Class / Exam Photo 2' },
	{ id: 3, type: 'image', src: b6img3, caption: 'Registration / Class / Exam Photo 3' },
	{ id: 4, type: 'image', src: b6img4, caption: 'Registration / Class / Exam Photo 4' },
	{ id: 5, type: 'image', src: b6img5, caption: 'Registration / Class / Exam Photo 5' },
	{ id: 6, type: 'image', src: b6img6, caption: 'Registration / Class / Exam Photo 6' },
	{ id: 7, type: 'image', src: b6img7, caption: 'Registration / Class / Exam Photo 7' },
	{ id: 8, type: 'image', src: b6img8, caption: 'Registration / Class / Exam Photo 8' },
	{ id: 9, type: 'image', src: b6img9, caption: 'Registration / Class / Exam Photo 9' },
	{ id: 10, type: 'image', src: b6img10, caption: 'Registration / Class / Exam Photo 10' },
	{ id: 11, type: 'image', src: b6img11, caption: 'Registration / Class / Exam Photo 11' },
	{ id: 12, type: 'image', src: b6img12, caption: 'Registration / Class / Exam Photo 12' },
	{ id: 13, type: 'image', src: b6img13, caption: 'Registration / Class / Exam Photo 13' },
	{ id: 14, type: 'image', src: b6img14, caption: 'Registration / Class / Exam Photo 14' },
	{ id: 15, type: 'image', src: b6img15, caption: 'Registration / Class / Exam Photo 15' },
	{ id: 16, type: 'image', src: b6img16, caption: 'Registration / Class / Exam Photo 16' },
	{ id: 17, type: 'image', src: b6img17, caption: 'Registration / Class / Exam Photo 17' },
	{ id: 18, type: 'image', src: b6img18, caption: 'Registration / Class / Exam Photo 18' },
	{ id: 19, type: 'image', src: b6img19, caption: 'Registration / Class / Exam Photo 19' },
	{ id: 20, type: 'image', src: b6img20, caption: 'Registration / Class / Exam Photo 20' },
];

// ─────────────────────────────────────────────
// Download helper
// ─────────────────────────────────────────────
const downloadMedia = async (src: string, filename: string) => {
	try {
		const res = await fetch(src, { mode: 'cors' });
		const blob = await res.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	} catch {
		window.open(src, '_blank');
	}
};

// ─────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────
const Lightbox: React.FC<{
	items: MediaItem[];
	index: number;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
}> = ({ items, index, onClose, onPrev, onNext }) => {
	const item = items[index];

	const handleKey = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowLeft') onPrev();
			if (e.key === 'ArrowRight') onNext();
		},
		[onClose, onPrev, onNext],
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKey);
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', handleKey);
			document.body.style.overflow = '';
		};
	}, [handleKey]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative flex flex-col items-center max-w-5xl w-full mx-4"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Top bar */}
				<div className="flex items-center justify-between w-full mb-3 px-1">
					<span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">
						{index + 1} / {items.length}
					</span>
					<div className="flex gap-3">
						<button
							onClick={() => downloadMedia(item.src, `viraga-vftl-${item.id}`)}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold transition"
						>
							↓ Download
						</button>
						<button
							onClick={onClose}
							className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg transition"
						>
							✕
						</button>
					</div>
				</div>

				{/* Image / Video */}
				<div className="relative w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[280px]">
					{item.type === 'image' ? (
						<img src={item.src} alt={item.caption} className="max-h-[72vh] w-full object-contain" />
					) : (
						<video src={item.src} controls autoPlay className="max-h-[72vh] w-full object-contain" />
					)}

					{/* Caption */}
					<div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
						<p className="text-white text-sm text-center">{item.caption}</p>
					</div>

					{/* Prev / Next */}
					<button
						onClick={onPrev}
						className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-amber-400 hover:text-stone-900 text-white flex items-center justify-center text-xl transition"
					>
						‹
					</button>
					<button
						onClick={onNext}
						className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-amber-400 hover:text-stone-900 text-white flex items-center justify-center text-xl transition"
					>
						›
					</button>
				</div>
			</div>
		</div>
	);
};

// ─────────────────────────────────────────────
// Gallery Grid
// ─────────────────────────────────────────────
const GalleryGrid: React.FC<{
	items: MediaItem[];
	onOpen: (i: number) => void;
	prefix: string;
}> = ({ items, onOpen, prefix }) => (
	<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
		{items.map((item, idx) => (
			<div
				key={`${item.id}-${idx}`}
				className="gallery-card relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
				style={{ background: '#f0f0f0' }}
				onClick={() => onOpen(idx)}
			>
				{item.type === 'image' ? (
					<img src={item.src} alt={item.caption} className="w-full h-full object-cover" />
				) : (
					<>
						<video src={item.src} className="w-full h-full object-cover" muted preload="metadata" />
						<div
							className="absolute inset-0 flex items-center justify-center"
							style={{ background: 'rgba(0,0,0,0.28)' }}
						>
							<div
								className="w-10 h-10 rounded-full flex items-center justify-center text-base"
								style={{ background: '#c8973a', color: '#fff' }}
							>
								▶
							</div>
						</div>
					</>
				)}

				{/* Hover overlay */}
				<div
					className="overlay absolute inset-0 opacity-0 flex flex-col justify-end p-3"
					style={{
						background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)',
					}}
				>
					<p className="text-white text-xs mb-2 line-clamp-2">{item.caption}</p>
					<div className="flex gap-2">
						<ActionBtn label={item.type === 'video' ? '▶ Play' : '⤢ Zoom'} />
						<ActionBtn
							label="↓"
							onClick={(e) => {
								e.stopPropagation();
								downloadMedia(
									item.src,
									`${prefix}-${item.id}${item.type === 'video' ? '.mp4' : '.jpg'}`,
								);
							}}
						/>
					</div>
				</div>
			</div>
		))}
	</div>
);

// ─────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────
const SectionTitle: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
	<div className="flex items-center gap-3">
		<span className="text-xl">{icon}</span>
		<h3
			style={{
				fontFamily: "'Cormorant Garamond', serif",
				fontSize: '1.55rem',
				color: '#1a1a1a',
				fontWeight: 600,
			}}
		>
			{label}
		</h3>
		<div
			className="flex-1 h-px"
			style={{
				background: 'linear-gradient(90deg, #c8973a44, transparent)',
			}}
		/>
	</div>
);

const ActionBtn: React.FC<{
	label: string;
	onClick?: (e: React.MouseEvent) => void;
}> = ({ label, onClick }) => (
	<button
		onClick={onClick}
		className="text-[11px] font-medium px-2 py-0.5 rounded-full transition hover:opacity-80"
		style={{ background: '#c8973a', color: '#fff' }}
	>
		{label}
	</button>
);

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
const VFTLGalleryPage: React.FC = () => {
	const [block4Lb, setBlock4Lb] = useState<number | null>(null);
	const [block5Lb, setBlock5Lb] = useState<number | null>(null);
	const [block6Lb, setBlock6Lb] = useState<number | null>(null);

	const prev = (items: MediaItem[], set: React.Dispatch<React.SetStateAction<number | null>>) => () =>
		set((i) => (i !== null ? (i - 1 + items.length) % items.length : 0));

	const next = (items: MediaItem[], set: React.Dispatch<React.SetStateAction<number | null>>) => () =>
		set((i) => (i !== null ? (i + 1) % items.length : 0));

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        .gallery-card {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.3), box-shadow 0.3s ease;
        }
        .gallery-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 48px rgba(0,0,0,0.15);
        }
        .gallery-card:hover .overlay { opacity: 1; }
        .overlay { transition: opacity 0.3s ease; }
        .soft-divider { background: linear-gradient(90deg, transparent, #e0e0e0, transparent); }
      `}</style>

			<div
				className="min-h-screen pt-16 w-full"
				style={{
					background: '#ffffff',
					fontFamily: "'Jost', sans-serif",
					color: '#1c1c1c',
				}}
			>
				{/* ── Page Header ── */}
				<div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
					<div className="flex sm:flex-row flex-col items-center gap-3 mb-5">
						<span
							className="text-[10px] tracking-[0.3em] uppercase font-medium px-3 py-1 rounded-full border"
							style={{
								color: '#c8973a',
								borderColor: '#c8973a55',
								background: '#c8973a11',
							}}
						>
							Viraga Foundation
						</span>
						<span className="text-gray-400 text-sm font-semibold tracking-widest">
							Vibrant Futures – Transforming Lives
						</span>
					</div>
					<h1
						style={{
							fontFamily: "'Cormorant Garamond', serif",
							fontSize: 'clamp(1.7rem, 4.5vw, 2.8rem)',
							fontWeight: 700,
							color: '#1a1a1a',
							letterSpacing: '-0.01em',
							lineHeight: 1.2,
						}}
					>
						VFTL Programme Gallery
					</h1>
					<p
						className="mt-1"
						style={{
							fontFamily: "'Cormorant Garamond', serif",
							fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
							fontStyle: 'italic',
							color: '#c8973a',
						}}
					>
						Registration, Classes, Exams · Guest Lectures · Closing Ceremony
					</p>
					<div
						className="mt-6 h-px w-full"
						style={{
							background: 'linear-gradient(90deg, transparent, #c8973a, transparent)',
						}}
					/>
				</div>

				{/* ════ SECTION 1 — Registration, Class & Exam Pics ════ */}
				<section className="max-w-6xl mx-auto px-6 pt-10 pb-14">
					<SectionTitle icon="🏫" label="V F T L Registration, Class & Exam Pics" />
					<GalleryGrid items={block6Items} onOpen={(i) => setBlock6Lb(i)} prefix="viraga-block6" />
				</section>

				<div className="soft-divider h-px max-w-5xl mx-auto" />

				{/* ════ SECTION 2 — Guest Lectures ════ */}
				<section className="max-w-6xl mx-auto px-6 pt-14 pb-14">
					<SectionTitle icon="🎤" label="V F T L Guest Lectures" />
					<GalleryGrid items={block5Items} onOpen={(i) => setBlock5Lb(i)} prefix="viraga-block5" />
				</section>

				<div className="soft-divider h-px max-w-5xl mx-auto" />



				{/* ════ SECTION 3 — Closing Ceremony ════ */}
				<section className="max-w-6xl mx-auto px-6 pt-14 pb-20">
					<SectionTitle icon="🎓" label="V F T L Closing Ceremony" />
					<GalleryGrid items={block4Items} onOpen={(i) => setBlock4Lb(i)} prefix="viraga-block4" />
				</section>
      
      

        <div className='max-w-6xl mx-auto px-6 text-xl font-medium py-2'> 
             "🏆 ఇటీవల జేఎన్వీఎస్టీ 2026 పరీక్షకు సంబంధించి విరాగ ఫౌండేషన్ 21 మంది విద్యార్థులకు ప్రత్యేక శిక్షణ ఇచ్చింది. ఈ పరీక్షలో 7 మంది విద్యార్థులు అర్హత సాధించడం గర్వకారణం. ముఖ్యంగా ఘంటసాల యశ్వంత్ నాగ సాయి (హాల్ టికెట్ నం: 1029231) ప్రధాన జాబితాలో ఎంపిక కావడం విశేషం. ఈ సందర్భంగా అతనికి హృదయపూర్వక అభినందనలు తెలియజేస్తున్నాం.
ఇతరంగా కే బి ఎస్ ఎస్ భావేష్, వి ఎం నాగ సాయి, ఎన్ ధరణి శ్రీ, బి రూపావతి, ఎం ఎస్తేర్ రాణి మరియు జి బి సాయి కుమార్ అనే ఆరుగురు విద్యార్థులు అర్హత సాధించి, రెండో లేదా మూడో జాబితాలో సీటు పొందే అవకాశాలు ఉన్నాయి. వీరందరికీ కూడా శుభాకాంక్షలు తెలియజేస్తున్నాం.
ఈ విజయాల వెనుక ఉపాధ్యాయులు, దాతలు, తల్లిదండ్రులు మరియు విద్యార్థుల కృషి ఎంతో ఉంది. వారి సహకారం వల్లే ఈ ఫలితాలు సాధ్యమయ్యాయి 🙏🏻."
        </div>



				{/* Footer */}
				<footer className="text-center py-6 text-gray-400 text-xs tracking-widest border-t border-gray-200">
					© 2025 Viraga Foundation · Vibrant Futures – Transforming Lives
				</footer>
			</div>

			{/* ── Lightboxes ── */}
			{block6Lb !== null && (
				<Lightbox
					items={block6Items}
					index={block6Lb}
					onClose={() => setBlock6Lb(null)}
					onPrev={prev(block6Items, setBlock6Lb)}
					onNext={next(block6Items, setBlock6Lb)}
				/>
			)}
			{block5Lb !== null && (
				<Lightbox
					items={block5Items}
					index={block5Lb}
					onClose={() => setBlock5Lb(null)}
					onPrev={prev(block5Items, setBlock5Lb)}
					onNext={next(block5Items, setBlock5Lb)}
				/>
			)}
			{block4Lb !== null && (
				<Lightbox
					items={block4Items}
					index={block4Lb}
					onClose={() => setBlock4Lb(null)}
					onPrev={prev(block4Items, setBlock4Lb)}
					onNext={next(block4Items, setBlock4Lb)}
				/>
			)}
		</>
	);
};

export default VFTLGalleryPage;
