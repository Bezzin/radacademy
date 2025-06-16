import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Magnet, Radiation, Waves, Atom, BookOpen } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { CourseInfoDialog } from "@/components/course-info-dialog";

export default function Courses() {
  const [location] = useLocation();
  const [selectedModality, setSelectedModality] = useState<string | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Extract modality from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const modalityParam = params.get('modality');
    if (modalityParam) {
      setSelectedModality(modalityParam);
    }
  }, [location]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses", selectedModality],
    queryFn: () => fetch(`/api/courses${selectedModality ? `?modality=${selectedModality}` : ''}`).then(res => res.json()),
  });

  const { data: modalityInfo = [] } = useQuery({
    queryKey: ["/api/modalities/info"],
  });

  const getModalityIcon = (icon: string) => {
    switch (icon) {
      case "brain":
        return <Brain className="h-4 w-4" />;
      case "magnet":
        return <Magnet className="h-4 w-4" />;
      case "radiation":
        return <Radiation className="h-4 w-4" />;
      case "waves":
        return <Waves className="h-4 w-4" />;
      case "atom":
        return <Atom className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleCourseInfo = (course: any) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Course Catalog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our comprehensive radiology education courses
        </p>
      </div>

      {/* Course Catalog */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Available Courses</CardTitle>
            <div className="flex space-x-2 flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedModality === undefined ? "default" : "outline"}
                onClick={() => setSelectedModality(undefined)}
                className={selectedModality === undefined ? "bg-medical-blue text-white" : ""}
              >
                All Modalities
              </Button>
              {modalityInfo.map((modality: any) => (
                <Button
                  key={modality.id}
                  size="sm"
                  variant={selectedModality === modality.id ? "default" : "outline"}
                  onClick={() => setSelectedModality(modality.id)}
                  className={`flex items-center gap-2 ${selectedModality === modality.id ? "bg-medical-blue text-white" : ""}`}
                >
                  {getModalityIcon(modality.icon)}
                  {modality.name}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course: any) => (
                <div key={course.id} onClick={() => handleCourseInfo(course)}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}

          {courses?.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No courses found for the selected modality.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Info Dialog */}
      <CourseInfoDialog
        course={selectedCourse}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}