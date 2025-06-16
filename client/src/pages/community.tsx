import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DiscussionThread } from "@/components/discussion-thread";
import { apiRequest } from "@/lib/queryClient";

export default function Community() {
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });
  const queryClient = useQueryClient();

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["/api/courses/1/discussions"], // Using course ID 1 for demo
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (discussion: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/discussions", {
        ...discussion,
        courseId: 1, // Using course ID 1 for demo
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses/1/discussions"] });
      setNewDiscussion({ title: "", content: "" });
    },
  });

  const handleCreateDiscussion = () => {
    if (newDiscussion.title.trim() && newDiscussion.content.trim()) {
      createDiscussionMutation.mutate(newDiscussion);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Community Discussion</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-medical-blue hover:bg-medical-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="What would you like to discuss?"
                      value={newDiscussion.title}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, questions, or insights..."
                      className="min-h-[120px]"
                      value={newDiscussion.content}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      onClick={handleCreateDiscussion}
                      disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim() || createDiscussionMutation.isPending}
                      className="bg-medical-blue hover:bg-medical-blue-600"
                    >
                      {createDiscussionMutation.isPending ? "Creating..." : "Create Discussion"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {discussions?.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No discussions yet. Start the conversation!</p>
                </div>
              ) : (
                discussions?.map((discussion: any) => (
                  <DiscussionThread key={discussion.id} discussion={discussion} />
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
