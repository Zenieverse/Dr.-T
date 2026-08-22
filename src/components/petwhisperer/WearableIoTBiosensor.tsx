import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Heart, Zap, Battery, Radio, Shield, 
  RefreshCw, AlertTriangle, Play, Pause, Volume2, 
  Cpu, Thermometer, Compass, Bell, CheckCircle2, ChevronRight, BarChart3
} from 'lucide-react';
import { SmartCollarDevice, CollarTelemetrySample } from './types';

export const WearableIoTBiosensor: React.FC = () => {
  // Connected Devices
  const [devices, setDevices] = useState<SmartCollarDevice[]>([
    {
      id: 'dev-fi-9901',
      name: 'Kona - Fi Series 3 Smart Band',
      brand: 'Fi Series 3',
      patientId: 'patient-kona-01',
      patientName: 'Kona (Golden Retriever)',
      batteryPct: 88,
      connectionStatus: 'Connected (BLE 5.3)',
      firmwareVersion: 'v4.18.2-rtos',
      lastSyncTimestamp: 'Just now'
    },
    {
      id: 'dev-inv-8820',
      name: 'Barnaby - Invoxia Biometric Pro',
      brand: 'Invoxia Biometric',
      patientId: 'patient-barnaby-02',
      patientName: 'Barnaby (Basset Hound)',
      batteryPct: 64,
      connectionStatus: 'Connected (BLE 5.3)',
      firmwareVersion: 'v2.9.1-med',
      lastSyncTimestamp: '2 mins ago'
    },
    {
      id: 'dev-pp-7731',
      name: 'Luna - PetPace Medical Pro Clinical',
      brand: 'PetPace Medical Pro',
      patientId: 'patient-luna-03',
      patientName: 'Luna (Border Collie)',
      batteryPct: 92,
      connectionStatus: 'Connected (BLE 5.3)',
      firmwareVersion: 'v6.3.0-cert',
      lastSyncTimestamp: 'Just now'
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<SmartCollarDevice>(devices[0]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isSoothingActive, setIsSoothingActive] = useState<boolean>(false);
  const [soothingFrequency, setSoothingFrequency] = useState<432 | 528>(432);

  // Live Telemetry Values
  const [currentSample, setCurrentSample] = useState<CollarTelemetrySample>({
    timestamp: new Date().toLocaleTimeString(),
    heartRateBpm: 78,
    hrvRmssdMs: 54,
    hrvSdnnMs: 68,
    respiratoryRateBrpm: 18,
    surfaceTempCelsius: 38.4,
    accelerometer: { x: 0.04, y: 0.02, z: 0.98, gForce: 1.01 },
    activityState: 'Resting',
    dailyRestPercentage: 72,
    dailyScratchCount: 4,
    stressIndexScore: 18
  });

  const [historySamples, setHistorySamples] = useState<CollarTelemetrySample[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Array<{
    id: string;
    timestamp: string;
    type: 'warning' | 'info' | 'critical';
    title: string;
    description: string;
  }>>([
    {
      id: 'alt-01',
      timestamp: '14:22:10',
      type: 'info',
      title: 'Baseline Sleep Quality Optimal',
      description: 'Overnight resting heart rate established at 68 BPM (SDNN: 72ms).'
    }
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Synthesize Soothing Audio when Arousal Surge Detected
  const triggerSoothingAudio = (freq: 432 | 528) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsSoothingActive(true);
      setSoothingFrequency(freq);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  const stopSoothingAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);
      setTimeout(() => {
        if (oscRef.current) {
          try {
            oscRef.current.stop();
            oscRef.current.disconnect();
          } catch(e) {}
          oscRef.current = null;
        }
        setIsSoothingActive(false);
      }, 850);
    } else {
      setIsSoothingActive(false);
    }
  };

  // Live Telemetry Ticker Simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setCurrentSample(prev => {
        // Base drift
        const hrDrift = (Math.random() - 0.48) * 3;
        const newHR = Math.max(55, Math.min(165, Math.round(prev.heartRateBpm + hrDrift)));
        
        let newActivity = prev.activityState;
        let stress = prev.stressIndexScore;
        
        if (newHR > 125) {
          newActivity = 'Arousal Surge';
          stress = Math.min(95, stress + 6);
        } else if (newHR > 95) {
          newActivity = 'Active Walking';
          stress = Math.max(25, stress - 1);
        } else if (newHR < 70) {
          newActivity = 'Deep Sleep';
          stress = Math.max(10, stress - 3);
        } else {
          newActivity = 'Resting';
          stress = Math.max(15, stress - 2);
        }

        const rmssd = Math.max(20, Math.min(90, Math.round(75 - (stress * 0.5) + (Math.random() * 6 - 3))));
        const sdnn = Math.round(rmssd * 1.25);
        const respRate = Math.round(14 + (stress / 100) * 16 + (Math.random() * 2));
        const temp = Number((38.3 + (stress > 60 ? 0.4 : 0) + (Math.random() * 0.1 - 0.05)).toFixed(1));

        const sample: CollarTelemetrySample = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          heartRateBpm: newHR,
          hrvRmssdMs: rmssd,
          hrvSdnnMs: sdnn,
          respiratoryRateBrpm: respRate,
          surfaceTempCelsius: temp,
          accelerometer: {
            x: Number(((Math.random() - 0.5) * (stress > 50 ? 1.4 : 0.2)).toFixed(2)),
            y: Number(((Math.random() - 0.5) * (stress > 50 ? 1.4 : 0.2)).toFixed(2)),
            z: Number((0.95 + (Math.random() - 0.5) * 0.1).toFixed(2)),
            gForce: Number((1.0 + (stress > 50 ? Math.random() * 0.8 : 0.05)).toFixed(2))
          },
          activityState: newActivity,
          dailyRestPercentage: prev.dailyRestPercentage,
          dailyScratchCount: prev.dailyScratchCount + (Math.random() < 0.02 ? 1 : 0),
          stressIndexScore: stress
        };

        setHistorySamples(hist => [...hist.slice(-18), sample]);
        return sample;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Inject Simulation Scenarios
  const injectScenario = (type: 'tachycardia' | 'scratching' | 'nightmare' | 'normal') => {
    const time = new Date().toLocaleTimeString();
    if (type === 'tachycardia') {
      setCurrentSample(prev => ({
        ...prev,
        heartRateBpm: 148,
        hrvRmssdMs: 24,
        hrvSdnnMs: 31,
        activityState: 'Arousal Surge',
        stressIndexScore: 84
      }));
      setRecentAlerts(prev => [
        {
          id: `alt-${Date.now()}`,
          timestamp: time,
          type: 'critical',
          title: 'Acute Tachycardia & Sympathetic Surge',
          description: 'Heart rate spiked to 148 BPM (RMSSD dropped to 24ms). Solfeggio 432Hz calming tone recommended.'
        },
        ...prev.slice(0, 5)
      ]);
      triggerSoothingAudio(432);
    } else if (type === 'scratching') {
      setCurrentSample(prev => ({
        ...prev,
        dailyScratchCount: prev.dailyScratchCount + 8,
        activityState: 'Pruritic Scratching',
        accelerometer: { x: 1.82, y: 2.14, z: 1.05, gForce: 2.9 }
      }));
      setRecentAlerts(prev => [
        {
          id: `alt-${Date.now()}`,
          timestamp: time,
          type: 'warning',
          title: 'High Frequency Scratching Episode',
          description: 'Continuous collar micro-vibration detected 8 rapid scratching cycles within 45 seconds (Dermatological alert).'
        },
        ...prev.slice(0, 5)
      ]);
    } else if (type === 'nightmare') {
      setCurrentSample(prev => ({
        ...prev,
        heartRateBpm: 112,
        respiratoryRateBrpm: 32,
        activityState: 'Head Shaking',
        stressIndexScore: 62
      }));
      setRecentAlerts(prev => [
        {
          id: `alt-${Date.now()}`,
          timestamp: time,
          type: 'warning',
          title: 'REM Sleep Disturbance Detected',
          description: 'Respiratory rate accelerated to 32 BRPM with localized muscle twitching during deep sleep cycle.'
        },
        ...prev.slice(0, 5)
      ]);
      triggerSoothingAudio(528);
    } else {
      setCurrentSample(prev => ({
        ...prev,
        heartRateBpm: 72,
        hrvRmssdMs: 64,
        hrvSdnnMs: 78,
        respiratoryRateBrpm: 16,
        activityState: 'Resting',
        stressIndexScore: 14
      }));
      stopSoothingAudio();
      setRecentAlerts(prev => [
        {
          id: `alt-${Date.now()}`,
          timestamp: time,
          type: 'info',
          title: 'Parasympathetic Baseline Restored',
          description: 'Heart rate stabilized at 72 BPM. High vagal tone confirmed.'
        },
        ...prev.slice(0, 5)
      ]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border-2 border-stone-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Live BLE 5.3 / LTE-M Pipeline
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-[10px] font-bold">
              Continuous PPG & 3-Axis IMU
            </span>
          </div>
          <h2 className="font-serif italic font-black text-2xl sm:text-3xl tracking-tight text-stone-100">
            Wearable IoT Biosensor & Smart Collar Telemetry
          </h2>
          <p className="text-stone-400 font-mono text-xs max-w-2xl mt-1">
            Real-time biometric ingestion streaming optical heart rate (PPG), autonomic HRV tone (RMSSD/SDNN), 
            respiratory cadences, skin temperature, and gait actigraphy directly from smart collar hardware.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              isStreaming 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900' 
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            {isStreaming ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isStreaming ? 'Streaming Live' : 'Paused'}</span>
          </button>

          {isSoothingActive ? (
            <button
              onClick={stopSoothingAudio}
              className="px-4 py-2.5 bg-amber-500 text-stone-950 rounded-2xl font-mono text-xs font-black flex items-center gap-2 shadow-md hover:bg-amber-400 cursor-pointer animate-pulse"
            >
              <Volume2 className="w-4 h-4" />
              <span>Playing {soothingFrequency}Hz Solfeggio</span>
            </button>
          ) : (
            <button
              onClick={() => triggerSoothingAudio(432)}
              className="px-4 py-2.5 bg-stone-800 text-stone-200 border border-stone-700 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 hover:bg-stone-700 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Test 432Hz Soothing</span>
            </button>
          )}
        </div>
      </div>

      {/* Device Selector & Hardware Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map(dev => {
          const isSelected = selectedDevice.id === dev.id;
          return (
            <div
              key={dev.id}
              onClick={() => setSelectedDevice(dev)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/30' 
                  : 'bg-white/80 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-500">
                  {dev.brand}
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-700">
                  <Battery className={`w-3.5 h-3.5 ${dev.batteryPct > 50 ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span>{dev.batteryPct}%</span>
                </div>
              </div>
              <h3 className="font-serif font-black text-stone-900 text-sm">{dev.name}</h3>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-stone-600">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {dev.connectionStatus}
                </span>
                <span>FW: {dev.firmwareVersion}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Vitals Real-Time Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Heart Rate */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold">Optical PPG HR</span>
            <Heart className={`w-4 h-4 ${currentSample.heartRateBpm > 110 ? 'text-rose-600 animate-bounce' : 'text-rose-500'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-stone-900">
              {currentSample.heartRateBpm}
            </span>
            <span className="font-mono text-[11px] text-stone-500 font-bold">BPM</span>
          </div>
          <p className="font-mono text-[10px] text-stone-500 mt-1">
            Baseline: 65-85 BPM
          </p>
        </div>

        {/* HRV RMSSD */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold">HRV (RMSSD)</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-stone-900">
              {currentSample.hrvRmssdMs}
            </span>
            <span className="font-mono text-[11px] text-stone-500 font-bold">ms</span>
          </div>
          <p className="font-mono text-[10px] text-stone-500 mt-1">
            Vagal Tone: {currentSample.hrvRmssdMs > 45 ? 'Optimal' : 'Suppressed'}
          </p>
        </div>

        {/* Respiratory Rate */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold">Respiratory</span>
            <Zap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-stone-900">
              {currentSample.respiratoryRateBrpm}
            </span>
            <span className="font-mono text-[11px] text-stone-500 font-bold">BRPM</span>
          </div>
          <p className="font-mono text-[10px] text-stone-500 mt-1">
            Thoracic Expansion
          </p>
        </div>

        {/* Surface Temp */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold">Surface Temp</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-stone-900">
              {currentSample.surfaceTempCelsius}°
            </span>
            <span className="font-mono text-[11px] text-stone-500 font-bold">C</span>
          </div>
          <p className="font-mono text-[10px] text-stone-500 mt-1">
            101.1°F Normothermic
          </p>
        </div>

        {/* IMU Motion Activity */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold">Actigraphy State</span>
            <Compass className="w-4 h-4 text-purple-600" />
          </div>
          <div className="truncate font-mono text-sm font-black text-stone-900 mt-1">
            {currentSample.activityState}
          </div>
          <p className="font-mono text-[10px] text-stone-500 mt-1">
            G-Force: {currentSample.accelerometer.gForce}g
          </p>
        </div>

        {/* Stress Score */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold">Cortisol Stress Index</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-2xl font-black ${
              currentSample.stressIndexScore > 60 ? 'text-rose-600' : 'text-stone-900'
            }`}>
              {currentSample.stressIndexScore}
            </span>
            <span className="font-mono text-[11px] text-stone-500 font-bold">/100</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                currentSample.stressIndexScore > 60 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${currentSample.stressIndexScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Live Visualizer & Simulation Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live ECG/PPG Waveform & Historical Vitals Strip */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-black text-lg text-stone-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                Live PPG Optical Waveform & Autonomic HRV Spectrum
              </h3>
              <p className="font-mono text-xs text-stone-500">
                Continuous 25Hz photoplethysmography sensor streaming from collar contact electrode
              </p>
            </div>
            <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-xl">
              Sampling: 250 Hz (BLE 5.3 ISO)
            </span>
          </div>

          {/* Simulated Waveform Visualizer */}
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 relative overflow-hidden h-44 flex items-end">
            <div className="absolute top-3 left-4 flex items-center gap-3 font-mono text-[11px] text-stone-400">
              <span className="text-emerald-400 font-bold">● PPG Signal Locked</span>
              <span>SDNN: {currentSample.hrvSdnnMs} ms</span>
              <span>Daily Rest: {currentSample.dailyRestPercentage}%</span>
              <span>Scratches Today: {currentSample.dailyScratchCount}</span>
            </div>

            {/* Dynamic Waveform Bars */}
            <div className="w-full flex items-end justify-between gap-1.5 h-28">
              {historySamples.map((s, idx) => {
                const heightPct = Math.min(100, Math.max(15, ((s.heartRateBpm - 50) / 100) * 100));
                const isSpike = s.heartRateBpm > 110;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isSpike ? 'bg-gradient-to-t from-rose-600 to-rose-400' : 'bg-gradient-to-t from-emerald-600 to-amber-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[8px] font-mono text-stone-500 rotate-90 truncate origin-left">
                      {s.timestamp.slice(0, 5)}
                    </span>
                  </div>
                );
              })}
              {historySamples.length === 0 && (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-500">
                  Calibrating biosensor stream...
                </div>
              )}
            </div>
          </div>

          {/* Accelerometer 3-Axis Force Vector Box */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-mono text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-600" />
                3-Axis Accelerometer (G-Force Vectors & Postural Axis)
              </h4>
              <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                G-Force: {currentSample.accelerometer.gForce} G
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">X-Axis (Lateral Tilt)</span>
                <span className="font-black text-stone-900 text-sm">{currentSample.accelerometer.x} g</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">Y-Axis (Cervical Pitch)</span>
                <span className="font-black text-stone-900 text-sm">{currentSample.accelerometer.y} g</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">Z-Axis (Vertical Impact)</span>
                <span className="font-black text-stone-900 text-sm">{currentSample.accelerometer.z} g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Physiological Incident Injector & Alerts */}
        <div className="space-y-4">
          
          {/* Incident Injector */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-serif font-black text-base text-stone-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Inject Physiological Scenarios
              </h3>
              <p className="font-mono text-xs text-stone-500">
                Simulate realistic smart collar biometric events to test real-time bio-acoustic de-escalation
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => injectScenario('tachycardia')}
                className="w-full p-3 text-left rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all font-mono text-xs cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-rose-900 block">Acute Tachycardia Spike</span>
                  <span className="text-[11px] text-rose-700">HR 148 BPM, RMSSD drops to 24ms</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => injectScenario('scratching')}
                className="w-full p-3 text-left rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all font-mono text-xs cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-amber-900 block">Pruritic Scratching Storm</span>
                  <span className="text-[11px] text-amber-700">High-G IMU oscillation, 8 rapid cycles</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => injectScenario('nightmare')}
                className="w-full p-3 text-left rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all font-mono text-xs cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-indigo-900 block">REM Sleep / Dream Dysregulation</span>
                  <span className="text-[11px] text-indigo-700">Tachypnea (32 BRPM), head tremor</span>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => injectScenario('normal')}
                className="w-full p-3 text-left rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all font-mono text-xs cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-emerald-900 block">Restore Parasympathetic Resting</span>
                  <span className="text-[11px] text-emerald-700">HR 72 BPM, RMSSD 64ms baseline</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Incident Telemetry Log */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-serif font-black text-sm text-stone-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-stone-700" />
              Real-Time Sensor Event Stream
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {recentAlerts.map(alt => (
                <div 
                  key={alt.id}
                  className={`p-3 rounded-2xl text-xs font-mono border ${
                    alt.type === 'critical' 
                      ? 'bg-rose-50 border-rose-200 text-rose-950' 
                      : alt.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{alt.title}</span>
                    <span className="text-[10px] text-stone-500">{alt.timestamp}</span>
                  </div>
                  <p className="text-[11px] opacity-90">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
