import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookOpen, CheckCircle, Flame, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseCard } from "@/components/course-card";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
  });

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
              {stats?.coursesInProgress || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average progress: {stats?.averageProgress || 0}%
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
              {stats?.completedLessons || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This month: +{Math.floor((stats?.completedLessons || 0) / 3)}
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
              {stats?.studyStreak || 0}
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

      {/* Course Catalog */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Explore Courses</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-medical-blue text-white">All</Button>
              <Button size="sm" variant="outline">CT</Button>
              <Button size="sm" variant="outline">MRI</Button>
              <Button size="sm" variant="outline">X-Ray</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
