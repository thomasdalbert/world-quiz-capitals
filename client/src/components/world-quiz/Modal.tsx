import '@components/world-quiz/Modal.css';

export const Modal: React.FC<{
  title?: string;
  content?: string;
}> = ({title, content}) => {
  return (
    <div role='dialog' className="modal">
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};
