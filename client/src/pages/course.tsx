import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Clock, BookOpen, Users } from "lucide-react";

export default function Course() {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/slug/${slug}`],
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-500 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested course could not be found.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map modality to slug for breadcrumb
  const modalitySlugMap: Record<string, string> = {
    "CT": "ct",
    "MRI": "mri", 
    "X-Ray": "x-ray",
    "US": "us",
    "NM": "nm"
  };

  const modalitySlug = modalitySlugMap[course.modality] || "unknown";

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
          Home
        </Link>
        <span>›</span>
        <Link href={`/modality/${modalitySlug}`} className="hover:text-gray-900 dark:hover:text-gray-100">
          {course.modality}
        </Link>
        <span>›</span>
        <span className="text-gray-900 dark:text-gray-100">{course.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/modality/${modalitySlug}`}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {course.modality}
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {course.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          {course.description}
        </p>
      </div>

      {/* Course Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {course.duration || "TBD"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {course.totalLessons || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {course.rating ? `${course.rating}/5` : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Message */}
      <Card>
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This course is currently being prepared. Check back soon for interactive lessons, 
              quizzes, and detailed learning materials.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Course content will include video lessons, interactive assessments, and practical case studies.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}