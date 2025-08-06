const AboutUsPage = () => {
    // Impact stats data
    const impactStats = [
        { value: 25, label: "Active Relief Teams", color: "blue" },
        { value: 40, label: "Disasters Responded To", color: "orange" },
        { value: "15,000+", label: "Aid Kits Distributed", color: "teal" }
    ];

    const coreValues = [
        {
            title: "Rapid Response",
            description: "Mobilizing resources within hours of disaster events",
            color: "blue"
        },
        {
            title: "Community Focus",
            description: "Tailoring solutions to local needs and conditions",
            color: "orange"
        },
        {
            title: "Tech-Driven",
            description: "Leveraging technology for efficient coordination",
            color: "green"
        }
    ];

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
                        Disaster Response Coordination for Myanmar
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        We provide rapid, effective disaster response through professional teams and strategic partnerships.
                    </p>
                </div>

                {/* Mission & Impact */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold text-blue-700 mb-6">Our Mission</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            To coordinate professional disaster response efforts that deliver timely aid and build community resilience across Myanmar.
                        </p>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Approach</h3>
                            <p className="text-gray-700">
                                Combining trained response teams, strategic partnerships, and technology to maximize impact.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold text-blue-700 mb-6">Our Impact</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {impactStats.map((stat, index) => (
                                <div 
                                    key={index}
                                    className={`bg-${stat.color}-50 p-4 rounded-xl border-l-4 border-${stat.color}-500`}
                                >
                                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-gray-700 font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-600">
                            Measurable results demonstrating our commitment to effective disaster response.
                        </p>
                    </div>
                </div>

                {/* What We Do */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-20">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-blue-700 p-8 text-white">
                            <h2 className="text-3xl font-bold mb-6">Our Services</h2>
                            <p className="mb-6">
                                Professional disaster response coordination:
                            </p>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Emergency Response</h3>
                                        <p className="text-gray-700">24/7 disaster assessment and rapid deployment</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-orange-100 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Resource Coordination</h3>
                                        <p className="text-gray-700">Efficient distribution of aid and supplies</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Situation Analysis</h3>
                                        <p className="text-gray-700">Real-time assessment and reporting</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-teal-100 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Tech Solutions</h3>
                                        <p className="text-gray-700">Coordination platforms and mapping tools</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">Our Operational Principles</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {coreValues.map((value, index) => (
                            <div 
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-md border-t-4 border-${value.color}-500 hover:shadow-lg transition-shadow`}
                            >
                                <div className={`bg-${value.color}-100 w-14 h-14 rounded-full flex items-center justify-center mb-6`}>
                                    <span className={`text-2xl font-bold text-${value.color}-700`}>{index + 1}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                                <p className="text-gray-700">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partners */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                    <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Our Technical Partners</h2>
                    <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10">
                        We work with specialized organizations to enhance our capabilities
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-4 rounded-lg shadow-sm border w-40 h-40 flex items-center justify-center">
                                <img
                                    src="https://aceinspiration.com/wp-content/uploads/2017/08/logo-ACE-white-with-shadow.png"
                                    alt="ACE Inspiration Logo"
                                    className="max-h-16"
                                    style={{objectFit:"contain"}}
                                />
                            </div>
                            <span className="font-medium text-gray-800 mt-3">ACE Inspiration</span>
                            <span className="text-sm text-gray-500">Technology Solutions</span>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Need Disaster Response Support?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Contact our coordination team for emergency response assistance
                    </p>
                    <button className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition">
                        Contact Our Team
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutUsPage;