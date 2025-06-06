import React, { useState, useEffect, useRef } from "react";
import styles from "./SharedContent.module.css";
import { contentApi } from "../../api";

type SharedContentItem = {
  id: string;
  title: string;
  date: string;
  contentType: string;
  subject?: string;
  content?: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    imageUrl?: string;
  };
};

const SharedContentModal: React.FC<{
  item: SharedContentItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    // Get current user ID from localStorage when component mounts
    const uid = localStorage.getItem("userId") || "";
    setCurrentUserId(uid);
  }, []);

  // Check if the content belongs to the current user
  const isOwnContent = currentUserId && item?.user._id === currentUserId;

  useEffect(() => {
    if (item?.content && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(item.content);
        doc.close();
      }
    }
  }, [item]);

  const handleConfirmSave = async () => {
    if (isOwnContent) return; // Just in case as we'll disable the button

    await contentApi.createContent({
      userId: currentUserId,
      content: item?.content,
      title: titleInput,
      contentType: item?.contentType,
      copyContent: true,
    });

    setIsSaveModalOpen(false);
    onClose();
  };

  if (!item) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3>{item.title}</h3>
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            {item.content ? (
              <iframe
                ref={iframeRef}
                className={styles.contentIframe}
                title={item.title}
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <p>No content available for this item.</p>
            )}
          </div>
          <div className={styles.modalFooter}>
            <span className={styles.itemMeta}>
              {item.contentType} • {item.date}
            </span>
            <div className={styles.userInfo}>
              {item.user.imageUrl && <img src={item.user.imageUrl} alt="User" className={styles.userImage} />}
              <span className={styles.username}>{item.user.fullName}</span>
            </div>
            <div>
              {!isOwnContent && (
                <button className={styles.saveModalBtn} onClick={() => setIsSaveModalOpen(true)}>
                  Save
                </button>
              )}
              <button className={styles.closeModalBtn} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal with Inputs */}
      {isSaveModalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setIsSaveModalOpen(false)}>
          <div className={styles.modalContentSubject}>
            <h2>Save This Content</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Title</label>
              <input id="title" type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.saveButton}
                onClick={handleConfirmSave}
                disabled={isOwnContent} // Disable if it's their own content
              >
                Confirm Save
              </button>
              <button className={styles.cancelButton} onClick={() => setIsSaveModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SharedContentModal;
