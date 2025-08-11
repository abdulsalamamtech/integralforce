import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useToast } from '../hooks/use-toast';
import { integralforce_backend } from '../../../declarations/integralforce_backend';
import '/index.css';
const { user, addKP, deductKP } = useUser();
const { toast } = useToast();

const AnswerQuestion = () => {
  const [topic, setTopic] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [inputAnswer, setInputAnswer] = useState('');
  const [evaluationResult, setEvaluationResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleGenerateQuestion = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const response = await integralforce_backend.generateQuestion(topic);
      setGeneratedQuestion(response);
      setEvaluationResult('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!inputAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const response = await integralforce_backend.evaluateAnswer(inputAnswer);
      setEvaluationResult(response);
      // set earning 3 KP for each question answered
      // await integralforce_backend.earnKP(3);
      let kpEarned : number = 0;
        if (kpEarned > 0) {
          addKP(kpEarned, `Answer question completion`);
          toast({
            title: "Answer Question Completed!",
            description: `You earned ${kpEarned} KP!`,
          });
        } else {
          toast({
            title: "Answer Question Completed",
            description: "Better luck next time! Try again to improve your score.",
            variant: "destructive",
          });
        }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    // bg-gradient-card
    // <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-900 p-6">
    <div className="flex min-h-screen items-center justify-center bg-gradient-card p-6">
      <div className="w-full max-w-lg p-8 text-card-foreground bg-opacity-10 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">AI Powered Quiz Generator</h1>
        {/* small description */}
        <p className="text-white text-center mb-6">
          Generate questions based on topics and evaluate your answers with AI.
          {/* earn 3 kp for each question answered */}
          <br />
          <span className="text-yellow-400 font-semibold">Earn 3 KP for each question answered!</span>
        </p>

        {/* Select Question Topic */}
        <div className="mb-6">
          <label className="block text-white text-lg mb-2">Enter a topic:</label>
          <input
            type="text"
            className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-white placeholder-white/50"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Gender Equality"
            disabled={isGenerating}
          />

          {(generatedQuestion || evaluationResult) ? "" : (
            <button
              className="w-full mt-3 py-3  bg-indigo-500 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:bg-indigo-300"
              onClick={handleGenerateQuestion}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Question'}
            </button>
          )}

        </div>

        {/* Generated Question Display */}
        {generatedQuestion && (
          <div className="mb-6 p-4 bg-white/20 text-white rounded-lg border border-white/30">
            <strong>Question:</strong>
            <p>{generatedQuestion}</p>
          </div>
        )}

        {/* Generated Question Response Form */}
        {generatedQuestion && (
          <div className="mb-6">
            <label className="block text-white text-lg mb-2">Your Answer:</label>
            <input
              type="text"
              className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-white placeholder-white/50"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              placeholder="Type your answer here"
              disabled={isEvaluating}
            />
            <button
              className="w-full mt-3 py-3 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:bg-green-300"
              onClick={handleEvaluateAnswer}
              disabled={isEvaluating}
            >
              {isEvaluating ? 'Evaluating...' : 'Evaluate Answer'}
            </button>
          </div>
        )}

        {/* Evaluated Result */}
        {evaluationResult && (
          <div className="p-4 bg-white/20 text-white rounded-lg border border-white/30 text-center">
            <strong>Evaluation Result:</strong>
            <p>{evaluationResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerQuestion;

