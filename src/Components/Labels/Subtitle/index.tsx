const Subtitle: React.FC<{ text?: string }> = ({ text }) => (
  <h2 className="text-lg underline lg:text-xl">{text}</h2>
);

export default Subtitle;
