import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { MessageInterface } from "../../types/Conversation";

interface MessageProps {
  className?: string;
  message: MessageInterface;
}

const Message = (props: MessageProps) => {
  if (props.message == undefined) return <></>;
  const classes =
    props.message.speaker == "AI"
      ? "bg-white/30 rounded-bl-sm"
      : "border-white/30 border rounded-br-sm";

  if (props.message.speaker == "AI")
    return (
      <div className={`${props.className} ${classes} px-3 py-2 rounded-lg`}>
        {props.message.message}
      </div>
    );
  return (
    <GrammarlyEditorPlugin
      config={{
        activation: "immediate",
      }}
      className="ml-auto"
      clientId="client_ArvMjTYZjeXHHuZdMhZHt1"
    >
      <div
        contentEditable
        suppressContentEditableWarning
        className={`${props.className} ${classes} px-3 py-2 rounded-lg`}
      >
        <span>{props.message.message}</span>
      </div>
    </GrammarlyEditorPlugin>
  );
};

export default Message;
