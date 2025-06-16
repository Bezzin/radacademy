import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Brain, Radiation, Magnet, Bookmark, Clock, Download, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export function Sidebar() {
  const { data: enrollments } = useQuery({
    queryKey: ["/api/enrollments"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const getIcon = (specialty: string) => {
    switch (specialty) {
      case "CT":
        return <Brain className="h-4 w-4" />;
      case "X-Ray":
        return <Radiation className="h-4 w-4" />;
      case "MRI":
        return <Magnet className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <aside className="w-64 bg-card shadow-sm border-r border-border min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            My Learning
          </h3>
          <div className="space-y-2">
            {courses?.slice(0, 3).map((course: any) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <div className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  course.progress > 0
                    ? "bg-medical-blue-50 dark:bg-medical-blue-900 border-[hsl(var(--medical-blue-500))]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border-border"
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={course.progress > 0 ? "text-medical-blue-600 dark:text-medical-blue-400" : "text-gray-400"}>
                      {getIcon(course.specialty)}
                    </div>
                    <span className="text-sm font-medium truncate">{course.title}</span>
                  </div>
                  <div className={`text-xs font-medium ${
                    course.progress > 0
                      ? "text-medical-blue-600 dark:text-medical-blue-400"
                      : "text-gray-500"
                  }`}>
                    {course.progress || 0}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <a href="#" className="flex items-center space-x-3 p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <Bookmark className="h-4 w-4 text-gray-400" />
              <span>Bookmarks</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Recent</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <Download className="h-4 w-4 text-gray-400" />
              <span>Downloads</span>
            </a>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-[hsl(var(--medical-blue-500))] to-[hsl(var(--medical-blue-600))] text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Premium Plan</span>
              <Crown className="h-4 w-4 text-yellow-300" />
            </div>
            <p className="text-xs opacity-90 mb-3">Unlimited access to all courses</p>
            <div className="text-xs opacity-75">Renews Jan 15, 2024</div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
