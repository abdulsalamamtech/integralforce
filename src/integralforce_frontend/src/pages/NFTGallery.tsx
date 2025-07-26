import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import nftData from '../data/nfts.json';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  cost: number;
  category: string;
  attributes: Record<string, string | undefined>;
  available: boolean;
}

export const NFTGallery: React.FC = () => {
  const { user, deductKP } = useUser();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-card p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please log in to access the NFT Gallery.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = ['all', ...new Set(nftData.map(nft => nft.category))];
  
  const filteredNFTs = selectedCategory === 'all' 
    ? nftData 
    : nftData.filter(nft => nft.category === selectedCategory);

  const handleMintNFT = (nft: NFT) => {
    if (!nft.available) {
      toast({
        title: "NFT Unavailable",
        description: "This NFT is no longer available for minting.",
        variant: "destructive",
      });
      return;
    }

    if (user.knowledgePoints < nft.cost) {
      toast({
        title: "Insufficient KP",
        description: `You need ${nft.cost} KP to mint this NFT.`,
        variant: "destructive",
      });
      return;
    }

    if (deductKP(nft.cost, `NFT Mint: ${nft.name}`)) {
      toast({
        title: "NFT Minted! 🎉",
        description: `Successfully minted "${nft.name}" for ${nft.cost} KP!`,
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">NFT Gallery</h1>
          <p className="text-muted-foreground">
            Convert your Knowledge Points into unique NFT certificates on the ICP blockchain
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-lg p-2">
              💎 Your KP: {user.knowledgePoints.toLocaleString()}
            </Badge>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? 'All NFTs' : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft) => (
                <Card key={nft.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="relative">
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity}
                    </div>
                    <div className="text-center">
                      <div className="text-6xl mb-3">{nft.image}</div>
                      <CardTitle className="text-lg">{nft.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">{nft.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                      {nft.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Attributes:</h4>
                        {Object.entries(nft.attributes).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Cost:</span>
                          <Badge variant="secondary">{nft.cost} KP</Badge>
                        </div>
                        <Button 
                          onClick={() => handleMintNFT(nft)}
                          disabled={!nft.available || user.knowledgePoints < nft.cost}
                          size="sm"
                          className="min-w-[80px]"
                        >
                          {!nft.available ? 'Sold Out' : 'Mint NFT'}
                        </Button>
                      </div>
                      
                      {!nft.available && (
                        <div className="text-center">
                          <Badge variant="destructive" className="text-xs">
                            Limited Edition - No Longer Available
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No NFTs found in this category.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Your NFT Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{user.nfts.length}</div>
                  <div className="text-sm text-muted-foreground">NFTs Owned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {nftData.filter(nft => !nft.available).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Limited Editions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {nftData.filter(nft => nft.rarity === 'Legendary').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Legendary</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {categories.length - 1}
                  </div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};