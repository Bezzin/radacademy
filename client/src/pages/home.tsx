import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookOpen, CheckCircle, Flame, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Type-safe access to stats properties
  const coursesInProgress = stats?.coursesInProgress || 0;
  const averageProgress = stats?.averageProgress || 0;
  const completedLessons = stats?.completedLessons || 0;
  const studyStreak = stats?.studyStreak || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, Dr. Chen
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your radiology education journey
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold">Courses in Progress</CardTitle>
              <BookOpen className="h-5 w-5 text-medical-blue-600 dark:text-medical-blue-400" />
            </div>
            <div className="text-3xl font-bold text-medical-blue-600 dark:text-medical-blue-400 mb-2">
              {coursesInProgress}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average progress: {averageProgress}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold">Completed Lessons</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedLessons}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This month: +{Math.floor(completedLessons / 3)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold">Study Streak</CardTitle>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {studyStreak}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              days in a row
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=80" 
              alt="CT Brain Scan" 
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                CT Fundamentals: Brain Anatomy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Lesson 2 of 12 • 24 minutes remaining
              </p>
              <Progress value={75} className="h-2" />
            </div>
            <Link href="/lessons/2">
              <Button className="bg-medical-blue hover:bg-medical-blue-600">
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/courses">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <BookOpen className="h-6 w-6 text-medical-blue-600 dark:text-medical-blue-400 mb-2" />
                <h3 className="font-medium mb-1">Browse Courses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explore our course catalog</p>
              </div>
            </Link>
            <Link href="/community">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <h3 className="font-medium mb-1">Join Discussion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with peers</p>
              </div>
            </Link>
            <Link href="/certificates">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <Flame className="h-6 w-6 text-orange-500 mb-2" />
                <h3 className="font-medium mb-1">View Certificates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your achievements</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}