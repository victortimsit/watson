import { useEffect, useRef, useState } from "react";
import StartButton from "./components/StartButton";

const OPEN_AI_TOKEN = "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";
const initialMessage = { speaker: "Human", message: "Play to start talking" };
const initialConversationHistory = [
  "Human: Hello, who are you?",
  "AI: I am Watson. How can I help you today?",
];

export default function Home() {
  const SpeechRecognition = useRef<any>(null);
  const SpeechGrammarList = useRef<any>(null);
  const SpeechRecognitionEvent = useRef<any>(null);
  const SpeechSynthesis = useRef<any>(null);
  const recognition = useRef<any>(null);
  const speechRecognitionList = useRef<any>(null);
  const syntesis = useRef<any>(null);

  const [talking, setTalking] = useState(false);
  // const started = useRef(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ speaker: string; message: string }>
  >([initialMessage]);
  const conversationHistory = useRef<Array<string>>(initialConversationHistory);
  const [result, setResult] = useState("");

  const startSpeechToText = () => {
    console.log("Start");
    setStarted(true);

    recognition.current = new SpeechRecognition.current();
    speechRecognitionList.current = new SpeechGrammarList.current();

    recognition.current.start();

    recognition.current.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      console.log(text);

      setResult(text);
      handleAnswer(text);
    };
    recognition.current.onspeechstart = () => {
      setTalking(true);
    };

    recognition.current.onspeechend = stopSpeechToText;
  };

  const stopSpeechToText = () => {
    setTalking(false);
    recognition.current.stop();
  };

  const startTextToSpeech = (message: string) => {
    setTalking(true);
    const utterThis = new SpeechSynthesisUtterance(message);
    syntesis.current = SpeechSynthesis.current;

    syntesis.current.speak(utterThis);

    utterThis.onend = () => {
      console.log("END");
      stopTextToSpeech();
      startSpeechToText();
    };
  };

  const stopTextToSpeech = () => {
    setTalking(false);
    if (syntesis.current) syntesis.current.cancel();
  };

  const start = () => {
    handleAnswer("Ask me a question to start the conversation");
  };

  const restart = () => {
    console.log("restart");
    stopSpeechToText();
    stopTextToSpeech();

    conversationHistory.current = initialConversationHistory;
    setMessages([initialMessage]);
    setStarted(false);
  };

  const handleAnswer = async (message: string) => {
    const humanMessage = `Human: ${message}`;
    setMessages((m) => [...m, { speaker: "Human", message }]);
    const res = await getGPT3Answer(message);
    const answer: string = res.choices[0].text;
    // const answer = "Hello";
    const AIAnswer = `AI: ${answer}`;
    if (conversationHistory.current.length > 8)
      conversationHistory.current.splice(0, 2);
    conversationHistory.current.push(humanMessage, AIAnswer);

    setMessages((m) => [...m, { speaker: "AI", message: answer }]);

    startTextToSpeech(answer);
  };

  const getGPT3Answer = async (message: string) => {
    console.log("HISTORY ", conversationHistory);

    return await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI_TOKEN}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt: `The following is a conversation with an AI assistant that help to practice English. The assistant uses open questions and keep the conversation going. The assistant don't talks about the same subject more than twice. \n${conversationHistory.current.join(
          "\n"
        )}\nHuman:${message}\n\nAI:`,
        temperature: 1,
        max_tokens: 100,
        presence_penalty: 2,
        frequency_penalty: 2,
      }),
    }).then((r) => r.json());
  };

  const initState = () => {
    SpeechRecognition.current =
      //@ts-ignore
      window.SpeechRecognition || webkitSpeechRecognition;
    SpeechGrammarList.current =
      //@ts-ignore
      window.SpeechGrammarList || webkitSpeechGrammarList;
    SpeechRecognitionEvent.current =
      //@ts-ignore
      window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    //@ts-ignore
    SpeechSynthesis.current = window.speechSynthesis;
  };
  useEffect(() => {
    initState();
    // startSpeechToText();
    // window.addEventListener("click", startSpeechToText);

    // return () => window.removeEventListener("click", startSpeechToText);
  }, []);

  return (
    <div>
      <div
        className={`w-[300px] h-[300px] animate-pulse bg-gradient-to-tr from-pink-400 to-blue-400 absolute blur-[200px] opacity-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all pointer-events-none ${
          talking ? "play" : "pause"
        }`}
      />

      <main
        className={`flex flex-col items-center justify-center h-screen px-8 ${
          messages[messages.length - 1].speaker == "Human" ? "opacity-50" : ""
        }`}
      >
        <div className="flex gap-2 items-center">
          <div
            className={`transition-all animate-breave animation-delay-100 w-0.5 h-5 rounded-full bg-white ${
              talking ? "scale-y-1 play" : "scale-y-[.1] pause"
            }`}
          />
          <div
            className={`transition-all animate-breave animation-delay-200 w-0.5 h-10 rounded-full bg-white ${
              talking ? "scale-y-1 play" : "scale-y-[.05] pause"
            }`}
          />
          <div
            className={`transition-all animate-breave animation-delay-300 w-0.5 h-5 rounded-full bg-white ${
              talking ? "scale-y-1 play" : "scale-y-[.1] pause"
            }`}
          />
        </div>
        <span
          className={`font-space mt-4 ${
            messages[messages.length - 1].speaker == "Human"
              ? "text-opacity-50"
              : ""
          }`}
        >
          {messages[messages.length - 1].message}
        </span>
        <StartButton
          className="mt-8"
          started={started}
          onStart={start}
          onRestart={restart}
        />
      </main>
    </div>
  );
}
