import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  Shield,
  Heart,
  Target,
  Handshake,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Properties Sold", value: "2,500+", icon: Building2 },
  { label: "Happy Clients", value: "4,000+", icon: Users },
  { label: "Years of Experience", value: "15+", icon: Award },
  { label: "Cities Covered", value: "25+", icon: MapPin },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "We believe in honest dealings. Every transaction is conducted with full transparency, ensuring you always know exactly where you stand.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: Heart,
    title: "Client-First Approach",
    description:
      "Your dreams are our priority. We listen, understand, and work tirelessly to match you with the perfect property that feels like home.",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: Target,
    title: "Market Expertise",
    description:
      "Our deep understanding of local markets means we spot opportunities others miss. We leverage data-driven insights for the best deals.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Results That Matter",
    description:
      "From competitive pricing strategies to swift closings, we are committed to delivering measurable results that exceed expectations.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full filter blur-[128px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-indigo-200 rounded-full text-sm font-medium mb-6 border border-white/10">
              <Building2 className="w-4 h-4" />
              About Aura Properties
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Turning Real Estate
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Dreams Into Reality
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              For over 15 years, Aura Properties has been the trusted partner
              for thousands of families finding their perfect home. We combine
              deep market expertise with a passion for exceptional service.
            </p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60L60 52C120 44 240 28 360 24C480 20 600 28 720 32C840 36 960 36 1080 32C1200 28 1320 20 1380 16L1440 12V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
              fill="white"
              fillOpacity="0.05"
            />
            <path
              d="M0 60L48 54C96 48 192 36 288 32C384 28 480 32 576 36C672 40 768 44 864 42C960 40 1056 32 1152 28C1248 24 1344 24 1392 24L1440 24V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </section>

      {/* ═══ Stats Section ═══ */}
      <section className="relative -mt-2 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Mission Section ═══ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
                <Handshake className="w-3.5 h-3.5" />
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Building Lasting Relationships,{" "}
                <span className="text-indigo-600">One Property at a Time</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                At Aura Properties, we believe every client deserves a seamless
                real estate experience. Our mission is to empower buyers,
                sellers, and renters with expert guidance, personalized service,
                and a deep understanding of the local market.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you&apos;re a first-time homebuyer or a seasoned
                investor, our dedicated team walks you through every step —
                from property discovery to closing. We don&apos;t just complete
                transactions; we build relationships that last a lifetime.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                Explore Properties
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white">
                    <Building2 className="w-8 h-8 mb-3 opacity-90" />
                    <p className="text-2xl font-bold">2,500+</p>
                    <p className="text-sm text-indigo-100 mt-1">
                      Properties Sold
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <Users className="w-8 h-8 text-gray-600 mb-3" />
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Client Satisfaction
                    </p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <Award className="w-8 h-8 text-gray-600 mb-3" />
                    <p className="text-2xl font-bold text-gray-900">15+</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Years of Experience
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                    <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
                    <p className="text-2xl font-bold">₹500Cr+</p>
                    <p className="text-sm text-emerald-100 mt-1">
                      Property Value Managed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ Core Values ═══ */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
              <Award className="w-3.5 h-3.5" />
              Our Values
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              What Sets Us Apart
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Our core values drive everything we do, from the first
              consultation to handing over the keys
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className={`w-6 h-6 ${value.text}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Contact / CTA Section ═══ */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full filter blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
                Connect with our expert team today and take the first step
                toward your perfect property.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                >
                  Browse Properties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +91 98765 43210
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> hello@auraproperties.in
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Mumbai, India
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
