import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, MessageCircle, Reply } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface DiscussionThreadProps {
  discussion: {
    id: number;
    courseId: number;
    title: string;
    content: string;
    upvotes: number;
    createdAt: string;
    author: {
      name: string;
      avatarUrl?: string;
    };
    replies?: Array<{
      id: number;
      content: string;
      upvotes: number;
      createdAt: string;
      author: {
        name: string;
        avatarUrl?: string;
      };
    }>;
  };
}

export function DiscussionThread({ discussion }: DiscussionThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/discussions", {
        courseId: discussion.courseId,
        title: "Reply",
        content,
        parentId: discussion.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${discussion.courseId}/discussions`] });
      setReplyContent("");
      setShowReplyForm(false);
    },
  });

  const handleReply = () => {
    if (replyContent.trim()) {
      replyMutation.mutate(replyContent);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getSpecialty = () => {
    // Mock specialty based on course content
    if (discussion.content.includes("CT") || discussion.title.includes("CT")) return "CT";
    if (discussion.content.includes("MRI") || discussion.title.includes("MRI")) return "MRI";
    if (discussion.content.includes("X-ray") || discussion.title.includes("X-ray")) return "X-Ray";
    return "General";
  };

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const specialty = getSpecialty();

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium text-sm">
              {getInitials(discussion.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {discussion.author.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(discussion.createdAt)}
              </span>
              <Badge className={getSpecialtyColor(specialty)}>
                {specialty}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {discussion.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {discussion.content}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 hover:text-medical-blue-600 dark:hover:text-medical-blue-400 p-0 h-auto"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{discussion.upvotes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 hover:text-medical-blue-600 dark:hover:text-medical-blue-400 p-0 h-auto"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{discussion.replies?.length || 0} replies</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="hover:text-medical-blue-600 dark:hover:text-medical-blue-400 p-0 h-auto"
              >
                Reply
              </Button>
            </div>

            {/* Replies */}
            {discussion.replies && discussion.replies.length > 0 && (
              <div className="ml-6 mt-4 space-y-4 border-l border-gray-200 dark:border-gray-700 pl-4">
                {discussion.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs">
                        {getInitials(reply.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{reply.author.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {reply.content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 hover:text-medical-blue-600 dark:hover:text-medical-blue-400 p-0 h-auto text-xs"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.upvotes}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplyForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim() || replyMutation.isPending}
                    className="bg-medical-blue hover:bg-medical-blue-600"
                  >
                    {replyMutation.isPending ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
