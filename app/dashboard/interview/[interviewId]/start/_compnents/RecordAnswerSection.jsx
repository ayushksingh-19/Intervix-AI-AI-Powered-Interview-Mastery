"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { getDb } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { GUEST_EMAIL, useOptionalUser } from "@/components/auth/AuthSupport";
import moment from "moment";

function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion,interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading,setLoading]=useState(false)
  const [hasSavedAnswer, setHasSavedAnswer] = useState(false);
  const { user } = useOptionalUser();
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  if (error) {
    toast(error);
    return;
  }

  useEffect(() => {
    const latestResult = results.at(-1);

    if (latestResult?.transcript) {
      setUserAnswer((prevAns) =>
        `${prevAns} ${latestResult.transcript}`.trim()
      );
    }
  }, [results]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer("");
      setResults([]);
      setHasSavedAnswer(false);
      startSpeechToText();
    }
  };

  useEffect(()=>{
    if (!isRecording && userAnswer.trim().length > 10 && !hasSavedAnswer) {
      setHasSavedAnswer(true);
      UpdateUserAnswerInDb();
    }
  },[hasSavedAnswer, isRecording, userAnswer])

  const UpdateUserAnswerInDb=async()=>{
    if (!mockInterViewQuestion?.[activeQuestionIndex]) {
      toast("We couldn't find the active interview question.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      toast("Add your Gemini API key to .env.local before recording answers.");
      return;
    }

    setLoading(true);

    try {
      const feedbackPrompt = `Question: ${mockInterViewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating from 1 to 10 and short feedback in JSON format only. The JSON must include the fields "rating" and "feedback".`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      const jsonFeedbackResp = JSON.parse(mockJsonResp);
      const feedback =
        jsonFeedbackResp?.feedback ?? jsonFeedbackResp?.feeback ?? "";
      const resp = await getDb().insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterViewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterViewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback,
        rating: String(jsonFeedbackResp?.rating ?? ""),
        userEmail: user?.primaryEmailAddress?.emailAddress ?? GUEST_EMAIL,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      if (resp) {
        toast("User answer recorded successfully.");
        setUserAnswer("");
        setResults([]);
      }
    } catch (error) {
      console.error(error);
      toast("Unable to save your answer. Please try recording again.");
      setHasSavedAnswer(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: "50vh",
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button  disabled={loading} variant="outline" onClick={StartStopRecording} className="my-10">
        {isRecording ? (
          <h2 className="flex items-center justify-center text-red-600 gap-2">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="flex items-center justify-center gap-2">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
