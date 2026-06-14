"use client";
import { Button } from "@/components/ui/button";
import { getDb } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    GetInterviewDetail();
  }, []);

  /**
   * Used to Get Interview Details by MockId/Interview Id
   */

  const GetInterviewDetail = async () => {
    try {
      const result = await getDb()
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (!result?.[0]) {
        throw new Error("Interview details were not found.");
      }

      setInterviewData(result[0]);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load this interview right now.");
    }
  };

  if (error) {
    return (
      <div className="my-10 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div  className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="flex flex-col my-5 gap-5">
        <div className="flex flex-col p-5 rounded-lg border gap-5">
        <h2>
          <strong>Job Role/Job Position:</strong> {interviewData?.jobPosition}{" "}
        </h2>
        <h2>
          <strong>Job Description/Job Description:</strong>{" "}
          {interviewData?.jobDesc}{" "}
        </h2>
        <h2>
          <strong>Years of Experince:</strong> {interviewData?.jobExperience}{" "}
        </h2>
        </div>
        <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100 ">
          <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/> <strong>Information</strong> </h2>
          <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>
      </div>
      <div>
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            style={{ height: 300, width: 300 }}
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
          />
        ) : (
          <>
            <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
            <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>
              Enable Web Cam and Microphone
            </Button>
          </>
        )}
      </div>
      </div>

      <div className="flex justify-end items-end">

      <Link href={`/dashboard/interview/${params.interviewId}/start`}>
     <Button >Start Interview</Button>
      
      </Link>
      </div>
      
    </div>
  );
}

export default Interview;
