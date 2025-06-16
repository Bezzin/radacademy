import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

interface QuizComponentProps {
  lessonId: number;
}

export function QuizComponent({ lessonId }: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    explanation: string;
    correctAnswer: number;
  } | null>(null);

  const { data: quizzes, isLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/quizzes`],
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: number) => {
      const response = await apiRequest("POST", `/api/quizzes/${lessonId}/submit`, { answer });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setShowResult(true);
    },
  });

  if (isLoading || !quizzes || quizzes.length === 0) {
    return null;
  }

  const quiz = quizzes[0];

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      submitAnswerMutation.mutate(selectedAnswer);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Knowledge Check</CardTitle>
      </CardHeader>
      <CardContent>
        {!showResult ? (
          <div className="space-y-4">
            <p className="text-sm font-medium mb-3">{quiz.question}</p>
            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            >
              {quiz.choices.map((choice: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`choice-${index}`} />
                  <Label htmlFor={`choice-${index}`} className="text-sm cursor-pointer flex-1">
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || submitAnswerMutation.isPending}
              className="w-full bg-medical-blue hover:bg-medical-blue-600"
            >
              {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              result?.correct
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
            }`}>
              {result?.correct ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  result?.correct
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}>
                  {result?.correct ? "Correct!" : "Incorrect"}
                </p>
                {result?.explanation && (
                  <p className={`text-sm ${
                    result?.correct
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {result.explanation}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-medium">Your answer: {quiz.choices[selectedAnswer!]}</p>
              {!result?.correct && (
                <p className="text-green-600 dark:text-green-400">
                  Correct answer: {quiz.choices[result?.correctAnswer!]}
                </p>
              )}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Try Another Question
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
