/* eslint-disable react/prop-types */
export function Tile({ content: Content, flip, state, color }) {
  switch (state) {
    case "start":
      return (
        <Back
          className={`inline-block h-12 w-12 ${
            color ? color : "bg-indigo-300"
          } text-center rounded-md cursor-pointer text-transparent`}
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block h-12 w-12 animate-rotate-y animate-once transition-all">
          <Content
            style={{
              display: "inline-block",
              width: "3rem",
              height: "3rem",
              verticalAlign: "top",
            }}
            className={`text-white p-[6px] bg-indigo-500 rounded-md`}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block h-12 w-12 transition-all">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
            className="text-indigo-200"
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return (
    <div onClick={flip} className={className}>
      ?
    </div>
  );
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
