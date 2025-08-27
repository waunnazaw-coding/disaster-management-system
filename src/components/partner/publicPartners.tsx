


// import React, { useEffect, useMemo, useState } from "react";
// import { usePublicPartnerStore } from "@/store/publicPartnerStore";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion, useAnimationControls } from "framer-motion";
// import { Skeleton } from "@/components/ui/skeleton";

// // Tuning constants
// const ITEM_WIDTH = 220;
// const GAP_PX = 24;
// const SLIDE_DURATION = 0.9;
// const PAUSE_DURATION = 0.9;
// const STEP_MS = (SLIDE_DURATION + PAUSE_DURATION) * 1000;

// const PublicPartners: React.FC = () => {
//   const { partners, loading, error, fetchPublicPartners, clearError } = usePublicPartnerStore();

//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const controls = useAnimationControls();

//   useEffect(() => {
//     fetchPublicPartners();
//   }, [fetchPublicPartners]);

//   // Duplicate list for seamless looping
//   const looped = useMemo(() => {
//     if (!partners || partners.length === 0) return [];
//     return [...partners, ...partners];
//   }, [partners]);

//   const total = partners?.length ?? 0;
//   const step = ITEM_WIDTH + GAP_PX;

//   // Reset position when partners change
//   useEffect(() => {
//     setIndex(0);
//     controls.set({ x: 0 });
//   }, [total, controls]);

//   // Auto-advance one item at a time with a pause
//   useEffect(() => {
//     if (paused || total <= 1) return;

//     const id = setInterval(() => {
//       void next();
//     }, STEP_MS);

//     return () => clearInterval(id);
//   }, [paused, total, index]);

//   async function next() {
//     if (total <= 1) return;
//     const nextIndex = index + 1;

//     setIndex(nextIndex);
//     await controls.start({
//       x: -(nextIndex * step),
//       transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
//     });

//     // seamless wrap
//     if (nextIndex >= total) {
//       controls.set({ x: -((nextIndex - total) * step) });
//       setIndex(nextIndex - total);
//     }
//   }

//   async function prev() {
//     if (total <= 1) return;

//     if (index === 0) {
//       controls.set({ x: -((index + total) * step) });
//       const newIndex = total - 1;
//       setIndex(newIndex);
//       await controls.start({
//         x: -(newIndex * step),
//         transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
//       });
//       return;
//     }

//     const newIndex = index - 1;
//     setIndex(newIndex);
//     await controls.start({
//       x: -(newIndex * step),
//       transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
//     });
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive" className="mb-6 max-w-4xl mx-auto rounded-xl">
//         <AlertCircle className="h-5 w-5" />
//         <AlertTitle>Error Loading Partners</AlertTitle>
//         <AlertDescription>
//           {error}
//           <button onClick={clearError} className="ml-2 text-sm underline font-medium">
//             Dismiss
//           </button>
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="py-10">
//         <div className="max-w-6xl mx-auto overflow-hidden">
//           <div className="flex gap-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} style={{ width: ITEM_WIDTH }} className="flex-shrink-0">
//                 <div className="flex flex-col items-center">
//                   <Skeleton className="h-16 w-32 mb-3" />
//                   <Skeleton className="h-4 w-40" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!partners || partners.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-600">No partners yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative py-8">
//       <div
//         className="relative max-w-6xl mx-auto overflow-hidden"
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//       >
//         {/* Left Button */}
//         {total > 1 && (
//           <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 z-10">
//             <Button
//               size="icon"
//               variant="outline"
//               className="pointer-events-auto rounded-full shadow bg-white/90 hover:bg-white"
//               onClick={() => {
//                 setPaused(true);
//                 void prev();
//               }}
//               aria-label="Previous partner"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//           </div>
//         )}

//         {/* Right Button */}
//         {total > 1 && (
//           <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 z-10">
//             <Button
//               size="icon"
//               variant="outline"
//               className="pointer-events-auto rounded-full shadow bg-white/90 hover:bg-white"
//               onClick={() => {
//                 setPaused(true);
//                 void next();
//               }}
//               aria-label="Next partner"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//           </div>
//         )}

