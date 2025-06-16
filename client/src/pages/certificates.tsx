import { useQuery } from "@tanstack/react-query";
import { Download, Trophy, IdCard as CertificateIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Certificates() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["/api/certificates"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-500"></div>
      </div>
    );
  }

  const completedCourses = certificates || [];
  const availableCourses = courses?.filter((course: any) => 
    !completedCourses.some((cert: any) => cert.courseId === course.id)
  ) || [];

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earned Certificates */}
            {completedCourses.map((certificate: any) => (
              <div key={certificate.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gradient-to-r from-medical-blue-50 to-purple-50 dark:from-medical-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between mb-4">
                  <CertificateIcon className="h-8 w-8 text-medical-blue-600 dark:text-medical-blue-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Completed {new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  CT Fundamentals Certification
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Successfully completed 12 lessons with {certificate.quizScore}% quiz average
                </p>
                <Button 
                  size="sm"
                  className="bg-medical-blue hover:bg-medical-blue-600"
                  onClick={() => window.open(certificate.certificateUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}

            {/* Available Certificates */}
            {availableCourses.slice(0, 3).map((course: any) => (
              <div key={course.id} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {course.title} IdCard
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Complete "{course.title}" to earn your certificate
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Progress: {course.progress || 0}%
                </div>
                {(course.progress || 0) > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-medical-blue h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {completedCourses.length === 0 && availableCourses.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
              <p>Complete courses to earn your professional certificates</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
