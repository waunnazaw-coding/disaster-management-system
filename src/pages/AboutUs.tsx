const AboutUsPage = () => {
    // Placeholder data for impact stats; replace with live data as needed
    const reliefTeamsCount = 25;
    const disastersHandled = 40;
    const volunteersCount = 350;
    const aidDistributed = "15,000+";

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16 px-3 sm:px-6 md:px-20">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-6 md:p-12">
                {/* Mission & Vision */}
                <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center tracking-wide">
                    Our Mission & Vision
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                    We exist to build resilient communities across Myanmar by coordinating timely disaster relief efforts and empowering local people with resources, education, and technology.
                </p>

                {/* Who You Are */}
                <div className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-3 mt-6">
                        Who We Are
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        We are a dedicated nonprofit organization partnering with local volunteers, government agencies, and international collaborators to provide humanitarian aid and disaster response in Myanmar.
                    </p>
                </div>

                {/* What You Do */}
                <div className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-3">
                        What We Do
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-6 space-y-1">
                        <li>Coordinate rapid disaster response teams to deliver aid and support.</li>
                        <li>Engage and train local volunteers for efficient community assistance.</li>
                        <li>Distribute essential resources such as food, medical kits, and shelter.</li>
                        <li>Leverage technology to improve communication, mapping, and resource tracking.</li>
                        <li>Promote disaster preparedness through education and awareness programs.</li>
                    </ul>
                </div>

                {/* Impact / Proof Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-14 text-center">
                    <div className="bg-blue-100 rounded-xl p-6 shadow transition-transform hover:scale-105">
                        <h3 className="text-3xl font-bold text-blue-800">{reliefTeamsCount}</h3>
                        <p className="text-gray-700 mt-2 font-semibold">Active Relief Teams</p>
                    </div>
                    <div className="bg-orange-100 rounded-xl p-6 shadow transition-transform hover:scale-105">
                        <h3 className="text-3xl font-bold text-orange-800">{disastersHandled}</h3>
                        <p className="text-gray-700 mt-2 font-semibold">Disasters Handled</p>
                    </div>
                    <div className="bg-green-100 rounded-xl p-6 shadow transition-transform hover:scale-105">
                        <h3 className="text-3xl font-bold text-green-800">{volunteersCount}</h3>
                        <p className="text-gray-700 mt-2 font-semibold">Registered Volunteers</p>
                    </div>
                    <div className="bg-teal-100 rounded-xl p-6 shadow transition-transform hover:scale-105">
                        <h3 className="text-3xl font-bold text-teal-800">{aidDistributed}</h3>
                        <p className="text-gray-700 mt-2 font-semibold">Aid Kits Distributed</p>
                    </div>
                </div>


                {/* Local Relevance */}
                <div className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-3">
                        Local Challenges & Our Response
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Myanmar faces frequent disasters, from cyclones to floods and earthquakes. We tailor our strategies to local geography, infrastructure, and communities to ensure relief is effective, rapid, and sustainable.
                    </p>
                </div>

                {/* Core Values */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-blue-50 rounded-xl p-6 shadow hover:scale-105 transition">
                            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Collaboration</h3>
                            <p className="text-gray-700">We work with partners and communities across Myanmar to maximize impact.</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-6 shadow hover:scale-105 transition">
                            <h3 className="text-2xl font-semibold text-orange-700 mb-3">Empowerment</h3>
                            <p className="text-gray-700">We equip people with tools and knowledge to recover and prepare for tomorrow.</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6 shadow hover:scale-105 transition">
                            <h3 className="text-2xl font-semibold text-green-700 mb-3">Transparency & Innovation</h3>
                            <p className="text-gray-700">We operate openly and leverage technology for effective disaster management.</p>
                        </div>
                    </div>
                </div>

                {/* Technical Supporters */}
                <div className="mb-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-6 text-center">Our Technical Supporters</h2>
                    <div className="flex flex-wrap gap-6 justify-center items-center">
                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center border">
                            <img
                                src="https://aceinspiration.com/wp-content/uploads/2017/08/logo-ACE-white-with-shadow.png"
                                alt="ACE Inspiration Logo"
                                className="h-12 mb-2"
                                style={{objectFit:"contain"}}
                            />
                            <span className="font-bold text-blue-800">ACE Inspiration</span>
                            <span className="text-xs text-gray-500">Technical Partner</span>
                        </div>
                        {/* Add more support organizations as needed */}
                    </div>
                </div>

                {/* Emotional Connection */}
                <blockquote className="mt-10 text-center italic font-light text-gray-600">
                    “Together, we build a safer, stronger Myanmar—standing resilient through every adversity and challenge.”
                </blockquote>
            </div>
        </section>
    );
};

export default AboutUsPage;
