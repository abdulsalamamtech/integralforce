import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PenTool, Save, Eye, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WriteArticle = () => {
  const { user, deductKP, addKP } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (user.knowledgePoints < 10) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Insufficient Knowledge Points</CardTitle>
            <CardDescription>
              You need at least 10 KP to write an article. You currently have {user.knowledgePoints} KP.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/learn')}>
              Earn More KP
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (content.length < 100) {
      toast({
        title: "Content Too Short",
        description: "Article content should be at least 100 characters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate article submission
    setTimeout(() => {
      deductKP(10, 'Article Publishing Cost'); // Cost to publish
      addKP(25, 'Article Publishing Reward'); // Reward for publishing
      
      toast({
        title: "Article Published!",
        description: "Your article has been published successfully. You earned 25 KP!",
      });
      
      setIsSubmitting(false);
      navigate('/articles');
    }, 2000);
  };

  const estimatedReadTime = Math.max(1, Math.ceil(content.split(' ').length / 200));

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Article Preview</h1>
            <Button onClick={() => setIsPreview(false)} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Close Preview
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <div className="space-y-4">
                <p className="text-muted-foreground">{excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>By {user.username}</span>
                  <span>{estimatedReadTime} min read</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <PenTool className="mr-3 h-8 w-8" />
              Write Article
            </h1>
            <p className="text-muted-foreground">
              Share your knowledge with the community (Costs 10 KP, Earn 25 KP on publish)
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {user.knowledgePoints} KP Available
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>
              Fill in the details for your article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter your article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                placeholder="Write a brief summary of your article..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={300}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {excerpt.length}/300 characters
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (Optional, max 5)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  disabled={tags.length >= 5}
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  disabled={!currentTag.trim() || tags.length >= 5}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="min-h-[500px]"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{content.length} characters</span>
                <span>Estimated read time: {estimatedReadTime} minutes</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsPreview(true)}
                variant="outline"
                disabled={!title || !content}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !excerpt.trim() || !content.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Publish Article
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};