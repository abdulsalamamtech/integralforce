import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { FloatingChat } from "./components/FloatingChat";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { SelectLevel } from "./pages/SelectLevel";
import { Learn } from "./pages/Learn";
import { Quiz } from "./pages/Quiz";
import { Games } from "./pages/Games";
import { Chat } from "./pages/Chat";
import { NFTGallery } from "./pages/NFTGallery";
import { Leaderboard } from "./pages/Leaderboard";
import { Staking } from "./pages/Staking";
import { Account } from "./pages/Account";
import { Profile } from "./pages/Profile";
import { ConvertNFT } from "./pages/ConvertNFT";
import { Articles } from "./pages/Articles";
import { ArticleDetail } from "./pages/ArticleDetail";
import { WriteArticle } from "./pages/WriteArticle";
import { AddQuestion } from "./pages/AddQuestion";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header";


// answer question
import AnswerQuestion from "./pages/AnswerQuestion";

// const { user, logout } = useUser();
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="icp-edu-theme">
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              {/* Navigation */}
              <Navigation />

              {/* Main content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/answer-question" element={<AnswerQuestion />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/select-level" element={<SelectLevel />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/nft" element={<NFTGallery />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/staking" element={<Staking />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route path="/convert-nft" element={<ConvertNFT />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />
                  <Route path="/write-article" element={<WriteArticle />} />
                  <Route path="/add-question" element={<AddQuestion />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />

              {/* Floating chat */}
              {/* <FloatingChat /> */}
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
