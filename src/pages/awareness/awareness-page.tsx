import React, { useMemo, useRef, useState } from "react";
import {
  pdf,
  Document,
  Page,
  View,
  Text,
  Image,
  PDFViewer,
  StyleSheet,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Radio,
} from "lucide-react";
import { ArrowRight, X } from "lucide-react";


// Import your images here
import EarthquakeSafety from "@/images/earthquake-safety.jpg";
import FloodSafety1 from "@/images/flood-safety-1.jpg";
import FloodSafety from "@/images/flood-safey.jpg";
import StormSafety from "@/images/storm-safety.jpg";
import Tsunami from "@/images/tsumi-safety.jpg";

import FireExtinguisher from "@/images/usage-fire-extinguisher.jpg";
import FireSafety from "@/images/fire-safety.jpg";
import FireSafety1 from "@/images/fire-safety-2.jpg";

import LandslideTypes from "@/images/landslide-types.jpg";
import LandSlideSafety from "@/images/landslide-safety.jpg";
import LandslideSafety1 from "@/images/landslide-safety-1.jpg";

// -----------------------------
// JSON CONTENT STORAGE with imported images
// -----------------------------
const DISASTER_DATA = [
  {
    id: "earthquake",
    name: "Earthquake",
    icon: Activity,
    color: "from-orange-500 to-rose-500",
    summary:
      "Know how to Drop, Cover, and Hold. Myanmar lies in a seismically active zone with moderate to strong earthquakes possible.",
    images: [
      { url: EarthquakeSafety, description: "Securing furniture before an earthquake" },
      { url: Tsunami, description: "Tsunami warning related to earthquakes" },
    ],
    sections: {
      before: [
        "Learn local seismic risks and building codes.",
        "Myanmar experiences frequent small tremors; retrofit weak structures.",
        "Create a family plan: contacts, two meeting points (near & far).",
        "Prepare Go-Bag: water, food, flashlight, first aid, whistle, cash, documents.",
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
      ],
    },
  },
  {
    id: "flood",
    name: "Flood",
    icon: Waves,
    color: "from-sky-500 to-blue-600",
    summary:
      "Know flood zones, prepare sandbags. Myanmar’s Irrawaddy Delta is highly flood-prone during monsoons.",
    images: [
      { url: FloodSafety1, description: "Preparing sandbags before flood" },
      { url: FloodSafety, description: "Flood evacuation routes" },
    ],
    sections: {
      before: [
        "Know your flood risk and evacuation routes to higher ground.",
        "Move valuables and electricals above expected water level.",
        "Prepare Go-Bag: waterproof pouch for documents, battery radio, water purification.",
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
      ],
    },
  },
  {
    id: "cyclone",
    name: "Cyclone / Storm / Nargis",
    icon: Wind,
    color: "from-emerald-500 to-teal-600",
    summary:
      "Track forecasts, board windows, secure loose items. Myanmar's coastal regions are vulnerable to devastating cyclones like Nargis.",
    images: [
      { url: StormSafety, description: "Boarding windows before cyclone" },
    ],
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
      ],
    },
  },
  {
    id: "fire",
    name: "Fire",
    icon: Flame,
    color: "from-red-500 to-rose-600",
    summary:
      "Install alarms, plan exits, practice evacuations. Myanmar's dry season increases fire risks.",
    images: [
      { url: FireExtinguisher, description: "Using a fire extinguisher" },
      { url: FireSafety, description: "Fire safety evacuation drill" },
      { url: FireSafety1, description: "Fire damage assessment" },
    ],
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
      ],
    },
  },
  {
    id: "landslide",
    name: "Landslide",
    icon: Mountain,
    color: "from-amber-600 to-lime-600",
    summary:
      "Avoid steep slopes in heavy rain. Myanmar’s mountainous regions are prone to landslides in monsoon.",
    images: [
      { url: LandslideTypes, description: "Types of landslides" },
      { url: LandSlideSafety, description: "Landslide safety measures" },
      { url: LandslideSafety1, description: "Community landslide safety drill" },
    ],
    sections: {
      before: [
        "Map local slopes and past landslide sites; avoid unstable ground.",
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
      ],
    },
  },
];
// Utility types
const TABS = [
  { key: "before", label: "Before (Preparedness)" },
  { key: "during", label: "During (Response)" },
  { key: "after", label: "After (Recovery)" },
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
          <p className="text-muted-foreground text-sm sm:text-base">
            Learn what to do before, during, and after common disasters, including Myanmar-specific risks.
          </p>
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
      >
        <div className={`rounded-2xl p-5 bg-gradient-to-br ${item.color} text-white`}>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <CardTitle className="text-lg">{item.name}</CardTitle>
          </div>
          <CardDescription className="mt-2 text-white/90">{item.summary}</CardDescription>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Local risks
            </span>
            <span className="flex items-center gap-2">
              <Users2 className="h-4 w-4" /> Community drills
            </span>
            <span className="flex items-center gap-2">
              <Radio className="h-4 w-4" /> Official updates
            </span>
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

// -----------------------------
// PDF
// -----------------------------
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1 solid #ccc",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 12, color: "#666" },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "capitalize",
    borderBottom: "1 solid #ddd",
    paddingBottom: 4,
  },
  bulletPoint: {
    marginLeft: 15,
    marginBottom: 6,
    flexDirection: "row",
  },
  bulletSymbol: {
    width: 10,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
  },
  imageWrapper: {
    marginBottom: 15,
    alignItems: "center",
  },
  image: { width: 400, height: 250, objectFit: "cover", marginBottom: 6 },
  imageDescription: { fontSize: 10, color: "#555", textAlign: "center" },
  references: {
    marginTop: 25,
    paddingTop: 10,
    borderTop: "1 solid #ccc",
  },
  referenceTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },
  referenceItem: {
    fontSize: 10,
    marginBottom: 4,
  },
footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#999",
    paddingTop: 8,
    fontSize: 9,
    textAlign: "center",
    color: "#555",
  },
});

const GuidePDFDocument: React.FC<{ disaster: any }> = ({ disaster }) => {
  // Static reference data
  const references = [
    { label: "World Health Organization (WHO)", url: "https://www.who.int/" },
    { label: "UNICEF", url: "https://www.unicef.org/" },
    { label: "Red Cross", url: "https://www.ifrc.org/" },
    {
      label: "Government Disaster Management Portal",
      url: "https://www.ready.gov/",
    },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{disaster.name} Awareness Guide</Text>
          <Text style={styles.subtitle}>
            Practical safety measures for you and your community
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text>{disaster.summary}</Text>
        </View>

        {/* Sections */}
        {(["before", "during", "after"] as const).map((period) => (
          <View style={styles.section} key={period}>
            <Text style={styles.sectionTitle}>
              {period.charAt(0).toUpperCase() + period.slice(1)} (
              {disaster.sections[period].length} points)
            </Text>
            {disaster.sections[period].map((point: string, idx: number) => (
              <View style={styles.bulletPoint} key={idx}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Images */}
        {disaster.images.map((img: any, idx: number) => (
          <View key={idx} style={styles.imageWrapper}>
            <Image src={img.url} style={styles.image} />
            <Text style={styles.imageDescription}>{img.description}</Text>
          </View>
        ))}

        {/* References (static) */}
        <View style={styles.references}>
          <Text style={styles.referenceTitle}>References & Resources</Text>
          {references.map((ref, idx) => (
            <Text key={idx} style={styles.referenceItem}>
              {ref.label}: {ref.url}
            </Text>
          ))}
        </View>

       {/* Footer */}
        <View style={styles.footer}>
          <Text>
            © {new Date().getFullYear()} Disaster Awareness Guide — Created for educational purposes. Stay safe and prepared.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const GuidePDFButton: React.FC<{ disaster: any }> = ({ disaster }) => {
  const onDownload = async () => {
    try {
      const blob = await pdf(<GuidePDFDocument disaster={disaster} />).toBlob();
      saveAs(blob, `${disaster.name.replace(/\s+/g, "_")}_Awareness_Guide.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Button onClick={onDownload} className="gap-2">
      <Download className="h-4 w-4" /> Download PDF
    </Button>
  );
};

// -----------------------------
// IMAGE GALLERY
// -----------------------------
function ImageGallery({ images }: { images: { url: string; description: string }[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const nextImage = () => {
    if (selected === null) return;
    setSelected((selected + 1) % images.length);
  };

  const prevImage = () => {
    if (selected === null) return;
    setSelected((selected - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Grid of thumbnails */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-xl shadow-md border bg-muted/10 cursor-pointer"
            onClick={() => setSelected(idx)}
          >
            <img
              src={img.url}
              alt={img.description}
              className="w-full h-44 object-cover transform transition duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition">
              {img.description}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={images[selected].url}
              alt={images[selected].description}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Description */}
            <motion.p
              className="absolute bottom-10 text-white text-sm text-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {images[selected].description}
            </motion.p>

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 text-white p-2 rounded-full hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-5 text-white p-2 rounded-full hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-5 text-white p-2 rounded-full hover:bg-white/20"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// -----------------------------
// MAIN APP
// -----------------------------
export default function DisasterAwarenessApp() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("before");
  const pdfRootRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DISASTER_DATA;
    return DISASTER_DATA.filter(
      (d) => d.name.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)
    );
  }, [query]);

  const active = useMemo(() => DISASTER_DATA.find((d) => d.id === activeId) || null, [activeId]);

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
                <GuidePDFButton disaster={active} />
              </div>

              <Card ref={pdfRootRef} className="rounded-2xl">
                <CardHeader className={`bg-gradient-to-r ${active.color} text-white rounded-t-2xl`}>
                  <CardTitle className="text-lg">Guides: Before • During • After</CardTitle>
                  <CardDescription className="text-white/90">
                    Printable awareness guide for households, schools, and workplaces.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="">
                    <div className="px-4 pt-4">
                      <TabsList className="grid w-full grid-cols-3 rounded-xl">
                        {TABS.map((t) => (
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
                          <ImageGallery images={active.images} />
                        </SectionBlock>
                      </TabsContent>
                      <TabsContent value="during" className="m-0">
                        <SectionBlock title="During (Response)" subtitle="Protect life and follow official guidance.">
                          <BulletList items={active.sections.during} />
                          <ImageGallery images={active.images} />
                        </SectionBlock>
                      </TabsContent>
                      <TabsContent value="after" className="m-0">
                        <SectionBlock title="After (Recovery & Learning)" subtitle="Stay safe, recover, and improve for next time.">
                          <BulletList items={active.sections.after} />
                          <ImageGallery images={active.images} />
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
