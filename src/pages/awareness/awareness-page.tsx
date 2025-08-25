import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Waves,
  Wind,
  Flame,
  Mountain,
  BookOpen,
  ArrowLeft,
  Download,
  MapPin,
  Users2,
  ShieldCheck,
  Radio
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Disaster Awareness Web App (Simplified Focus)
 * - JSON-based content storage
 * - Home Hub with cards per disaster
 * - Disaster page with Before / During / After tabs
 * - PDF export of current disaster guide
 * - Tailwind + shadcn/ui + framer-motion
 */

// -----------------------------
// JSON CONTENT STORAGE
// -----------------------------
const DISASTER_DATA = [
  {
    id: "earthquake",
    name: "Earthquake",
    icon: Activity,
    color: "from-orange-500 to-rose-500",
    summary:
      "Know how to Drop, Cover, and Hold. Secure heavy furniture. Plan safe spots at home and work.",
    sections: {
      before: [
        "Learn local seismic risks and building codes.",
        "Create a family plan: contacts, two meeting points (near & far).",
        "Go-Bag: water, food, flashlight, first aid, whistle, cash, copies of documents.",
        "Participate in community drills; practice Drop–Cover–Hold.",
        "Secure shelves, gas cylinders; retrofit weak structures."
      ],
      during: [
        "Follow official alerts and instructions.",
        "Indoors: Drop, Cover, Hold under sturdy furniture; stay away from windows.",
        "Outdoors: Move to open area away from buildings, trees, power lines.",
        "After shaking, use stairs not elevators; watch for aftershocks.",
        "Assist children, elderly, and persons with disabilities."
      ],
      after: [
        "Check injuries; give first aid. Call emergency if needed.",
        "Inspect for gas leaks, damaged wiring, cracks; turn off utilities if unsafe.",
        "Avoid unstable buildings and falling debris; beware aftershocks.",
        "Follow official info via radio/verified channels; avoid rumors.",
        "Review lessons learned; update your plan and Go-Bag."
      ]
    }
  },
  {
    id: "flood",
    name: "Flood",
    icon: Waves,
    color: "from-sky-500 to-blue-600",
    summary:
      "Know flood zones, prepare sandbags, and plan high-ground routes. Never walk or drive through flood water.",
    sections: {
      before: [
        "Know your flood risk and evacuation routes to higher ground.",
        "Move valuables and electricals above expected water level.",
        "Go-Bag: waterproof pouch for documents, battery radio, water purification.",
        "Join community drills; prepare sandbags if advised.",
        "Elevate utilities; install non-return valves on drains if possible."
      ],
      during: [
        "Follow warnings; evacuate early if told to.",
        "Avoid walking/driving through flood water; just 15–30 cm can sweep you away.",
        "Disconnect electricity if safe; avoid live wires.",
        "Help vulnerable people to safe shelters.",
        "Listen to emergency radio and official channels."
      ],
      after: [
        "Avoid flood water; may contain sewage, chemicals, snakes.",
        "Do not enter buildings until cleared; watch for structural damage.",
        "Boil water until supply is declared safe.",
        "Photograph damage; clean with protective gear.",
        "Record lessons; improve drainage and home measures."
      ]
    }
  },
  {
    id: "cyclone",
    name: "Cyclone / Storm",
    icon: Wind,
    color: "from-emerald-500 to-teal-600",
    summary:
      "Track forecasts, board windows, secure loose items, and know your nearest shelter.",
    sections: {
      before: [
        "Follow seasonal forecasts; prepare secure shutters/boards for windows.",
        "Trim trees; secure loose outdoor items.",
        "Go-Bag with extra clothing and waterproofs; charge power banks.",
        "Identify nearest cyclone shelters; plan routes.",
        "Drills: practice family communication and safe room setup."
      ],
      during: [
        "Heed evacuation orders promptly.",
        "Stay indoors away from windows; shelter in an interior room.",
        "Avoid coastal areas and low-lying zones; watch for storm surge.",
        "Assist vulnerable neighbors to reach shelters.",
        "Monitor official updates; beware the calm eye passing overhead."
      ],
      after: [
        "Beware downed lines, unstable trees, and debris.",
        "Use phones for emergencies only until power/coverage stabilizes.",
        "Treat minor injuries; seek medical help for serious cases.",
        "Document damage; coordinate with local authorities for relief.",
        "Strengthen roofing and fix weak points for future storms."
      ]
    }
  },
  {
    id: "fire",
    name: "Fire",
    icon: Flame,
    color: "from-red-500 to-rose-600",
    summary:
      "Install alarms, plan exits, practice evacuations. If clothing catches fire: Stop, Drop, Roll.",
    sections: {
      before: [
        "Install smoke alarms; test monthly and replace batteries yearly.",
        "Plan two exit routes from each room; keep corridors clear.",
        "Keep extinguishers; know PASS: Pull, Aim, Squeeze, Sweep.",
        "Store fuels/chemicals safely; avoid overloading sockets.",
        "Practice evacuation drills with family/workplace."
      ],
      during: [
        "Raise alarm; evacuate immediately; crawl low under smoke.",
        "If clothing ignites: Stop, Drop, Roll; cover with blanket if available.",
        "Do not use elevators; check doors for heat before opening.",
        "Assist children/elderly/disabled; gather at assembly point.",
        "Call emergency services and follow instructions."
      ],
      after: [
        "Do not re-enter until declared safe by authorities.",
        "Treat smoke inhalation and burns; seek medical help.",
        "Ventilate and document damage for claims.",
        "Dispose of contaminated food; check electrical systems.",
        "Update fire plan; replace alarms/extinguishers if used."
      ]
    }
  },
  {
    id: "pandemic",
    name: "Pandemic / Disease",
    icon: MapPin,
    color: "from-violet-500 to-fuchsia-600",
    summary:
      "Hygiene, vaccines, masks, and trusted info sources are key. Protect the vulnerable.",
    sections: {
      before: [
        "Stay updated with health advisories; ensure routine vaccinations.",
        "Stock masks, sanitizer, thermometers, basic meds.",
        "Plan remote work/school options; update contact lists.",
        "Practice cough etiquette and frequent handwashing.",
        "Identify vulnerable family members and support plans."
      ],
      during: [
        "Follow public health guidance on masking, distancing, and testing.",
        "Isolate if symptomatic; seek medical advice.",
        "Support elderly/immunocompromised with deliveries.",
        "Avoid misinformation; rely on verified health channels.",
        "Maintain mental health: routines, exercise, social connection."
      ],
      after: [
        "Gradual return to normal; follow post-illness care guidance.",
        "Address learning/health gaps; schedule missed checkups.",
        "Evaluate remote readiness for future outbreaks.",
        "Keep a replenished health Go-Bag.",
        "Community debrief: what worked, what to improve."
      ]
    }
  },
  {
    id: "landslide",
    name: "Landslide",
    icon: Mountain,
    color: "from-amber-600 to-lime-600",
    summary:
      "Avoid steep slopes in heavy rain, watch for cracks and tilting trees; know high-ground shelters.",
    sections: {
      before: [
        "Map local slopes and past landslide sites; avoid building on steep/unstable ground.",
        "Maintain drainage; plant deep-rooted vegetation.",
        "Identify safe high-ground shelters and routes.",
        "Go-Bag with sturdy footwear and gloves.",
        "Community drills for rainy seasons."
      ],
      during: [
        "Heed heavy-rain warnings; evacuate early if cracks/tilting seen.",
        "Move perpendicular to slide path; do not cross active flows.",
        "Keep away from riverbanks and steep cut slopes.",
        "Assist vulnerable people to high ground.",
        "Monitor official alerts and radio."
      ],
      after: [
        "Stay away from slide area; risk of secondary slides.",
        "Check utilities; report damaged roads/bridges.",
        "Do not drink water until cleared; watch for contamination.",
        "Photograph damage; support community cleanup safely.",
        "Improve drainage and slope stabilization."
      ]
    }
  }
];

