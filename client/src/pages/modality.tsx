import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Magnet, Radiation, Waves, Atom, BookOpen, ChevronLeft } from "lucide-react";
import { CourseCard } from "@/components/course-card";

type ModalitySlug = "ct" | "mri" | "x-ray" | "us" | "nm";

const modalityMap: Record<ModalitySlug, { id: string; name: string; description: string }> = {
  "ct": { id: "CT", name: "CT Scan", description: "Computed Tomography imaging" },
  "mri": { id: "MRI", name: "MRI", description: "Magnetic Resonance Imaging" },
  "x-ray": { id: "X-Ray", name: "X-Ray", description: "Radiographic imaging" },
  "us": { id: "US", name: "Ultrasound", description: "Ultrasound imaging" },
  "nm": { id: "NM", name: "Nuclear Medicine", description: "Nuclear medicine imaging" }
};

export default function Modality() {
  const { slug } = useParams<{ slug: ModalitySlug }>();
  
  const modalityInfo = modalityMap[slug as ModalitySlug];
  
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses", modalityInfo?.id],
    queryFn: async () => {
      if (!modalityInfo?.id) return [];
      const params = new URLSearchParams();
      params.append("modality", modalityInfo.id);
      const response = await fetch(`/api/courses?${params}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
    enabled: !!modalityInfo
  });

  if (!modalityInfo) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Modality Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested imaging modality could not be found.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
          Home
        </Link>
        <span>›</span>
        <span className="text-gray-900 dark:text-gray-100">{modalityInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {modalityInfo.name} Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {modalityInfo.description} courses and educational content
        </p>
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Available Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Courses Coming Soon</h3>
              <p>We're working on adding {modalityInfo.name.toLowerCase()} courses to our catalog.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}