import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Plus, History } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const { user, deductKP, addKP } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('new');
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const createNewChat = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to start chatting.",
        variant: "destructive",
      });
      return;
    }

    if (user.knowledgePoints < 2) {
      toast({
        title: "Insufficient KP",
        description: "You need 2 KP to start a new chat.",
        variant: "destructive",
      });
      return;
    }

    if (deductKP(2, 'New AI Chat Session')) {
      const newSession: ChatSession = {
        id: `chat_${Date.now()}`,
        title: `Chat ${chatHistory.length + 1}`,
        messages: [{
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: "Hello! I'm your AI assistant. How can I help you learn about human rights today?",
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString()
      };

      setCurrentSession(newSession);
      setActiveTab('chat');
      
      toast({
        title: "Chat Started",
        description: "2 KP deducted. New chat session created!",
      });
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's a great question about human rights! The Universal Declaration of Human Rights establishes fundamental principles of equality and dignity.",
      "Human rights are universal and apply to everyone. They protect our basic freedoms and ensure we can live with dignity.",
      "Education is a fundamental human right that empowers people and helps build better societies.",
      "Privacy rights are increasingly important in our digital world. Everyone deserves protection of their personal information.",
      "Children have special rights that ensure their protection, development, and participation in society.",
      "Freedom of expression is essential for democracy, but it must be balanced with respect for others' rights."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading || !user) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };

    setCurrentSession(updatedSession);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse]
      };

      setCurrentSession(finalSession);
      setIsLoading(false);
      
      // Update chat history
      setChatHistory(prev => {
        const existing = prev.findIndex(chat => chat.id === finalSession.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = finalSession;
          return updated;
        }
        return [...prev, finalSession];
      });

      // Award 1 KP for interaction
      addKP(1, 'AI Chat Interaction');
      
      toast({
        title: "+1 KP Earned",
        description: "Great interaction!",
      });
    }, 1000 + Math.random() * 2000);
  };

  const loadChatFromHistory = (chat: ChatSession) => {
    setCurrentSession(chat);
    setActiveTab('chat');
  };

  if (!user) {
    return (
      <div className="h-96 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to use AI Chat</p>
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">AI Chat Assistant</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-scroll">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          {currentSession && (
            <TabsTrigger value="chat">
              Current Chat
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="new" className="flex-1 flex flex-col p-4">
          <div className="text-center space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                💎 Your KP: {user.knowledgePoints.toLocaleString()}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Start a new AI chat session for 2 KP
              </p>
            </div>
            <Button onClick={createNewChat} disabled={user.knowledgePoints < 2}>
              Start New Chat (2 KP)
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4">
          <ScrollArea className="h-full">
            {chatHistory.length === 0 ? (
              <p className="text-center text-muted-foreground">No chat history yet</p>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => loadChatFromHistory(chat)}
                  >
                    <div className="font-medium text-sm">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {chat.messages.length} messages • {new Date(chat.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {currentSession && (
          <TabsContent value="chat" className="flex-1 flex flex-col relative">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-3 py-2 rounded-lg">
                      <p className="text-sm">AI is typing...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t sticky bottom-0 left-0 right-0 bg-background">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about human rights..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="text-sm"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                >
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};