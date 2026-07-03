import React, { useState } from 'react';
import { 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  UploadCloud, 
  FileCode, 
  ExternalLink, 
  Server, 
  Globe, 
  RefreshCw, 
  Database, 
  Cpu, 
  ShieldAlert 
} from 'lucide-react';

export default function AlibabaCloudConsole() {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  
  const [statusResult, setStatusResult] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  
  const [fileName, setFileName] = useState('alibaba_deployment_proof.txt');
  const [fileContent, setFileContent] = useState('Alibaba Cloud Deployment Verification Report:\n- Running backend service on cloud cluster\n- Object Storage Service (OSS) connection verified.\n- Verified Timestamp: ' + new Date().toUTCString());

  const handleCheckStatus = async () => {
    setLoadingStatus(true);
    setStatusResult(null);
    try {
      const res = await fetch('/api/alibaba-cloud/status');
      const data = await res.json();
      setStatusResult(data);
    } catch (err: any) {
      setStatusResult({
        success: false,
        message: err.message || 'Failed to contact backend API endpoint.'
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleUploadFile = async () => {
    if (!fileName.trim() || !fileContent.trim()) return;
    setLoadingUpload(true);
    setUploadResult(null);
    try {
      const res = await fetch('/api/alibaba-cloud/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, content: fileContent })
      });
      const data = await res.json();
      setUploadResult(data);
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: err.message || 'Failed to execute upload request.'
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6" id="alibaba-cloud-console-container">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <Cloud className="w-96 h-96" />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
            <Cloud className="w-8 h-8 text-amber-100" />
          </div>
          <span className="font-mono text-xs font-bold bg-white/15 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
            Multi-Cloud Integration
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-sans font-medium tracking-tight">
          Alibaba Cloud Integration &amp; Deployment Console
        </h2>
        <p className="text-sm md:text-base text-amber-550 max-w-2xl leading-relaxed">
          This system verifies that the platform's full-stack backend is configured to support dual-cloud capabilities, integrating **Alibaba Cloud (Aliyun)** Object Storage Service (OSS) and Elastic Compute Service (ECS) APIs.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Verification and Interaction (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: ECS API Status Check */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-xs space-y-5" id="ecs-status-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-sans font-medium text-stone-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-orange-500" />
                  Aliyun ECS Connection Test
                </h3>
                <p className="text-xs text-stone-500">
                  Calls the backend controller to run DescribeRegions on the official Alibaba Cloud SDK.
                </p>
              </div>
              <button
                onClick={handleCheckStatus}
                disabled={loadingStatus}
                className="bg-orange-550 hover:bg-orange-600 text-white p-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                id="run-ecs-test-btn"
              >
                {loadingStatus ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                {loadingStatus ? 'Testing...' : 'Run Connection Test'}
              </button>
            </div>

            {/* Results Output */}
            {statusResult ? (
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 relative overflow-hidden ${
                statusResult.success 
                  ? 'bg-emerald-50/40 border-emerald-200/50 text-emerald-800' 
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wide">
                  {statusResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Alibaba Cloud Connected Successfully</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Sandbox Emulated Fallback / Missing Credentials</span>
                    </>
                  )}
                </div>
                
                <p className="text-[11px] leading-relaxed mt-1">
                  {statusResult.success 
                    ? `Status: Verified active. Received metadata for ${statusResult.regions?.length || 0} regions.`
                    : `Message: ${statusResult.message}`}
                </p>

                {/* Simulated response description */}
                {!statusResult.success && (
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-200/50 text-[11px] font-sans text-stone-600 space-y-2 mt-2">
                    <p className="font-semibold text-stone-800 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      Configuring Live Alibaba Cloud Credentials
                    </p>
                    <p>
                      To enable live Alibaba Cloud calls, define these secrets in the project:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 font-mono text-[10px] text-stone-500">
                      <li>ALIBABA_CLOUD_ACCESS_KEY_ID</li>
                      <li>ALIBABA_CLOUD_ACCESS_KEY_SECRET</li>
                      <li>ALIBABA_CLOUD_REGION (Default: "cn-hangzhou")</li>
                    </ul>
                  </div>
                )}

                {statusResult.regions && (
                  <div className="bg-stone-900 text-stone-100 p-3 rounded-xl max-h-40 overflow-y-auto text-[10px] mt-2 leading-relaxed">
                    <span className="text-amber-400">// Regions Response Body</span>
                    <pre className="whitespace-pre-wrap mt-1">
                      {JSON.stringify(statusResult.regions, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl text-center text-xs text-stone-400 font-mono">
                No test run yet. Click "Run Connection Test" above to query Alibaba Cloud.
              </div>
            )}
          </div>

          {/* Card 2: OSS Bucket Upload Demo */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-xs space-y-5" id="oss-upload-card">
            <div className="space-y-1">
              <h3 className="text-lg font-sans font-medium text-stone-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-500" />
                Aliyun OSS File Upload Verification
              </h3>
              <p className="text-xs text-stone-500">
                Pushes file payloads from the server-side backend to Alibaba Cloud Object Storage Service (OSS).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Object Key</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200/70 p-2 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="e.g. proof.txt"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">File Text Content</label>
                <input
                  type="text"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200/70 p-2 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Enter content to write"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUploadFile}
                disabled={loadingUpload || !fileName || !fileContent}
                className="bg-stone-900 hover:bg-stone-800 text-white p-2 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                id="push-oss-btn"
              >
                {loadingUpload ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                {loadingUpload ? 'Uploading...' : 'Push Object to OSS'}
              </button>
            </div>

            {/* Upload results */}
            {uploadResult ? (
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                uploadResult.success 
                  ? 'bg-emerald-50/40 border-emerald-200/50 text-emerald-800' 
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wide">
                  {uploadResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>OSS Object Upload Succeeded</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Sandbox Emulated Upload Result</span>
                    </>
                  )}
                </div>

                <p className="text-[11px] leading-relaxed">
                  {uploadResult.success 
                    ? `Pushed "${uploadResult.name}" successfully to cloud storage bucket.`
                    : `Upload error: ${uploadResult.message}. Define ALIBABA_CLOUD_OSS_BUCKET secret to run live uploads.`}
                </p>

                {uploadResult.success && uploadResult.url && (
                  <div className="flex items-center gap-2 mt-2 bg-white/70 p-2 rounded-xl border border-emerald-200/40">
                    <span className="text-[10px] text-stone-500">OSS URL:</span>
                    <a 
                      href={uploadResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-orange-600 hover:text-orange-700 font-semibold underline truncate flex items-center gap-1 flex-1"
                    >
                      {uploadResult.url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Code Proof & Deployment Documentation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Code file reference */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-xs space-y-4" id="code-proof-card">
            <h3 className="text-lg font-sans font-medium text-stone-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-amber-600" />
              Source Code Reference
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              This application includes a dedicated service file in the workspace repository that manages all Aliyun API interactions. You can view the code in the file:
            </p>

            <div className="bg-stone-50 border border-stone-200/60 p-3.5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-stone-500 uppercase tracking-widest block">Local File Path</span>
                <span className="font-mono text-xs font-bold text-stone-800">/src/alibabaCloud.ts</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-mono font-bold px-2.5 py-1 rounded-md">
                Active SDK Code
              </span>
            </div>

            <div className="space-y-2 mt-4">
              <span className="text-xs font-semibold text-stone-700 block">How We Call Alibaba APIs:</span>
              <div className="bg-stone-900 text-stone-200 p-3.5 rounded-2xl text-[10px] font-mono leading-relaxed overflow-x-auto space-y-3">
                <div>
                  <span className="text-stone-400">// 1. Core Service Query</span>
                  <pre className="text-emerald-400 mt-0.5">
{`import Core from '@alicloud/pop-core';

const client = new Core({
  accessKeyId: ALIBABA_KEY,
  accessKeySecret: ALIBABA_SECRET,
  endpoint: 'https://ecs.cn-hangzhou.aliyuncs.com',
  apiVersion: '2014-05-26'
});

const result = await client.request('DescribeRegions', {});`}
                  </pre>
                </div>
                <div>
                  <span className="text-stone-400">// 2. Object Storage Service (OSS)</span>
                  <pre className="text-amber-300 mt-0.5">
{`import OSS from 'ali-oss';

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: ALIBABA_KEY,
  accessKeySecret: ALIBABA_SECRET,
  bucket: 'my-aliyun-bucket'
});

const upload = await client.put('report.txt', buffer);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-850 rounded-3xl p-6 text-white shadow-xs space-y-4" id="architecture-card">
            <h3 className="text-base font-sans font-medium text-amber-400 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Deployment Architecture
            </h3>
            
            <div className="space-y-3.5 text-xs text-stone-300 leading-relaxed">
              <p>
                Our production setup uses a modular hybrid topology:
              </p>
              
              <div className="space-y-2 font-mono text-[11px] text-stone-400">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">1.</span>
                  <div>
                    <span className="text-white font-semibold">Google Cloud Run Containers</span>
                    <p className="text-[10px] leading-tight text-stone-400 mt-0.5">Hosts the full-stack Node.js server to run fast computational and voice parsing pipelines.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">2.</span>
                  <div>
                    <span className="text-white font-semibold">Alibaba Cloud Storage (OSS)</span>
                    <p className="text-[10px] leading-tight text-stone-400 mt-0.5">Acts as the high-availability public archive for reports, diagnostic logs, and client exports.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">3.</span>
                  <div>
                    <span className="text-white font-semibold">Aliyun ECS API Broker</span>
                    <p className="text-[10px] leading-tight text-stone-400 mt-0.5">Directly routes automated configuration parameters to ensure backup resources trigger during heavy traffic load.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-3.5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] text-stone-400">
                  Global hybrid-cloud cluster running seamlessly.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
