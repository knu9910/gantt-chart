"use client";

import { useState } from "react";
import { useTasks } from "../_hooks/use-tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateTaskForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    progress: 0,
  });

  const { createTask, refetch } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
    });
    refetch();
    setFormData({
      name: "",
      start: "",
      end: "",
      progress: 0,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8">새 작업 추가</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 작업 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">작업 이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start">시작일</Label>
            <Input
              id="start"
              type="date"
              value={formData.start}
              onChange={(e) =>
                setFormData({ ...formData, start: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">종료일</Label>
            <Input
              id="end"
              type="date"
              value={formData.end}
              onChange={(e) =>
                setFormData({ ...formData, end: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress">진행률 (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) =>
                setFormData({ ...formData, progress: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
            <Button type="submit">추가</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
