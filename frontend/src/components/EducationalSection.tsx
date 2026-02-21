import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const EducationalSection = () => {
    const mythsAndFacts = [
        {
            myth: "Donating blood makes you weak and tired for days.",
            fact: "Your body replenishes the lost fluid within 24 hours. Most donors feel completely normal immediately after donating.",
        },
        {
            myth: "You can get an infection from donating blood.",
            fact: "Sterile, disposable equipment is used for every donor. There is absolutely no risk of contracting infections like HIV.",
        },
        {
            myth: "I can't donate because I'm on medication.",
            fact: "In most cases, medications do not disqualify you. It depends on the underlying condition being treated.",
        },
        {
            myth: "Vegetarians don't have enough iron to donate blood.",
            fact: "A balanced vegetarian diet provides plenty of iron. Spinach, beans, and lentils are excellent sources.",
        },
    ];



    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="container max-w-6xl mx-auto space-y-20">

                {/* Myths vs Facts */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-primary" />
                            <span className="text-primary font-heading font-semibold uppercase tracking-wider text-sm">
                                Education
                            </span>
                        </div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Myths & Facts
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Separating fiction from reality to help you make an informed decision about saving lives.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {mythsAndFacts.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <XCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">Myth</span>
                                        <p className="font-medium text-white/90">{item.myth}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-1">Fact</span>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.fact}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default EducationalSection;
