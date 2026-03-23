import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Loader2,
  Target,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ModalState = "idle" | "submitting" | "success";

// ─── Nav ─────────────────────────────────────────────────────────────────────

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
          Get Free Trade Review
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
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Currently testing with early traders
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            <span className="text-foreground">Stop Repeating</span>
            <br />
            <span className="text-primary">Losing Trades.</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Send your trade screenshot. Get clear insights on what went wrong.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button
              data-ocid="hero.primary_button"
              onClick={onCTAClick}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12 font-semibold teal-glow-sm transition-all duration-300 hover:scale-[1.02]"
            >
              Get Free Trade Review
            </Button>
            <span className="text-muted-foreground text-sm">
              Takes less than 60 seconds
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload your trade screenshot",
    desc: "Share a screenshot of any trade — win or loss. We accept all chart formats.",
  },
  {
    icon: BarChart2,
    number: "02",
    title: "We analyze your entry, exit, and mistakes",
    desc: "Our review covers your setup, timing, risk management, and execution quality.",
  },
  {
    icon: Target,
    number: "03",
    title: "Get simple insights to improve your next trade",
    desc: "Clear, actionable feedback sent directly to you. No jargon, no fluff.",
  },
];

function HowItWorks({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section
      id="how-it-works"
      className="py-24 px-5"
      data-ocid="how_it_works.section"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Three steps. Less than a minute of your time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              data-ocid={`how_it_works.item.${i + 1}`}
              className="relative p-6 rounded-2xl bg-card border border-border card-glow group hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-4xl font-black text-border leading-none">
                  {step.number}
                </span>
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Button
            data-ocid="how_it_works.secondary_button"
            onClick={onCTAClick}
            variant="outline"
            className="rounded-full border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Try it now — it's free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

const pitfalls = [
  "No trade tracking — mistakes go unnoticed",
  "No proper review — patterns never identified",
  "Emotional decisions — overriding the plan",
];

function Problem() {
  return (
    <section
      id="problem"
      className="py-24 px-5 bg-card/40"
      data-ocid="problem.section"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              Most traders don't lose because of strategy
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              They lose because they repeat the same mistakes again and again.
            </p>

            <ul className="space-y-4">
              {pitfalls.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  data-ocid={`problem.item.${i + 1}`}
                  className="flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90 text-base">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-card p-8 card-glow">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <span className="text-muted-foreground text-xs ml-2">
                    trade_review.txt
                  </span>
                </div>
                {[
                  {
                    label: "Entry timing",
                    status: "Late — FOMO entry",
                    bad: true,
                  },
                  {
                    label: "Stop loss",
                    status: "Too wide — 3% risk",
                    bad: true,
                  },
                  { label: "Exit", status: "Panic sold early", bad: true },
                  {
                    label: "Emotion log",
                    status: "Fear after red candle",
                    bad: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground text-sm">
                      {row.label}
                    </span>
                    <span className="text-destructive text-sm font-medium">
                      {row.status}
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t border-border">
                  <p className="text-primary text-sm font-medium">
                    → Pattern detected: 3rd repeat this month
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    initials: "AK",
    name: "Arjun K.",
    role: "Crypto trader, 14 months",
    quote:
      "I kept making the same entry mistakes. One review made me realize I was chasing — I haven't done it since.",
    stars: 5,
  },
  {
    initials: "SM",
    name: "Sara M.",
    role: "Forex beginner",
    quote:
      "Super clear feedback. No complicated terms, just honest notes on what I did wrong and what to fix.",
    stars: 5,
  },
  {
    initials: "RP",
    name: "Ravi P.",
    role: "Stock trader",
    quote:
      "I was skeptical, but the review actually caught a pattern in my exits I had completely missed.",
    stars: 5,
  },
];

function Trust({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section id="trust" className="py-24 px-5" data-ocid="trust.section">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Early Access
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Trusted by Disciplined Traders
          </h2>
          <p className="text-muted-foreground">
            Currently testing with a small group of early users.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-ocid={`trust.item.${i + 1}`}
              className="p-6 rounded-2xl bg-card border border-border card-glow"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }, (_, j) => j).map((j) => (
                  <span key={j} className="text-primary text-base">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-foreground/85 text-sm leading-relaxed mb-5">
                "{t.quote}"
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
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex justify-center mt-10"
        >
          <Button
            data-ocid="trust.secondary_button"
            onClick={onCTAClick}
            variant="outline"
            className="rounded-full border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Join the early group
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
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              No cost. No commitment.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get your trade reviewed
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Send us your screenshot and get honest feedback on what went wrong
              — for free.
            </p>
            <Button
              data-ocid="final_cta.primary_button"
              onClick={onCTAClick}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 h-12 font-semibold teal-glow-sm transition-all duration-300 hover:scale-[1.02]"
            >
              Start Now
            </Button>
            <p className="text-muted-foreground text-sm mt-4">
              Takes less than 60 seconds
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

function CTAModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string }>(
    {},
  );

  const validate = () => {
    const errs: { name?: string; whatsapp?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!whatsapp.trim()) errs.whatsapp = "WhatsApp number is required";
    else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(whatsapp.trim()))
      errs.whatsapp = "Enter a valid phone number";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setModalState("submitting");
    // Simulate brief processing delay
    await new Promise((r) => setTimeout(r, 1200));
    setModalState("success");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName("");
      setWhatsapp("");
      setFile(null);
      setModalState("idle");
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
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
                    We'll reach out on WhatsApp soon with your trade review.
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
                      We'll analyze your trade and reach out on WhatsApp.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
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

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="whatsapp"
                        className="text-sm text-foreground/90"
                      >
                        WhatsApp number
                      </Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        data-ocid="cta.input"
                        placeholder="+91 98765 43210"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                      />
                      {errors.whatsapp && (
                        <p
                          className="text-destructive text-xs"
                          data-ocid="cta.error_state"
                        >
                          {errors.whatsapp}
                        </p>
                      )}
                    </div>

                    {/* Screenshot upload */}
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
                        Or just submit — you can send the screenshot later on
                        WhatsApp
                      </p>
                    </div>

                    <Button
                      type="submit"
                      data-ocid="cta.submit_button"
                      disabled={modalState === "submitting"}
                      className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
                    >
                      {modalState === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Submitting...
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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCTAClick={openModal} />
      <main>
        <Hero onCTAClick={openModal} />
        <HowItWorks onCTAClick={openModal} />
        <Problem />
        <Trust onCTAClick={openModal} />
        <FinalCTA onCTAClick={openModal} />
      </main>
      <Footer />
      <CTAModal open={modalOpen} onClose={closeModal} />
    </div>
  );
}
