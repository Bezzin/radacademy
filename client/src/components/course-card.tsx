import { Link } from "wouter";
import { Star, Play, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    slug: string;
    description: string;
    specialty: string;
    coverImage: string;
    rating: number;
    totalLessons: number;
    duration: string;
    progress?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case "CT":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "MRI":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      case "X-Ray":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group cursor-pointer">
        <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group-hover:border-[hsl(var(--medical-blue-500))] overflow-hidden">
          <div className="relative">
            <img 
              src={course.coverImage} 
              alt={course.title}
              className="w-full h-32 object-cover"
            />
            {course.progress && course.progress > 0 && (
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs font-medium">
                {course.progress}%
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={getSpecialtyColor(course.specialty)}>
                {course.specialty}
              </Badge>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-medium">{(course.rating / 10).toFixed(1)}</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-medical-blue-600 dark:group-hover:text-medical-blue-400 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Play className="h-3 w-3 mr-1" />
                {course.totalLessons} lessons
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {course.duration}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
