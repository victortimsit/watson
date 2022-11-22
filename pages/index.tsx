import { useEffect, useRef, useState } from "react";
import { MessageInterface } from "../types/Conversation";
import Conversation from "./components/Conversation";
import StartButton from "./components/StartButton";
import Suggestions from "./components/Suggestions";

const initialMessage = { speaker: "UI", message: "Play to start talking" };
const wakingUpMessage = "Start the conversation by asking me a question!";
const initialConversationHistory = [
  { speaker: "Human", message: "Hello, who are you?" },
  { speaker: "AI", message: "I am Watson. How can I help you today?" },
];

export default function Home() {
  const SpeechRecognition = useRef<any>(null);
  // const SpeechGrammarList = useRef<any>(null);
  const SpeechRecognitionEvent = useRef<any>(null);
  const SpeechSynthesis = useRef<any>(null);
  const recognition = useRef<any>(null);
  const speechRecognitionList = useRef<any>(null);
  const syntesis = useRef<any>(null);

  const [talking, setTalking] = useState(false);
  const [started, setStarted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState<
    { speaker: string; message: string }[]
  >([initialMessage]);
  const conversationHistory = useRef<MessageInterface[]>(
    initialConversationHistory
  );

  const startSpeechToText = () => {
    let result: string;
    console.log("Start");
    setStarted(true);

    recognition.current.start();

    recognition.current.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      result = text;
      recognition.current.stop();

      handleAnswer(text);
    };
    recognition.current.onspeechstart = () => {
      console.log("start");
      setTalking(true);
    };

    recognition.current.onspeechend = async () => {
      recognition.current.stop();
      console.log("speech end");
      setTalking(false);
    };

    recognition.current.onend = async () => {
      console.log("end");
      if (!result) recognition.current.start();
    };
  };

  const stopSpeechToText = () => {
    setTalking(false);
    console.log("Stop");
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
  };

  const start = () => {
    handleAnswer(wakingUpMessage);
  };

  const restart = () => {
    window.location.reload();
    // conversationHistory.current = initialConversationHistory;

    // stopSpeechToText();
    // stopTextToSpeech();

    // console.log(conversationHistory.current);
    // setMessages([initialMessage]);
    // setStarted(false);
  };

  const cleanGPT3Response = (res: any) =>
    res.choices[0].text.replaceAll("\n", "").trim();

  const handleAnswer = async (message: string) => {
    const humanMessage = `Human: ${message}`;
    setMessages((m) => [...m, { speaker: "Human", message }]);
    const res = await getGPT3Answer(message);
    const answer: string = cleanGPT3Response(res);

    // const answer = "Hello my friend! How can I help you?";
    const AIAnswer = `AI: ${answer}`;
    if (conversationHistory.current.length > 8)
      conversationHistory.current.splice(0, 2);
    conversationHistory.current.push(
      { speaker: "Human", message },
      { speaker: "AI", message: answer }
    );

    setMessages((m) => [...m, { speaker: "AI", message: answer }]);

    startTextToSpeech(answer);
    try {
      let _suggestions = await getGPT3Suggestions(answer);
      console.log("SUGGESTION ", _suggestions);
      _suggestions = cleanGPT3Response(_suggestions);

      console.log("ARRAY ", _suggestions);

      setSuggestions(JSON.parse(_suggestions));
    } catch (error) {
      console.log(error);
      setSuggestions([]);
    }
  };

  const getGPT3Answer = async (message: string) => {
    // @ts-ignore
    window.splitbee.track("gpt3-anwser");
    const prompt = `The following is a conversation with an AI assistant that help to practice English. The assistant often changes the topic of conversation.\n\n${conversationHistory.current
      .map((message) => `${message.speaker}: ${message.message}`)
      .join("\n")}\nHuman: ${message}\nAI:`;
    console.log(prompt);

    return await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_TOKEN}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt,
        temperature: 1,
        max_tokens: 100,
        presence_penalty: 2,
        frequency_penalty: 2,
      }),
    }).then((r) => r.json());
  };

  const getGPT3Suggestions = async (message: string) => {
    const prompt = `Suggest some answers in plain English to this message: "${message}".\nReturn a Javascript array with double quotes.\n\n
    Example: ["Answer 1", "Answer 2", "Answer 3"]\n\nJavascript array:`;

    return await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_TOKEN}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt,
        temperature: 0.7,
        max_tokens: 100,
        presence_penalty: 0,
        frequency_penalty: 0,
      }),
    }).then((r) => r.json());
  };

  const initState = () => {
    SpeechRecognition.current =
      //@ts-ignore
      window.SpeechRecognition || webkitSpeechRecognition;
    // SpeechGrammarList.current =
    //   //@ts-ignore
    //   window.SpeechGrammarList || webkitSpeechGrammarList;
    SpeechRecognitionEvent.current =
      //@ts-ignore
      window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    //@ts-ignore
    SpeechSynthesis.current = window.speechSynthesis;

    // speechRecognitionList.current = new SpeechGrammarList.current();
    recognition.current = new SpeechRecognition.current();
    console.log("SET recognition.current ");
  };
  useEffect(() => {
    initState();
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
          {messages[messages.length - 1].message == wakingUpMessage
            ? "Waking up Watson..."
            : messages[messages.length - 1].message}
        </span>
        <StartButton
          className="mt-8"
          started={started}
          onStart={start}
          onRestart={restart}
        />
      </main>
      <div className="absolute top-0 w-full p-4 flex justify-between items-stretch md:items-start gap-4 flex-col md:flex-row">
        <Conversation
          className="md:w-96 overflow-y-scroll"
          history={conversationHistory.current}
        />
        <Suggestions
          className="md:w-96  overflow-y-scroll"
          suggestions={suggestions}
        />
      </div>
    </div>
  );
}
