import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Save, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const questionTypes = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
];

const categories = [
  'Human Rights',
  'Digital Rights', 
  'Social Justice',
  'Education',
  'Law',
  'Ethics',
  'Technology',
  'Environment',
  'Politics',
  'Economics'
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy (5 KP)', points: 5 },
  { value: 'medium', label: 'Medium (10 KP)', points: 10 },
  { value: 'hard', label: 'Hard (15 KP)', points: 15 }
];

export const AddQuestion = () => {
  const { user, deductKP, addKP } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questionType, setQuestionType] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (user.knowledgePoints < 20) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Insufficient Knowledge Points</CardTitle>
            <CardDescription>
              You need at least 20 KP to add a question. You currently have {user.knowledgePoints} KP.
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

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      
      // Reset correct answer if it was pointing to removed option
      const correctIndex = parseInt(correctAnswer);
      if (correctIndex === index) {
        setCorrectAnswer('');
      } else if (correctIndex > index) {
        setCorrectAnswer((correctIndex - 1).toString());
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    // Validation
    if (!questionType || !category || !difficulty || !question.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (questionType === 'multiple-choice') {
      const filledOptions = options.filter(opt => opt.trim());
      if (filledOptions.length < 2) {
        toast({
          title: "Insufficient Options",
          description: "Multiple choice questions need at least 2 options",
          variant: "destructive"
        });
        return;
      }
      
      if (!correctAnswer || parseInt(correctAnswer) >= filledOptions.length) {
        toast({
          title: "Invalid Correct Answer",
          description: "Please select a valid correct answer",
          variant: "destructive"
        });
        return;
      }
    }

    if (questionType === 'true-false' && !correctAnswer) {
      toast({
        title: "Missing Correct Answer",
        description: "Please select the correct answer",
        variant: "destructive"
      });
      return;
    }

    if (!explanation.trim()) {
      toast({
        title: "Missing Explanation",
        description: "Please provide an explanation for the answer",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate question submission
    setTimeout(() => {
      const difficultyData = difficultyLevels.find(d => d.value === difficulty);
      const rewardKP = difficultyData ? difficultyData.points + 10 : 15; // Base reward + difficulty bonus
      
      deductKP(20, 'Question Creation Cost'); // Cost to add question
      addKP(rewardKP, 'Question Creation Reward'); // Reward for adding question
      
      toast({
        title: "Question Added Successfully!",
        description: `Your question has been added to the quiz pool. You earned ${rewardKP} KP!`,
      });
      
      setIsSubmitting(false);
      navigate('/quiz');
    }, 2000);
  };

  const isValid = questionType && category && difficulty && question.trim() && 
    correctAnswer && explanation.trim() && 
    (questionType === 'true-false' || options.filter(opt => opt.trim()).length >= 2);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <HelpCircle className="mr-3 h-8 w-8" />
              Add Question
            </h1>
            <p className="text-muted-foreground">
              Contribute to the quiz pool (Costs 20 KP, Earn 15-25 KP on approval)
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {user.knowledgePoints} KP Available
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
            <CardDescription>
              Create a new question for the community quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Question Type *</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty Level *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                placeholder="Enter your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {question.length}/500 characters
              </p>
            </div>

            {/* Options */}
            {questionType && (
              <div className="space-y-4">
                <Label>Answer Options *</Label>
                
                {questionType === 'multiple-choice' ? (
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          maxLength={200}
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {options.length < 6 && (
                      <Button type="button" variant="outline" onClick={addOption}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    True/False options will be automatically generated
                  </div>
                )}
              </div>
            )}

            {/* Correct Answer */}
            {questionType && (
              <div className="space-y-2">
                <Label>Correct Answer *</Label>
                
                {questionType === 'multiple-choice' ? (
                  <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                    {options.map((option, index) => (
                      option.trim() && (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1">
                            Option {index + 1}: {option}
                          </Label>
                        </div>
                      )
                    ))}
                  </RadioGroup>
                ) : (
                  <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="true" />
                      <Label htmlFor="true">True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="false" />
                      <Label htmlFor="false">False</Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            )}

            {/* Explanation */}
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation *</Label>
              <Textarea
                id="explanation"
                placeholder="Explain why this is the correct answer..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {explanation.length}/1000 characters
              </p>
            </div>

            {/* Submit */}
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !isValid}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Adding Question...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Add Question (20 KP)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};