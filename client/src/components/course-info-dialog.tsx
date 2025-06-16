import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy } from "lucide-react";

interface CourseInfoDialogProps {
  course: {
    id: number;
    title: string;
    description: string;
    modality: string;
    duration: string | null;
    totalLessons: number;
    rating: number | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseInfoDialog({ course, open, onOpenChange }: CourseInfoDialogProps) {
  if (!course) return null;

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case "CT":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "MRI":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      case "X-Ray":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "US":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "NM":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  const isComingSoon = course.totalLessons === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {course.title}
            <Badge className={getModalityColor(course.modality)}>
              {course.modality}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
            </div>
            <p className="text-lg font-semibold">
              {isComingSoon ? (
                <span className="text-orange-600 dark:text-orange-400">Coming Soon</span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">Not Attempted</span>
              )}
            </p>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                <p className="font-medium">{course.duration || "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lessons</p>
                <p className="font-medium">{course.totalLessons} lessons</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Course Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Prerequisites */}
          {!isComingSoon && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Basic understanding of medical imaging principles and anatomy.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}