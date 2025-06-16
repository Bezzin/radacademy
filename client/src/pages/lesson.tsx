import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/video-player";
import { QuizComponent } from "@/components/quiz-component";
import { apiRequest } from "@/lib/queryClient";

export default function Lesson() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [watchTime, setWatchTime] = useState(0);

  const { data: lesson, isLoading } = useQuery({
    queryKey: [`/api/lessons/${id}`],
  });

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/lessons/${id}/complete`, { watchTime });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  if (isLoading || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-500 mx-auto mb-4"></div>
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  const handleVideoProgress = (currentTime: number, duration: number) => {
    setWatchTime(currentTime);
  };

  const handleVideoComplete = () => {
    if (!lesson.completed) {
      completeLessonMutation.mutate();
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* Video Player */}
          <div className="mb-6">
            <VideoPlayer
              videoUrl={lesson.videoUrl}
              title={lesson.title}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
            />
          </div>

          {/* Lesson Content Tabs */}
          <Card>
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-3 bg-transparent">
                  <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-medical-blue-500">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="transcript" className="data-[state=active]:border-b-2 data-[state=active]:border-medical-blue-500">
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:border-b-2 data-[state=active]:border-medical-blue-500">
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="p-6">
                <h2 className="text-xl font-semibold mb-4">{lesson.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {lesson.transcript || "In this lesson, we'll explore the fundamental concepts and practical applications in radiology."}
                </p>
                
                {lesson.objectives && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Learning Objectives</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      {lesson.objectives.map((objective: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="transcript" className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{lesson.transcript || "Transcript will be available soon."}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="p-6">
                <div className="text-gray-500 dark:text-gray-400">
                  <p>Take notes while watching the lesson. Your notes will be saved automatically.</p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm">Note-taking feature coming soon!</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Lesson Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>2 of 12 lessons</span>
                  <span className="text-medical-blue-600 dark:text-medical-blue-400 font-medium">17%</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">{lesson.title}</span>
                  {lesson.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-medical-blue-500 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                  <span>Hemorrhage Detection</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                  <span>Stroke Imaging</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Component */}
          <QuizComponent lessonId={parseInt(id!)} />

          {/* Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                {lesson.previousLesson ? (
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}
                {lesson.nextLesson ? (
                  <Button size="sm" className="bg-medical-blue hover:bg-medical-blue-600">
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    Course Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
