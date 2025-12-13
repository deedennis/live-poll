import { useNavigate } from 'react-router-dom';
import { FaRocket, FaUsers, FaChartLine, FaHeart, FaBolt, FaShieldAlt } from 'react-icons/fa';

function Home() {
  const navigator = useNavigate();

  const features = [
    {
      icon: <FaRocket className="w-8 h-8 text-blue-500" />,
      title: "Real-Time Polling",
      description: "Create and participate in polls with instant live updates as votes come in.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <FaUsers className="w-8 h-8 text-purple-500" />,
      title: "Community Driven",
      description: "Join discussions, share opinions, and connect with like-minded individuals.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-green-500" />,
      title: "Visual Analytics",
      description: "Beautiful charts and graphs that make data easy to understand and share.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <FaHeart className="w-8 h-8 text-red-500" />,
      title: "Like & Engage",
      description: "Show appreciation for polls you love and track your favorite topics.",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: <FaBolt className="w-8 h-8 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Optimized for speed with instant responses and smooth interactions.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-500" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures.",
      gradient: "from-blue-500 to-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">LyzrAI Live Vote Poll App</span>
                <br />
                <span className="text-white">Real-Time Opinion Platform</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Create engaging polls, participate in real-time discussions, and discover what people think 
                about topics that matter. Experience the future of interactive polling with instant updates 
                and beautiful visualizations.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={() => navigator("/dashboard")}
                className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-transform"
              >
                <FaRocket className="mr-2 inline" />
                Start Creating Polls
              </button>
              <button 
                onClick={() => navigator("/poll")}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all"
              >
                <FaUsers className="mr-2 inline" />
                Explore Polls
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">LyzrAI Live Vote Poll App</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of polling with cutting-edge features designed for modern users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group hover:scale-105 transition-all duration-500 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-center">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;