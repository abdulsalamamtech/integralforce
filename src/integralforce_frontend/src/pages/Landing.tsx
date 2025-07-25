import { ArrowRight, BookOpen, Trophy, Coins, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Header } from '../components/Header';
import { useUser } from '../context/UserContext';


export const Landing = () => {
  const { user, logout } = useUser();
  const features = [
    {
      icon: BookOpen,
      title: "Learn & Earn",
      description: "Master human rights concepts and earn Knowledge Points for every lesson completed"
    },
    {
      icon: Trophy,
      title: "Quiz Challenges",
      description: "Test your knowledge with interactive quizzes and multiply your KP rewards"
    },
    {
      icon: Zap,
      title: "Stake & Multiply",
      description: "Stake your KP tokens for enhanced rewards and unlock premium features"
    },
    {
      icon: Shield,
      title: "NFT Certificates",
      description: "Convert your achievements into valuable NFTs on the ICP blockchain"
    }
  ];

  // images
  const images = [
    "https://img.freepik.com/free-vector/dfinity-internet-computer-icp-token-symbol-cryptocurrency-center-spiral-glowing-dots-dark-background-cryptocurrency-logo-icon-banner-news-vector-illustration_337410-1030.jpg",
    "data:image/jpeg;base64,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",
    "data:image/jpeg;base64,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"
  ];

  return (
    <div>
      
      {/* Landing page content */}
      <div className="bg-gradient-hero relative overflow-hidden">

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-lg animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4" style={{backgroundImage: `url(${images[Math.floor(Math.random() * images.length)]})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'rgba(0, 0, 0, 0.6)', backgroundBlendMode: 'darken'}}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <Globe className="h-20 w-20 text-secondary mx-auto mb-6 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Learn. Earn.{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Own ✨.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in delay-300">
              The first Web3 education platform that rewards your learning journey with blockchain-verified Knowledge Points
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-500">
              <Link to="/auth">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-lg px-8 py-4 shadow-glow hover:shadow-primary/50 transition-all duration-300 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="https://www.youtube.com/@DFINITY" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10"
                >
                  Watch Demo
                </Button>
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">10K+</div>
                <div className="text-sm">Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">500+</div>
                <div className="text-sm">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1M+</div>
                <div className="text-sm">KP Earned</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">
              Why Choose ICP Integral Force?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 hover-scale"
                >
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Web3 Education Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of learners earning Knowledge Points and building their future in Web3
            </p>
            <Link to="/auth">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-12 py-4 shadow-glow hover:shadow-primary/50 transition-all duration-300"
              >
                Start Learning Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};