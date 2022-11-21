import { MessageInterface } from "../../types/Conversation";
import Message from "./Message";

interface ConversationProps {
  className?: string;
  history: MessageInterface[];
}

const Conversation = (props: ConversationProps) => {
  return (
    <div
      className={`${props.className} font-space flex flex-col items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5`}
    >
      {props.history ? (
        props.history.map((message: MessageInterface) => (
          <Message key={message.message} message={message} />
        ))
      ) : (
        <div>Conversation will appear here</div>
      )}
    </div>
  );
};

export default Conversation;
