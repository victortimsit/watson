interface SuggestionsProps {
  className?: string;
  suggestions: string[];
}

const Suggestions = (props: SuggestionsProps) => {
  return (
    <div
      className={`${props.className} font-space flex flex-col items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5`}
    >
      <h2 className="text-lg font-semibold mb-4">Answer suggestions:</h2>
      {props.suggestions.length == 0 ? (
        <div>Some suggestions will appear here</div>
      ) : (
        props.suggestions.map((suggestion) => (
          <div
            className="border-white/30 border rounded-br-sm px-3 py-2 rounded-lg"
            key={suggestion}
          >
            {suggestion}
          </div>
        ))
      )}
    </div>
  );
};

export default Suggestions;
