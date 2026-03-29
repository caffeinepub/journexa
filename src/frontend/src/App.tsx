import type { Submission } from "@/backend";
import { ExternalBlob } from "@/backend";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Flame,
  Loader2,
  Lock,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ModalState = "idle" | "submitting" | "success";
type ScreenshotOption =
  | { __kind__: "Some"; value: string }
  | { __kind__: "None" };

function getScreenshotUrl(sub: Submission): ScreenshotOption {
  const s = sub as any;
  if (s.screenshotUrl && s.screenshotUrl.__kind__ === "Some") {
    return { __kind__: "Some", value: s.screenshotUrl.value as string };
  }
  return { __kind__: "None" };
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = "admin123";

function AdminPage() {
  const { actor } = useActor();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authState, setAuthState] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setAuthState("error");
      return;
    }
    if (!actor) return;
    setAuthState("loading");
    try {
      const results = await actor.getSubmissions(password);
      setSubmissions(results);
      setAuthState("success");
    } catch {
      setAuthState("error");
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center gap-3">
          <img
            src="/assets/uploads/IMG_20260323_052315-1.jpg"
            alt="Journexa"
            className="h-10 w-auto object-contain"
          />
          <span className="text-muted-foreground text-sm font-medium border-l border-border pl-3 ml-1">
            Admin Panel
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <AnimatePresence mode="wait">
          {authState !== "success" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground">
                    Admin Access
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Enter password to view submissions
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="admin-password"
                      className="text-sm text-foreground/90"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        data-ocid="admin.input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (authState === "error") setAuthState("idle");
                        }}
                        placeholder="Enter admin password"
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {authState === "error" && (
                      <p
                        className="text-destructive text-xs flex items-center gap-1"
                        data-ocid="admin.error_state"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Incorrect password
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    data-ocid="admin.submit_button"
                    disabled={authState === "loading" || !password}
                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
                  >
                    {authState === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Loading...
                      </>
                    ) : (
                      "Enter"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-5xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Submissions
                  </h2>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {submissions.length}{" "}
                    {submissions.length === 1 ? "entry" : "entries"} total
                  </p>
                </div>
                <Button
                  data-ocid="admin.secondary_button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAuthState("idle");
                    setPassword("");
                    setSubmissions([]);
                  }}
                  className="rounded-xl border-border text-muted-foreground hover:border-primary hover:text-primary"
                >
                  Log out
                </Button>
              </div>

              {submissions.length === 0 ? (
                <div
                  data-ocid="admin.empty_state"
                  className="rounded-2xl border border-border bg-card p-16 text-center"
                >
                  <p className="text-muted-foreground">No submissions yet.</p>
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                  data-ocid="admin.table"
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-semibold">
                          #
                        </TableHead>
                        <TableHead className="text-muted-foreground font-semibold">
                          Name
                        </TableHead>
                        <TableHead className="text-muted-foreground font-semibold">
                          Date
                        </TableHead>
                        <TableHead className="text-muted-foreground font-semibold">
                          Screenshot
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((sub, i) => {
                        const screenshot = getScreenshotUrl(sub);
                        return (
                          <TableRow
                            key={String(sub.id)}
                            data-ocid={`admin.row.${i + 1}`}
                            className="border-border hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="text-muted-foreground text-sm">
                              {i + 1}
                            </TableCell>
                            <TableCell className="text-foreground font-medium">
                              {sub.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(sub.timestamp)}
                            </TableCell>
                            <TableCell>
                              {screenshot.__kind__ === "Some" ? (
                                <a
                                  href={screenshot.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={screenshot.value}
                                    alt="Trade screenshot"
                                    className="w-16 h-12 object-cover rounded cursor-pointer border border-border hover:border-primary/50 transition-colors"
                                  />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border py-6 px-5">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Journexa Admin
        </div>
      </footer>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <img
          src="/assets/uploads/IMG_20260323_052315-1.jpg"
          alt="Journexa"
          className="h-10 w-auto object-contain"
        />
        <Button
          data-ocid="nav.primary_button"
          onClick={onCTAClick}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-5 h-9 font-semibold"
        >
          Find My Mistake
        </Button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden blob-bg"
      data-ocid="hero.section"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-red-500/4 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Scarcity badge */}
          <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-red-500/40 bg-red-500/10 text-sm text-red-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />🔴
            Only 47 review slots left today
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            <span className="text-foreground">You&apos;re not losing</span>
            <br />
            <span className="text-primary">because of strategy.</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your trade. We show exactly what you did wrong — in under{" "}
            <span className="text-foreground font-semibold">60 seconds.</span>
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button
              data-ocid="hero.primary_button"
              onClick={onCTAClick}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 h-13 font-bold teal-glow-sm transition-all duration-300 hover:scale-[1.03]"
            >
              Find My Mistake →
            </Button>
            <span className="text-muted-foreground text-sm">
              Free. No account needed. Results in 60 seconds.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pain Amplification ───────────────────────────────────────────────────────

const painPoints = [
  "Entered late after the move already happened",
  "Stop loss too wide — or just random",
  "Closed early out of fear, then watched it hit your target",
  "Took a trade that wasn't even your setup",
];

function PainAmplification({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 px-5 bg-card/30" data-ocid="pain.section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
            Sound familiar?
          </h2>
          <p className="text-muted-foreground text-lg">
            If any of these hit close to home — you&apos;re in the right place.
          </p>
        </motion.div>

        <div className="space-y-3 mt-10">
          {painPoints.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              data-ocid={`pain.item.${i + 1}`}
              className="flex items-center gap-4 p-5 rounded-xl bg-card border-l-4 border-red-500 border border-border/50"
            >
              <span className="text-red-400 text-xl flex-shrink-0">✕</span>
              <span className="text-foreground/90 text-base font-medium">
                {point}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-foreground/80 text-xl italic font-medium mb-8">
            &ldquo;You don&apos;t need a new strategy. You need to see your
            mistakes clearly.&rdquo;
          </p>
          <Button
            data-ocid="pain.primary_button"
            onClick={onCTAClick}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-12"
          >
            Find My Mistake
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Proof Section ────────────────────────────────────────────────────────────

function ProofSection({ onCTAClick }: { onCTAClick: () => void }) {
  const reviewRows = [
    { label: "Entry", value: "Late — FOMO after breakout", red: true },
    { label: "Stop Loss", value: "Too wide — 3% risk", red: true },
    {
      label: "Exit",
      value: "EXIT FAST ON PANIC 🔴",
      red: true,
      prominent: true,
    },
    { label: "Emotion", value: "Panic after red candle", red: true },
  ];

  return (
    <section className="py-24 px-5" data-ocid="proof.section">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            This Is What A Real Review Looks Like
          </h2>
          <p className="text-muted-foreground text-lg">
            Raw. Specific. No sugarcoating.
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {/* Review card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <span className="text-muted-foreground text-xs font-mono ml-2">
                journexa_review.txt
              </span>
            </div>

            <div className="p-6 space-y-4 font-mono text-sm">
              {reviewRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-muted-foreground flex-shrink-0 w-20">
                    {row.label}
                  </span>
                  <span
                    className={`text-right font-semibold ${
                      row.prominent
                        ? "text-red-400 text-base bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30"
                        : "text-red-400"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              <div className="border-t border-border/60 pt-4 space-y-2">
                <p className="text-primary font-semibold">
                  📍 Pattern Detected
                </p>
                <p className="text-primary/90">
                  You&apos;ve repeated this exact mistake 3 times this month.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insight box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 p-5 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 text-center"
        >
          <p className="text-emerald-400 font-semibold text-base">
            💡 Risk/Reward was 6.65 — but panic turned a winning trade into a
            loss.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Button
            data-ocid="proof.primary_button"
            onClick={onCTAClick}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-12"
          >
            Get My Trade Reviewed
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Before / After ───────────────────────────────────────────────────────────

const beforeItems = [
  "Random entry decisions",
  "No pattern awareness",
  "Same mistakes, every week",
  "Trading on gut feel",
];
const afterItems = [
  "Clear mistake identification",
  "Pattern recognition",
  "Improved execution",
  "Structured trade decisions",
];

function BeforeAfter({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 px-5 bg-card/30" data-ocid="before_after.section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Trading Before vs After Journexa
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-0 rounded-2xl border border-border overflow-hidden"
        >
          {/* Before */}
          <div className="p-8 bg-red-500/5 border-r border-border/60">
            <h3 className="text-red-400 font-bold text-xl mb-6 flex items-center gap-2">
              <span className="text-red-500">✕</span> Before Journexa
            </h3>
            <ul className="space-y-4">
              {beforeItems.map((item, i) => (
                <li
                  key={item}
                  data-ocid={`before_after.item.${i + 1}`}
                  className="flex items-center gap-3"
                >
                  <span className="text-red-400 font-bold text-sm flex-shrink-0">
                    ✗
                  </span>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="p-8 bg-emerald-400/5">
            <h3 className="text-emerald-400 font-bold text-xl mb-6 flex items-center gap-2">
              <span className="text-emerald-400">✓</span> After Journexa
            </h3>
            <ul className="space-y-4">
              {afterItems.map((item, i) => (
                <li
                  key={item}
                  data-ocid={`before_after.item.${i + 5}`}
                  className="flex items-center gap-3"
                >
                  <span className="text-emerald-400 font-bold text-sm flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <Button
            data-ocid="before_after.primary_button"
            onClick={onCTAClick}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-12"
          >
            Find My Mistake
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    initials: "FT",
    name: "Farhan T.",
    role: "Forex trader, 2 years",
    quote:
      "I didn't realize I was entering late every time until I saw the review. It was embarrassing but helpful.",
  },
  {
    initials: "DR",
    name: "Divya R.",
    role: "NSE stocks, beginner",
    quote:
      "It showed me mistakes I've been repeating for months. My stop losses were basically random.",
  },
  {
    initials: "KM",
    name: "Khalid M.",
    role: "Crypto trader, 18 months",
    quote:
      "I knew I had discipline issues. Journexa showed me exactly when and why I break my rules.",
  },
];

function Testimonials({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 px-5" data-ocid="testimonials.section">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What Traders Are Saying
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-ocid={`testimonials.item.${i + 1}`}
              className="p-6 rounded-2xl bg-card border border-border card-glow"
            >
              <p className="text-foreground/85 text-base leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {t.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex justify-center mt-10"
        >
          <Button
            data-ocid="testimonials.primary_button"
            onClick={onCTAClick}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-12"
          >
            Get My Trade Reviewed
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Urgency / Scarcity ───────────────────────────────────────────────────────

function UrgencySection({ onCTAClick }: { onCTAClick: () => void }) {
  const urgencyItems = [
    { icon: Flame, text: "First 1,000 users get lifetime benefits" },
    { icon: Clock, text: "Free reviews only available for a limited time" },
    { icon: Clock, text: "Only 47 daily review slots — fills fast" },
  ];

  return (
    <section className="py-24 px-5 bg-card/30" data-ocid="urgency.section">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center"
        >
          <Badge className="mb-5 bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/20 text-sm px-3 py-1">
            ⚡ Limited Early Access
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Limited Early Access
          </h2>

          <ul className="space-y-4 text-left mb-8">
            {urgencyItems.map((item, i) => (
              <li
                key={item.text}
                data-ocid={`urgency.item.${i + 1}`}
                className="flex items-center gap-3"
              >
                <item.icon className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-foreground/90">{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                613 of 1,000 spots claimed
              </span>
              <span className="text-red-400 font-semibold">387 left</span>
            </div>
            <Progress value={61} className="h-3 bg-muted" />
          </div>

          <Button
            data-ocid="urgency.primary_button"
            onClick={onCTAClick}
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-10 h-12 teal-glow-sm transition-all duration-300 hover:scale-[1.03]"
          >
            Claim My Free Review
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section id="cta" className="py-24 px-5" data-ocid="final_cta.section">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-12 text-center teal-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
              You don&apos;t need more trades.
            </h2>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 leading-tight">
              You need to stop repeating the same one.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              Get your first trade reviewed free. No account needed. Results in
              60 seconds.
            </p>
            <Button
              data-ocid="final_cta.primary_button"
              onClick={onCTAClick}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 h-13 font-bold teal-glow-sm transition-all duration-300 hover:scale-[1.03]"
            >
              Get Your First Review Free
            </Button>
            <p className="text-red-400 text-sm mt-4 font-medium">
              47 spots left today
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

function CTAModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const errs: { name?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!actor) return;
    setErrors({});
    setModalState("submitting");
    setUploadProgress(0);

    try {
      let screenshotUrl: ScreenshotOption;

      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(pct),
        );
        await blob.getBytes();
        const url = blob.getDirectURL();
        screenshotUrl = { __kind__: "Some", value: url };
      } else {
        screenshotUrl = { __kind__: "None" };
      }

      await (actor as any).submitTradeReview(name.trim(), screenshotUrl);
      setModalState("success");
    } catch {
      setModalState("idle");
      setErrors({ name: "Something went wrong. Please try again." });
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName("");
      setFile(null);
      setModalState("idle");
      setUploadProgress(0);
      setErrors({});
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          data-ocid="cta.modal"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <button
              type="button"
              data-ocid="cta.close_button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <AnimatePresence mode="wait">
              {modalState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-10 text-center"
                  data-ocid="cta.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5 border border-primary/30">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    We got it!
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Your trade has been submitted. We&apos;ll review it shortly.
                  </p>
                  <Button
                    data-ocid="cta.confirm_button"
                    onClick={handleClose}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    Done
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pt-8 pb-2">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      Get your free trade review
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Upload your trade screenshot and we&apos;ll review it.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-sm text-foreground/90"
                      >
                        Your name
                      </Label>
                      <Input
                        id="name"
                        data-ocid="cta.input"
                        placeholder="e.g. Rahul"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                      />
                      {errors.name && (
                        <p
                          className="text-destructive text-xs"
                          data-ocid="cta.error_state"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/90">
                        Trade screenshot{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <label
                        data-ocid="cta.upload_button"
                        className="flex items-center gap-3 w-full border border-dashed border-border rounded-xl px-4 py-3.5 cursor-pointer hover:border-primary/50 transition-colors bg-muted/50 group"
                      >
                        <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors truncate">
                          {file ? file.name : "Click to upload screenshot"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Or just submit your name — you can add a screenshot
                        later.
                      </p>
                    </div>

                    {modalState === "submitting" &&
                      file &&
                      uploadProgress > 0 &&
                      uploadProgress < 100 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Uploading screenshot...
                            </span>
                            <span className="text-xs text-primary font-medium">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                    <Button
                      type="submit"
                      data-ocid="cta.submit_button"
                      disabled={modalState === "submitting"}
                      className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
                    >
                      {modalState === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          {file && uploadProgress < 100
                            ? `Uploading... ${uploadProgress}%`
                            : "Submitting..."}
                        </>
                      ) : (
                        "Submit for Review"
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-8 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-sm">
        <img
          src="/assets/uploads/IMG_20260323_052315-1.jpg"
          alt="Journexa"
          className="h-8 w-auto object-contain"
        />
        <p>
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCTAClick={openModal} />
      <main>
        <Hero onCTAClick={openModal} />
        <PainAmplification onCTAClick={openModal} />
        <ProofSection onCTAClick={openModal} />
        <BeforeAfter onCTAClick={openModal} />
        <Testimonials onCTAClick={openModal} />
        <UrgencySection onCTAClick={openModal} />
        <FinalCTA onCTAClick={openModal} />
      </main>
      <Footer />
      <CTAModal open={modalOpen} onClose={closeModal} />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const isAdmin =
    typeof window !== "undefined" && window.location.pathname === "/admin";
  return isAdmin ? <AdminPage /> : <LandingPage />;
}