//         {/* Track */}
//         <div className="overflow-hidden py-6">
//           <motion.div
//             animate={controls}
//             className="flex items-center gap-6 will-change-transform"
//             style={{ x: 0 }}
//           >
//             {looped.map((partner, i) => (
//               <div
//                 key={`${partner.id ?? partner.name}-${i}`}
//                 className="flex-shrink-0"
//                 style={{ width: ITEM_WIDTH }}
//               >
//                 <div className="flex flex-col items-center">
//                   {/* Logo */}
//                   <div className="h-16 flex items-center justify-center">
//                     {partner.logoUrl ? (
//                       <img
//                         src={partner.logoUrl}
//                         alt={partner.name}
//                         className="h-16 w-auto object-contain"
//                         loading="lazy"
//                       />
//                     ) : (
//                       <div className="h-16 w-28 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
//                         No Logo
//                       </div>
//                     )}
//                   </div>
//                   {/* Name */}
//                   <p className="mt-3 text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-2">
//                     {partner.name}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicPartners;



import React, { useEffect, useMemo, useState } from "react";
import { usePublicPartnerStore } from "@/store/publicPartnerStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useAnimationControls } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Tuning constants
const ITEM_WIDTH = 220;
const GAP_PX = 24;
const SLIDE_DURATION = 0.9;
const PAUSE_DURATION = 0.9;
const STEP_MS = (SLIDE_DURATION + PAUSE_DURATION) * 1000;

// 👇 ensure enough items to avoid "empty space"
const MIN_LOOP_ITEMS = 12;

const PublicPartners: React.FC = () => {
  const { partners, loading, error, fetchPublicPartners, clearError } =
    usePublicPartnerStore();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    fetchPublicPartners();
  }, [fetchPublicPartners]);

  // ✅ Repeat partners enough times to always fill carousel
  const looped = useMemo(() => {
    if (!partners || partners.length === 0) return [];

    // How many times to repeat?
    const repeatCount = Math.ceil(MIN_LOOP_ITEMS / partners.length);

    return Array.from({ length: repeatCount }, () => partners).flat();
  }, [partners]);

  const total = partners?.length ?? 0;
  const step = ITEM_WIDTH + GAP_PX;

  // Reset when partners change
  useEffect(() => {
    setIndex(0);
    controls.set({ x: 0 });
  }, [total, controls]);

  // Auto-slide
  useEffect(() => {
    if (paused || total <= 1) return;

    const id = setInterval(() => {
      void next();
    }, STEP_MS);

    return () => clearInterval(id);
  }, [paused, total, index]);

  async function next() {
    if (total <= 1) return;
    const nextIndex = index + 1;

    setIndex(nextIndex);
    await controls.start({
      x: -(nextIndex * step),
      transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
    });

    // Wrap seamlessly
    if (nextIndex >= looped.length / 2) {
      controls.set({ x: -((nextIndex - total) * step) });
      setIndex(nextIndex - total);
    }
  }

  async function prev() {
    if (total <= 1) return;

    if (index === 0) {
      controls.set({ x: -((index + total) * step) });
      const newIndex = total - 1;
      setIndex(newIndex);
      await controls.start({
        x: -(newIndex * step),
        transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
      });
      return;
    }

    const newIndex = index - 1;
    setIndex(newIndex);
    await controls.start({
      x: -(newIndex * step),
      transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
    });
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6 max-w-4xl mx-auto rounded-xl">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error Loading Partners</AlertTitle>
        <AlertDescription>
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-sm underline font-medium"
          >
            Dismiss
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="py-10">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <div className="flex gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{ width: ITEM_WIDTH }}
                className="flex-shrink-0"
              >
                <div className="flex flex-col items-center">
                  <Skeleton className="h-16 w-32 mb-3" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No partners yet.</p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      <div
        className="relative max-w-6xl mx-auto overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left Button */}
        {total > 1 && (
          <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 z-10">
            <Button
              size="icon"
              variant="outline"
              className="pointer-events-auto rounded-full shadow bg-white/90 hover:bg-white"
              onClick={() => {
                setPaused(true);
                void prev();
              }}
              aria-label="Previous partner"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Right Button */}
        {total > 1 && (
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 z-10">
            <Button
              size="icon"
              variant="outline"
              className="pointer-events-auto rounded-full shadow bg-white/90 hover:bg-white"
              onClick={() => {
                setPaused(true);
                void next();
              }}
              aria-label="Next partner"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Track */}
        <div className="overflow-hidden py-6">
          <motion.div
            animate={controls}
            className="flex items-center gap-6 will-change-transform"
            style={{ x: 0 }}
          >
            {looped.map((partner, i) => (
              <div
                key={`${partner.id ?? partner.name}-${i}`}
                className="flex-shrink-0"
                style={{ width: ITEM_WIDTH }}
              >
                <div className="flex flex-col items-center">
                  {/* Logo */}
                  <div className="h-16 flex items-center justify-center">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-16 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-28 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                        No Logo
                      </div>
                    )}
                  </div>
                  {/* Name */}
                  <p className="mt-3 text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-2">
                    {partner.name}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicPartners;