// Utility types
const TABS = [
  { key: "before", label: "Before (Preparedness)" },
  { key: "during", label: "During (Response)" },
  { key: "after", label: "After (Recovery)" }
] as const;

// -----------------------------
// COMPONENTS
// -----------------------------
function HeroHeader({ onBack, showBack }: { onBack?: () => void; showBack?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Disaster Awareness Hub</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Learn what to do before, during, and after common disasters.</p>
        </div>
      </div>
      <Badge className="text-xs sm:text-sm" variant="secondary">
        <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Preparedness First
      </Badge>
    </div>
  );
}

function DisasterCard({ item, onOpen }: { item: any; onOpen: (id: string) => void }) {
  const Icon = item.icon;
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        onClick={() => onOpen(item.id)}
        className="cursor-pointer transition hover:shadow-lg hover:-translate-y-0.5 rounded-2xl border bg-gradient-to-br p-0"
        style={{ backgroundImage: undefined }}
      >
        <div className={`rounded-2xl p-5 bg-gradient-to-br ${item.color} text-white`}>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <CardTitle className="text-lg">{item.name}</CardTitle>
          </div>
          <CardDescription className="mt-2 text-white/90">
            {item.summary}
          </CardDescription>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Local risks</span>
            <span className="flex items-center gap-2"><Users2 className="h-4 w-4"/> Community drills</span>
            <span className="flex items-center gap-2"><Radio className="h-4 w-4"/> Official updates</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((txt, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary/80" />
          <span className="leading-relaxed">{txt}</span>
        </li>
      ))}
    </ul>
  );
}

