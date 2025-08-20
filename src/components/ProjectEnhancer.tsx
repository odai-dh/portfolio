"use client";

import { useState } from "react";
import type { Project } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { enhanceDescriptionAction } from "@/app/actions";
import { Wand2, Copy, Check } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function ProjectEnhancer({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedDescription, setEnhancedDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleEnhance = async () => {
    setIsLoading(true);
    setError(null);
    setEnhancedDescription("");
    const result = await enhanceDescriptionAction({
      title: project.title,
      description: project.description,
      tags: project.tags,
    });
    if (result.success && result.enhancedDescription) {
      setEnhancedDescription(result.enhancedDescription);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedDescription);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="mr-2 h-4 w-4" /> Enhance with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enhance Project Description</DialogTitle>
          <DialogDescription>
            Let AI craft a more compelling description for your project:{" "}
            <span className="font-semibold">{project.title}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleEnhance} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" /> {isLoading ? "Generating..." : "Generate Suggestion"}
          </Button>

          {isLoading && <Skeleton className="h-[120px] w-full rounded-md" />}

          {error && <p className="text-sm text-destructive">{error}</p>}
          
          {enhancedDescription && (
            <div className="relative">
              <Textarea
                readOnly
                value={enhancedDescription}
                className="h-[120px] pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
