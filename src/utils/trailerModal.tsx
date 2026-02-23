import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  onHide: () => void;
  trailerUrl: string;
}

function convertToEmbed(url: string): string {
  if (!url) return "";

  // Om den redan är embed → returnera direkt
  if (url.includes("/embed/")) {
    return url.includes("autoplay")
      ? url
      : `${url}?autoplay=1`;
  }

  // youtube.com/watch?v=
  const watchMatch = url.match(/v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
  }

  // youtu.be/
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
  }

  return "";
}

export default function TrailerModal({ show, onHide, trailerUrl }: Props) {
  const [embedUrl, setEmbedUrl] = useState<string>("");

  useEffect(() => {
    if (show) {
      setEmbedUrl(convertToEmbed(trailerUrl));
    }
  }, [show, trailerUrl]);

  const handleClose = () => {
    setEmbedUrl(""); // stoppar videon
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Body className="p-0">
        {embedUrl && (
          <div className="ratio ratio-16x9">
            <iframe
              src={embedUrl}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}