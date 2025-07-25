import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import chatData from '@/data/chat.json';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  conversation: Message[];
}

export const Chat: React.FC = () => {
  const { user, deductKP, addKP } = useUser();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-card p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please log in to access the AI Chat feature.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartChat = (chat: ChatSession) => {
    if (user.knowledgePoints < chat.cost) {
      toast({
        title: "Insufficient KP",
        description: `You need ${chat.cost} KP to start this chat.`,
        variant: "destructive",
      });
      return;
    }

    if (deductKP(chat.cost, `AI Chat: ${chat.title}`)) {
      setSelectedChat(chat);
      setMessages(chat.conversation);
      toast({
        title: "Chat Started",
        description: `${chat.cost} KP deducted. Chat session initiated!`,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
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
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Award 1 KP for meaningful interaction
      addKP(1, 'AI Chat Interaction');
      
      toast({
        title: "+1 KP Earned",
        description: "Great question! Keep learning.",
      });
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's a great question about human rights! The Universal Declaration of Human Rights, adopted in 1948, establishes that all humans are born free and equal in dignity and rights.",
      "Human rights are protected by international law and apply to everyone regardless of nationality, race, gender, or religion. They're designed to ensure everyone can live with dignity.",
      "Education is indeed a fundamental human right. Article 26 of the Universal Declaration states that everyone has the right to education, and it should be free and accessible.",
      "Privacy rights have become increasingly important in our digital age. Everyone has the right to privacy and protection of their personal data.",
      "Children have special rights under the Convention on the Rights of the Child, including protection from harm and the right to participate in decisions affecting them.",
      "Freedom of expression is a cornerstone of democracy, but it comes with responsibilities and may be limited to protect others' rights and safety."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleEndChat = () => {
    setSelectedChat(null);
    setMessages([]);
    toast({
      title: "Chat Ended",
      description: "Thank you for learning with us!",
    });
  };

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-card p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  🤖 {selectedChat.title}
                  <Badge variant="secondary">{selectedChat.category}</Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-1">{selectedChat.description}</p>
              </div>
              <Button variant="outline" onClick={handleEndChat}>
                End Chat
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4 p-4 border rounded-lg">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-2 rounded-lg">
                        <p className="text-sm">AI is typing...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about human rights..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">AI Chat Assistant</h1>
          <p className="text-muted-foreground">
            Learn about human rights through interactive conversations with our AI
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-lg p-2">
              💎 Your KP: {user.knowledgePoints.toLocaleString()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(chatData as ChatSession[]).map((chat) => (
            <Card key={chat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{chat.title}</span>
                  <Badge variant="secondary">{chat.category}</Badge>
                </CardTitle>
                <p className="text-muted-foreground text-sm">{chat.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Cost:</span>
                    <Badge variant="outline">{chat.cost} KP</Badge>
                  </div>
                  <Button 
                    onClick={() => handleStartChat(chat)}
                    disabled={user.knowledgePoints < chat.cost}
                    size="sm"
                  >
                    Start Chat
                  </Button>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  💬 {chat.conversation.length} messages in conversation
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};