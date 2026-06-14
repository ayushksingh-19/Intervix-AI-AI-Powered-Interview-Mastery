"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { getDb } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { GUEST_EMAIL, useOptionalUser } from "@/components/auth/AuthSupport";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useOptionalUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      toast("Add your Gemini API key to .env.local before generating interviews.");
      return;
    }

    setLoading(true);

    try {
      const inputPrompt = `Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION} interview questions and answers in JSON format based on the following: Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Only return the JSON, without any additional text.`;
      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const parsedResponse = JSON.parse(mockJsonResp);

      if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
        throw new Error("The AI response did not include any interview questions.");
      }

      const resp = await getDb()
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedResponse),
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress ?? GUEST_EMAIL,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (!resp?.[0]?.mockId) {
        throw new Error("The interview could not be saved.");
      }

      setOpenDialog(false);
      router.push(`/dashboard/interview/${resp[0].mockId}`);
    } catch (error) {
      console.error(error);
      toast(error.message || "Unable to create the interview right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all delay-100"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add new</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  {/* <h2>Tell us more about your job interviewing</h2> */}
                  <h2>
                    Add Details about your job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      onChange={(event) => setJobPosition(event.target.value)}
                      placeholder="Ex. Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      onChange={(event) => setJobDesc(event.target.value)}
                      placeholder="Ex. React, Angular, NodeJs, NextJs etc."
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Years of experience</label>
                    <Input
                      onChange={(event) => setJobExperience(event.target.value)}
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
