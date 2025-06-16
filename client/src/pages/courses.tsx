import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";

export default function Courses() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(undefined);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses", selectedSpecialty],
    queryFn: () => fetch(`/api/courses${selectedSpecialty ? `?specialty=${selectedSpecialty}` : ''}`).then(res => res.json()),
  });

  const specialties = [
    { key: undefined, label: "All" },
    { key: "CT", label: "CT" },
    { key: "MRI", label: "MRI" },
    { key: "X-Ray", label: "X-Ray" },
  ];

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
            <div className="flex space-x-2">
              {specialties.map((specialty) => (
                <Button
                  key={specialty.key || "all"}
                  size="sm"
                  variant={selectedSpecialty === specialty.key ? "default" : "outline"}
                  onClick={() => setSelectedSpecialty(specialty.key)}
                  className={selectedSpecialty === specialty.key ? "bg-medical-blue text-white" : ""}
                >
                  {specialty.label}
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
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {courses?.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No courses found for the selected specialty.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}