import { Calendar, CheckCircle2, TrendingUp, Users, ShieldCheck } from "lucide-react";
import * as motion from "motion/react-client";

export default function WhyChooseUs() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Owner-Led Excellence",
      description: "Direct owner oversight ensures 10+ years of expertise in every clean.",
    },
    {
      icon: TrendingUp,
      title: "High Standards",
      description: "Consistent, hotel-quality cleaning tailored specifically to your home.",
    },
    {
      icon: Calendar,
      title: "Seamless Booking",
      description: "Get an instant quote and book your service in under 60 seconds.",
    },
    {
      icon: Users,
      title: "Trusted Team",
      description: "Every professional is rigorously background checked and fully insured.",
    },
  ];

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      
      {/* --- DECORATIVE BACKGROUND BLOBS (3D Effect) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Blue Blob Top Left */}
        <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
        {/* Purple Blob Bottom Right */}
        <div className="absolute top-[20%] -right-[5%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        {/* Pink Blob Center */}
        <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Why Choose <span className="text-blue-600">Botique Maid?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            We don't just clean; we care for your home with owner-led precision.
          </motion.p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }} // Float up effect
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5"
            >
              {/* ICON CIRCLE */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* TEXT */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}