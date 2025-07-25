import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Coins, Image, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const conversionRates = [
  { kp: 100, nftType: "Bronze Badge", rarity: "Common", description: "A bronze achievement badge" },
  { kp: 250, nftType: "Silver Certificate", rarity: "Uncommon", description: "A silver learning certificate" },
  { kp: 500, nftType: "Gold Medal", rarity: "Rare", description: "A prestigious gold medal" },
  { kp: 1000, nftType: "Platinum Trophy", rarity: "Epic", description: "An exclusive platinum trophy" },
  { kp: 2000, nftType: "Diamond Crown", rarity: "Legendary", description: "A legendary diamond crown" }
];

export const ConvertNFT = () => {
  const { user, deductKP } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [converting, setConverting] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleConvert = async (amount: number) => {
    if (amount > user.knowledgePoints) {
      toast({
        title: "Insufficient KP",
        description: `You need ${amount} KP but only have ${user.knowledgePoints} KP`,
        variant: "destructive"
      });
      return;
    }

    setConverting(true);

    // Simulate conversion process
    setTimeout(() => {
      deductKP(amount, 'NFT Conversion');
      const nftData = conversionRates.find(rate => rate.kp === amount);
      
      toast({
        title: "NFT Created Successfully!",
        description: `Your ${nftData?.nftType || 'NFT'} has been minted and added to your collection.`,
      });
      
      setConverting(false);
      setSelectedAmount(0);
      setCustomAmount('');
    }, 2000);
  };

  const handleCustomConvert = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Minimum conversion is 50 KP",
        variant: "destructive"
      });
      return;
    }
    handleConvert(amount);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500';
      case 'Uncommon': return 'bg-green-500';
      case 'Rare': return 'bg-blue-500';
      case 'Epic': return 'bg-purple-500';
      case 'Legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Convert KP to NFT</h1>
          <p className="text-muted-foreground">Transform your Knowledge Points into unique digital collectibles</p>
        </div>

        {/* Current KP Display */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium">Available KP:</span>
              </div>
              <Badge variant="secondary" className="text-xl px-4 py-2">
                {user.knowledgePoints}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Preset Conversion Options */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Convert</CardTitle>
            <CardDescription>Choose from preset NFT options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conversionRates.map((option) => (
                <div 
                  key={option.kp}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedAmount === option.kp ? 'border-primary bg-primary/5' : ''
                  } ${option.kp > user.knowledgePoints ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => option.kp <= user.knowledgePoints && setSelectedAmount(option.kp)}
                >
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{option.nftType}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="space-y-2">
                      <Badge 
                        className={`${getRarityColor(option.rarity)} text-white`}
                      >
                        {option.rarity}
                      </Badge>
                      <div className="flex items-center justify-center space-x-2">
                        <Coins className="h-4 w-4" />
                        <span className="font-bold">{option.kp} KP</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedAmount > 0 && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => handleConvert(selectedAmount)}
                  disabled={converting}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  {converting ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Creating NFT...
                    </>
                  ) : (
                    <>
                      Convert {selectedAmount} KP to NFT
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Amount Conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Conversion</CardTitle>
            <CardDescription>Convert a custom amount of KP (Minimum: 50 KP)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="custom-amount">Amount (KP)</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter KP amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="50"
                  max={user.knowledgePoints}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCustomConvert}
                  disabled={converting || !customAmount || parseInt(customAmount) < 50}
                  className="w-full md:w-auto"
                >
                  {converting ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Convert to NFT
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>• Minimum conversion: 50 KP</p>
              <p>• Custom NFTs are unique and generated based on the amount converted</p>
              <p>• Higher amounts create rarer and more valuable NFTs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};