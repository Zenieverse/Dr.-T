import React, { useState, useEffect } from 'react';
import { NormalizedDocument } from '../../types/readit';
import { QuarantineStorageManager } from '../../engine/readit/storage/quarantineStorage';
import { ReadItHomeView } from './views/ReadItHomeView';
import { ReadItReaderView } from './views/ReadItReaderView';
import { UploadQuarantineModal } from './components/UploadQuarantineModal';
import { UrlReaderModal } from './components/UrlReaderModal';
import { SecurityTestBenchModal } from './components/SecurityTestBenchModal';
import { SecurityAuditModal } from './components/SecurityAuditModal';

export const DrTReadItApp: React.FC = () => {
  const [documents, setDocuments] = useState<NormalizedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<NormalizedDocument | null>(null);
  
  // Top modals
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
  const [initialModalUrl, setInitialModalUrl] = useState<string>('');
  const [showTestBenchModal, setShowTestBenchModal] = useState<boolean>(false);
  const [auditDoc, setAuditDoc] = useState<NormalizedDocument | null>(null);

  const storage = QuarantineStorageManager.getInstance();

  const refreshDocuments = () => {
    setDocuments(storage.getDocuments());
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleOpenDocument = (doc: NormalizedDocument) => {
    if (doc.securityStatus === 'READY') {
      setSelectedDocument(doc);
    } else {
      setAuditDoc(doc);
    }
  };

  const handleDeleteDocument = (id: string) => {
    storage.deleteDocument(id);
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
    refreshDocuments();
  };

  const handleResetPresets = () => {
    if (window.confirm('Reset document library to initial clinical and security presets?')) {
      storage.resetToPresets();
      refreshDocuments();
    }
  };

  const handleDocumentSuccess = (newDoc: NormalizedDocument) => {
    refreshDocuments();
    if (newDoc.securityStatus === 'READY') {
      setSelectedDocument(newDoc);
    }
  };

  const handleOpenUrlModal = (initialUrl?: string) => {
    setInitialModalUrl(initialUrl || '');
    setShowUrlModal(true);
  };

  const handleQuickSubmitUrl = (url: string) => {
    setInitialModalUrl(url);
    setShowUrlModal(true);
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col">
      
      {selectedDocument ? (
        <ReadItReaderView
          document={selectedDocument}
          onBackToLibrary={() => setSelectedDocument(null)}
          onDeleteDocument={handleDeleteDocument}
        />
      ) : (
        <ReadItHomeView
          documents={documents}
          onOpenDocument={handleOpenDocument}
          onOpenUploadModal={() => setShowUploadModal(true)}
          onOpenUrlModal={handleOpenUrlModal}
          onOpenTestBench={() => setShowTestBenchModal(true)}
          onOpenAuditModal={(doc) => setAuditDoc(doc)}
          onDeleteDocument={handleDeleteDocument}
          onResetPresets={handleResetPresets}
          onQuickUploadFile={() => setShowUploadModal(true)}
          onQuickSubmitUrl={handleQuickSubmitUrl}
        />
      )}

      {/* Global Modals */}
      <UploadQuarantineModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDocumentReady={handleDocumentSuccess}
      />

      <UrlReaderModal
        isOpen={showUrlModal}
        initialUrl={initialModalUrl}
        onClose={() => setShowUrlModal(false)}
        onDocumentReady={handleDocumentSuccess}
      />

      <SecurityTestBenchModal
        isOpen={showTestBenchModal}
        onClose={() => setShowTestBenchModal(false)}
      />

      {auditDoc && (
        <SecurityAuditModal
          isOpen={!!auditDoc}
          onClose={() => setAuditDoc(null)}
          document={auditDoc}
          onDeleteDocument={handleDeleteDocument}
        />
      )}

    </div>
  );
};
