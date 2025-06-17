// src/components/ui/Dialog.jsx
import React from "react";

export const Dialog = ({ children, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>

      <style jsx>{`
        .dialog-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .dialog-content {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export const DialogHeader = ({ children }) => (
  <div className="dialog-header">
    {children}
    <style jsx>{`
      .dialog-header {
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
      }
    `}</style>
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="dialog-title">
    {children}
    <style jsx>{`
      .dialog-title {
        margin: 0;
      }
    `}</style>
  </h2>
);