function GuidePDFButton({ rootRef, title }: { rootRef: React.RefObject<HTMLDivElement>; title: string }) {
  const onDownload = async () => {
    if (!rootRef.current) return;
    const canvas = await html2canvas(rootRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // Fit image to page while keeping aspect ratio
    const imgW = pageW - 48; // margins
    const ratio = imgW / canvas.width;
    const imgH = canvas.height * ratio;
    const y = 24;
    pdf.addImage(imgData, "PNG", 24, y, imgW, imgH);
    pdf.save(`${title.replace(/\s+/g, "_")}_Awareness_Guide.pdf`);
  };

  return (
    <Button onClick={onDownload} className="gap-2">
      <Download className="h-4 w-4" /> Download PDF
    </Button>
  );
}

// -----------------------------
// MAIN APP
// -----------------------------
export default function DisasterAwarenessApp() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("before");
  const pdfRootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DISASTER_DATA;
    return DISASTER_DATA.filter(d => d.name.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q));
  }, [query]);

  const active = useMemo(() => DISASTER_DATA.find(d => d.id === activeId) || null, [activeId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <HeroHeader showBack={!!active} onBack={() => { setActiveId(null); setActiveTab("before"); }} />

        <Separator className="my-4" />

        <AnimatePresence initial={false} mode="wait">
          {!active ? (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Choose a disaster</h2>
                </div>
                <div className="sm:ml-auto w-full sm:w-80">
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search disasters..." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((item) => (
                  <DisasterCard key={item.id} item={item} onOpen={setActiveId} />
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <active.icon className="h-6 w-6" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">{active.name} Awareness</h2>
                    <p className="text-muted-foreground text-sm max-w-2xl">{active.summary}</p>
                  </div>
                </div>
                <GuidePDFButton rootRef={pdfRootRef} title={`${active.name}`} />
              </div>

              <Card ref={pdfRootRef} className="rounded-2xl">
                <CardHeader className={`bg-gradient-to-r ${active.color} text-white rounded-t-2xl`}>
                  <CardTitle className="text-lg">Guides: Before • During • After</CardTitle>
                  <CardDescription className="text-white/90">Printable awareness guide for households, schools, and workplaces.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="">
                    <div className="px-4 pt-4">
                      <TabsList className="grid w-full grid-cols-3 rounded-xl">
                        {TABS.map(t => (
                          <TabsTrigger key={t.key} value={t.key} className="text-xs sm:text-sm">
                            {t.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <div className="p-4 sm:p-6">
                      <TabsContent value="before" className="m-0">
                        <SectionBlock title="Before (Preparedness & Mitigation)" subtitle="Reduce risk and get ready.">
                          <BulletList items={active.sections.before} />
                        </SectionBlock>
                      </TabsContent>
                      <TabsContent value="during" className="m-0">
                        <SectionBlock title="During (Response)" subtitle="Protect life and follow official guidance.">
                          <BulletList items={active.sections.during} />
                        </SectionBlock>
                      </TabsContent>
                      <TabsContent value="after" className="m-0">
                        <SectionBlock title="After (Recovery & Learning)" subtitle="Stay safe, recover, and improve for next time.">
                          <BulletList items={active.sections.after} />
                        </SectionBlock>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Built for awareness. Add PWA offline support later to access during emergencies.
        </footer>
      </div>
    </div>
  );
}

function SectionBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" /> {title}
      </h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
