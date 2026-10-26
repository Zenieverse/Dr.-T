// ============================================================================
// 🩺 DR. T VISION ALERT — OPENCV 5 HEALTH-READING ASSISTANT COMPONENT
// OpenCV AI Competition 2026 (Powered by AWS)
// Physical AI: Visual Reading of Physical Health Monitors with Human Confirmation
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  RotateCcw, 
  Sliders, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Edit3, 
  ExternalLink,
  Flame,
  Activity,
  Heart,
  FileText
} from 'lucide-react';
import { 
  VisionAlertProcessResult, 
  VisionAlertExplanation, 
  ExtractedMeasurement,
  VisionDeviceType,
  ReadingProvenance 
} from '../../engine/visionAlert/types';
import { 
  ALL_SYNTHETIC_FIXTURES, 
  SyntheticFixture 
} from '../../engine/visionAlert/syntheticFixtures';
import { VisionAlertClientService } from '../../engine/visionAlert/visionAlertClientService';
import { HealthAlertIntakeData } from '../../types';

export interface VisionAlertModuleProps {
  currentIntake: HealthAlertIntakeData;
  onImportToHealthAlert: (updatedIntake: HealthAlertIntakeData) => void;
  onClose?: () => void;
}

export const VisionAlertModule: React.FC<VisionAlertModuleProps> = ({
  currentIntake,
  onImportToHealthAlert,
  onClose
}) => {
  // Capture mode: 'camera' | 'upload' | 'preset'
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload' | 'preset'>('preset');
  const [deviceTypeHint, setDeviceTypeHint] = useState<VisionDeviceType>('BLOOD_PRESSURE_MONITOR');
  
  // Media / Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [processResult, setProcessResult] = useState<VisionAlertProcessResult | null>(null);
  const [explanation, setExplanation] = useState<VisionAlertExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Human Confirmation Gate State
  const [measurements, setMeasurements] = useState<ExtractedMeasurement[]>([]);
  const [userConfirmedCheckbox, setUserConfirmedCheckbox] = useState<boolean>(false);
  const [manualEntryMode, setManualEntryMode] = useState<boolean>(false);
  const [manualSys, setManualSys] = useState<number>(120);
  const [manualDia, setManualDia] = useState<number>(80);
  const [manualHr, setManualHr] = useState<number>(72);
  const [manualSpo2, setManualSpo2] = useState<number>(98);

  // UI Accordions
  const [showQualityGuidance, setShowQualityGuidance] = useState<boolean>(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(true);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start with default fixture for instant interactive review
  useEffect(() => {
    handleSelectFixture(ALL_SYNTHETIC_FIXTURES[0]);
    return () => {
      stopCamera();
    };
  }, []);

  // Stop camera stream safely
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start Live WebCam / Phone Camera
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setCaptureMode('camera');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access not available or permission denied. Please use file upload or synthetic monitor presets.');
    }
  };

  // Capture frame from video stream
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewImageUri(dataUri);
    stopCamera();
    runPipelineOnCanvas(canvas);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10 MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        setPreviewImageUri(canvas.toDataURL('image/jpeg', 0.9));
        runPipelineOnCanvas(canvas);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Execute pipeline on canvas
  const runPipelineOnCanvas = async (canvas: HTMLCanvasElement) => {
    setIsProcessing(true);
    setUserConfirmedCheckbox(false);
    try {
      const result = await VisionAlertClientService.processCanvasImage(canvas, deviceTypeHint);
      setProcessResult(result);
      setMeasurements(result.measurements);

      if (result.quality.qualityPassed && result.measurements.length > 0) {
        loadExplanation(result.measurements);
      }
    } catch (err) {
      console.error('Vision pipeline execution error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle synthetic test fixture selection
  const handleSelectFixture = (fixture: SyntheticFixture) => {
    stopCamera();
    setCaptureMode('preset');
    setIsProcessing(true);
    setUserConfirmedCheckbox(false);
    setDeviceTypeHint(fixture.deviceType);

    // Render fixture to canvas
    const pixels = fixture.renderPixels();
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = pixels.width;
      canvas.height = pixels.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.createImageData(pixels.width, pixels.height);
        imgData.data.set(pixels.data);
        ctx.putImageData(imgData, 0, 0);
        setPreviewImageUri(canvas.toDataURL());
      }
    }

    setTimeout(() => {
      const result = VisionAlertClientService.processSyntheticFixture(fixture);
      setProcessResult(result);
      setMeasurements(result.measurements);
      setIsProcessing(false);

      if (result.quality.qualityPassed && result.measurements.length > 0) {
        loadExplanation(result.measurements);
      }
    }, 150);
  };

  // Request Gemini 3.8 Flash explanation
  const loadExplanation = async (currentMeasurements: ExtractedMeasurement[]) => {
    setIsExplaining(true);
    try {
      const exp = await VisionAlertClientService.explainReadings(currentMeasurements);
      setExplanation(exp);
    } catch (e) {
      console.warn('Explanation error:', e);
    } finally {
      setIsExplaining(false);
    }
  };

  // User edits a measurement value in confirmation gate
  const handleEditMeasurement = (id: string, newVal: number) => {
    setMeasurements(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          userEditedValue: newVal,
          provenance: 'USER_CORRECTED' as ReadingProvenance
        };
      }
      return m;
    }));
  };

  // Import confirmed readings into Health Alert Mini
  const handleConfirmAndImport = () => {
    let finalMeasurements = measurements;

    if (manualEntryMode) {
      finalMeasurements = [
        {
          id: 'manual-sys',
          type: 'SYSTOLIC',
          label: 'Systolic Blood Pressure (SYS)',
          value: manualSys,
          unit: 'mmHg',
          confidence: 1.0,
          isPlausible: true,
          provenance: 'MANUALLY_ENTERED'
        },
        {
          id: 'manual-dia',
          type: 'DIASTOLIC',
          label: 'Diastolic Blood Pressure (DIA)',
          value: manualDia,
          unit: 'mmHg',
          confidence: 1.0,
          isPlausible: true,
          provenance: 'MANUALLY_ENTERED'
        },
        {
          id: 'manual-hr',
          type: 'HEART_RATE',
          label: 'Pulse Rate (PULSE)',
          value: manualHr,
          unit: 'bpm',
          confidence: 1.0,
          isPlausible: true,
          provenance: 'MANUALLY_ENTERED'
        }
      ];
    }

    const updated = VisionAlertClientService.applyToHealthAlertIntake(currentIntake, finalMeasurements);
    onImportToHealthAlert(updated);
  };

  return (
    <div className="bg-slate-900/95 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Dr. T Vision Alert</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              OpenCV 5 & COOL (AWS Graviton)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Human Confirmation Gate
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            Visual Health-Reading Assistance
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Uses OpenCV 5 computer vision for blur/glare verification, LCD display localization, and perspective rectification. Extracted numbers require mandatory human confirmation before entering clinical triage.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-start md:self-center px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            Close Vision Alert
          </button>
        )}
      </div>

      {/* Mode Selector & Input Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Acquisition Mode */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>1. Image Acquisition</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setManualEntryMode(false);
                  startCamera();
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  captureMode === 'camera' && isCameraActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Cam</span>
              </button>

              <button
                onClick={() => {
                  setManualEntryMode(false);
                  stopCamera();
                  setCaptureMode('upload');
                  fileInputRef.current?.click();
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  captureMode === 'upload'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => {
                  setManualEntryMode(false);
                  stopCamera();
                  setCaptureMode('preset');
                  handleSelectFixture(ALL_SYNTHETIC_FIXTURES[0]);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  captureMode === 'preset'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Presets</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Synthetic Preset Selector */}
            {captureMode === 'preset' && (
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Synthetic Test Monitor Displays:
                </span>
                <div className="space-y-1.5">
                  {ALL_SYNTHETIC_FIXTURES.map(fix => (
                    <button
                      key={fix.id}
                      onClick={() => handleSelectFixture(fix)}
                      className="w-full text-left p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-xs transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="truncate pr-2">
                        <div className="font-bold text-slate-200 group-hover:text-amber-300 truncate">
                          {fix.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {fix.deviceType === 'BLOOD_PRESSURE_MONITOR' ? 'Blood Pressure' : 'Pulse Oximeter'}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Guidance Dropdown */}
            <div className="pt-2 border-t border-slate-700">
              <button
                onClick={() => setShowQualityGuidance(!showQualityGuidance)}
                className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white font-semibold cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Capture Quality Guidelines</span>
                </span>
                {showQualityGuidance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showQualityGuidance && (
                <div className="mt-2 p-3 bg-slate-900/80 rounded-xl text-[11px] text-slate-300 space-y-1.5 border border-slate-700 leading-relaxed">
                  <p>• <strong>Avoid Glare:</strong> Tilt monitor slightly so overhead lights do not reflect directly into the camera lens.</p>
                  <p>• <strong>Hold Steady:</strong> OpenCV 5 enforces a Laplacian variance blur threshold (≥ 80) to avoid misreading blurry digits.</p>
                  <p>• <strong>Frame Display:</strong> Center the LCD screen so the 4 corners of the bezel are fully visible.</p>
                </div>
              )}
            </div>
          </div>

          {/* Manual Entry Fallback Button */}
          <button
            onClick={() => setManualEntryMode(!manualEntryMode)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{manualEntryMode ? 'Return to Visual Scanning' : 'Enter Manually Instead (Bypass Camera)'}</span>
          </button>
        </div>

        {/* Center Column: Live Camera or Processed Image Inspection */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>2. Visual Inspection & Display Rectification</span>
              </h3>
              {isProcessing && (
                <span className="flex items-center gap-1 text-[11px] text-amber-300 animate-pulse font-mono">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Processing...</span>
                </span>
              )}
            </div>

            {/* Display viewport */}
            <div className="relative aspect-4/3 bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    autoPlay 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-amber-400/60 pointer-events-none m-8 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] bg-black/70 text-amber-300 px-2 py-1 rounded">
                      Align monitor display inside box
                    </span>
                  </div>
                  <button
                    onClick={captureFrame}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Frame</span>
                  </button>
                </div>
              ) : previewImageUri ? (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                  <img
                    src={previewImageUri}
                    alt="Captured Monitor Display"
                    className="max-h-full max-w-full object-contain"
                  />
                  {processResult?.display.displayFound && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/80 text-white font-bold">
                      LCD Bezel Localized
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                  <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No image captured or selected yet.</p>
                </div>
              )}
            </div>

            {/* Quality Metrics Bar */}
            {processResult && (
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <div className="text-slate-400">Sharpness</div>
                  <div className={`font-bold ${processResult.quality.isBlurry ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {processResult.quality.blurScore} {processResult.quality.isBlurry ? '❌' : '✓'}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <div className="text-slate-400">Glare</div>
                  <div className={`font-bold ${processResult.quality.hasGlare ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {Math.round(processResult.quality.glareRatio * 100)}% {processResult.quality.hasGlare ? '❌' : '✓'}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <div className="text-slate-400">Contrast</div>
                  <div className="font-bold text-cyan-300">
                    {processResult.quality.contrastRms}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <div className="text-slate-400">OpenCV Latency</div>
                  <div className="font-bold text-amber-300">
                    {processResult.processingTimeMs} ms
                  </div>
                </div>
              </div>
            )}

            {/* Quality Failure Rejection Alert */}
            {processResult && !processResult.quality.qualityPassed && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Unable to Read Reliably</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {processResult.quality.rejectionReason}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => setManualEntryMode(true)}
                    className="px-2.5 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Switch to Manual Entry
                  </button>
                  <button
                    onClick={() => startCamera()}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] cursor-pointer"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 3. Human Confirmation Gate */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3. Human Confirmation Gate</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mandatory
              </span>
            </div>

            {manualEntryMode ? (
              /* Manual Entry Form */
              <div className="space-y-3">
                <p className="text-[11px] text-amber-300/90 leading-relaxed">
                  Manual Entry Mode: Input numbers directly from your physical monitor. Values will be tagged with <code>[MANUALLY_ENTERED]</code> provenance.
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={260}
                      value={manualSys}
                      onChange={(e) => setManualSys(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-600 font-mono text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={160}
                      value={manualDia}
                      onChange={(e) => setManualDia(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-600 font-mono text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Pulse Rate (bpm)
                    </label>
                    <input
                      type="number"
                      min={35}
                      max={220}
                      value={manualHr}
                      onChange={(e) => setManualHr(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-600 font-mono text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                </div>
              </div>
            ) : measurements.length > 0 ? (
              /* Extracted Candidate Cards */
              <div className="space-y-3">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Review each detected measurement. You may edit any value directly if the camera misread a segmented LCD digit:
                </p>

                <div className="space-y-2">
                  {measurements.map(m => {
                    const activeVal = m.userEditedValue !== undefined ? m.userEditedValue : m.value;
                    const isEdited = m.userEditedValue !== undefined;
                    return (
                      <div 
                        key={m.id}
                        className={`p-3 rounded-xl border transition space-y-1.5 ${
                          isEdited 
                            ? 'bg-amber-950/40 border-amber-500/60' 
                            : 'bg-slate-900/80 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-300">
                            {m.label}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                            isEdited 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {isEdited ? 'USER_CORRECTED' : 'MACHINE_EXTRACTED'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={activeVal}
                            onChange={(e) => handleEditMeasurement(m.id, Number(e.target.value))}
                            className="w-24 p-1.5 rounded-lg bg-slate-950 border border-slate-600 font-mono text-base font-black text-amber-300 focus:outline-none focus:border-amber-400 text-center"
                          />
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {m.unit}
                          </span>
                          <div className="ml-auto text-[10px] text-slate-400 font-mono">
                            Conf: {Math.round(m.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                Capture an image or select a preset to view extracted measurements.
              </div>
            )}

            {/* Mandatory User Confirmation Checkbox */}
            {(measurements.length > 0 || manualEntryMode) && (
              <div className="pt-2 border-t border-slate-700 space-y-3">
                <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={userConfirmedCheckbox}
                    onChange={(e) => setUserConfirmedCheckbox(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-600 bg-slate-900 cursor-pointer"
                  />
                  <span>
                    <strong>I confirm</strong> these numbers accurately reflect the display on my physical device.
                  </span>
                </label>

                {/* Primary Action Button */}
                <button
                  disabled={!userConfirmedCheckbox}
                  onClick={handleConfirmAndImport}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    userConfirmedCheckbox
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 ring-1 ring-white/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Import Confirmed Readings into Health Alert Mini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Gemini Synthesis Box */}
      {explanation && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white text-xs">Physiological Reading Orientation</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {explanation.provider}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Latency: {explanation.latencyMs} ms
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {explanation.summary}
          </p>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
              Suggested Questions for Your Physician:
            </span>
            <ul className="space-y-1 text-slate-400 list-disc list-inside">
              {explanation.clinicalQuestions.map((q, idx) => (
                <li key={idx} className="text-[11px]">{q}</li>
              ))}
            </ul>
          </div>

          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 italic">
            {explanation.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default VisionAlertModule;
