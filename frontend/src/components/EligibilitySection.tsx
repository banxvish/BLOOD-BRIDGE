import { motion } from "framer-motion";

const EligibilitySection = () => {
    return (
        <section className="py-24 px-6 bg-background">
            <div className="container max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold mb-4">Eligibility to Donate Blood</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Basic requirements to ensure the safety of both the donor and the recipient.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        <div className="glass-card rounded-xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                <span className="text-xl font-bold text-red-400">18+</span>
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-white mb-2">Age</h3>
                            <p className="text-sm text-muted-foreground">
                                You must be between 18 and 65 years old to donate blood safely.
                            </p>
                        </div>

                        <div className="glass-card rounded-xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                <span className="text-xl font-bold text-red-400">50</span>
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-white mb-2">Weight Requirement</h3>
                            <p className="text-sm text-muted-foreground">
                                You must weigh at least 50 kg (110 lbs) to be eligible to donate.
                            </p>
                        </div>

                        <div className="glass-card rounded-xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-white mb-2">Good Health</h3>
                            <p className="text-sm text-muted-foreground">
                                You must be in generally good health and feeling well on the day of donation.
                            </p>
                        </div>

                        <div className="glass-card rounded-xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-white mb-2">Time Interval</h3>
                            <p className="text-sm text-muted-foreground">
                                At least exactly 3 months (90 days) since your last blood donation.
                            </p>
                        </div>

                        <div className="glass-card rounded-xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-white mb-2">Tattoos / Piercings</h3>
                            <p className="text-sm text-muted-foreground">
                                Must wait 6 months after getting a tattoo or body piercing before donating.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default EligibilitySection;
