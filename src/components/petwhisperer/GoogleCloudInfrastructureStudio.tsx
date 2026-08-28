import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Send, 
  CheckCircle2, 
  Activity, 
  Server, 
  Database, 
  RefreshCw, 
  Radio, 
  Layers, 
  Terminal, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

export const GoogleCloudInfrastructureStudio: React.FC = () => {
  const [topics, setTopics] = useState<any[]>([
    {
      id: 'canine-acoustic-spikes',
      name: 'projects/petwhisperer-cloud/topics/canine-acoustic-spikes',
      publishRate: '1,420 msgs/min',
      retentionHours: 168,
      status: 'READY'
    },
    {
      id: 'canine-arousal-alerts',
      name: 'projects/petwhisperer-cloud/topics/canine-arousal-alerts',
      publishRate: '88 msgs/hr',
      retentionHours: 72,
      status: 'READY'
    },
    {
      id: 'canine-biometric-telemetry',
      name: 'projects/petwhisperer-cloud/topics/canine-biometric-telemetry',
      publishRate: '3,800 msgs/min',
      retentionHours: 336,
      status: 'READY'
    }
  ]);

  const [selectedTopic, setSelectedTopic] = useState(topics[0].name);
  const [payloadText, setPayloadText] = useState(
    JSON.stringify({
      subjectId: 'canine_buster_007',
      event: 'ACOUSTIC_TRANSIENT_SPIKE',
      decibelPeak: 92.4,
      f0FrequencyHz: 620,
      timestamp: new Date().toISOString()
    }, null, 2)
  );

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [publishedMessages, setPublishedMessages] = useState<any[]>([
    {
      messageId: 'pubsub_msg_98f12a38',
      topic: 'projects/petwhisperer-cloud/topics/canine-acoustic-spikes',
      timestamp: new Date(Date.now() - 1000 * 40).toLocaleTimeString(),
      latencyMs: 8,
      status: 'ACK_DELIVERED'
    }
  ]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(payloadText);
      } catch (e) {
        parsed = { raw: payloadText };
      }

      const res = await fetch('/api/gcp/pubsub/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          payload: parsed
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPublishResult(data);
        setPublishedMessages(prev => [
          {
            messageId: data.messageId,
            topic: data.topic,
            timestamp: new Date().toLocaleTimeString(),
            latencyMs: data.deliveryLatencyMs,
            status: 'ACK_DELIVERED'
          },
          ...prev.slice(0, 8)
        ]);
      }
    } catch (err) {
      console.warn('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-sky-500 text-white">
              GCP INFRASTRUCTURE
            </span>
            <span className="text-xs font-mono text-stone-500">
              CLOUD RUN CONTAINER INGRESS &amp; CLOUD PUB/SUB
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Google Cloud &amp; Pub/Sub Streaming Bus
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Production serverless ingress hosted on Google Cloud Run (0.0.0.0:3000) in region <code>asia-southeast1</code> with Google Cloud Pub/Sub real-time event distribution and Firestore persistence.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-[#1A1A1A] shadow-xs font-mono text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-stone-900">Cloud Run Ingress: 0.0.0.0:3000 (Active)</span>
        </div>
      </div>

      {/* Cloud Architecture Telemetry Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-white border border-[#1A1A1A] shadow-xs space-y-1">
          <div className="text-stone-500 text-[10px]">CLOUD RUN REGION</div>
          <div className="text-stone-900 font-bold text-sm">asia-southeast1</div>
          <div className="text-emerald-700 text-[11px]">Scale-to-Zero Enabled</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#1A1A1A] shadow-xs space-y-1">
          <div className="text-stone-500 text-[10px]">CONTAINER INGRESS</div>
          <div className="text-stone-900 font-bold text-sm">Port 3000 (0.0.0.0)</div>
          <div className="text-stone-600 text-[11px]">Direct NGINX Routing</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#1A1A1A] shadow-xs space-y-1">
          <div className="text-stone-500 text-[10px]">PUBSUB SUBSCRIBERS</div>
          <div className="text-sky-700 font-bold text-sm">4 Active Endpoints</div>
          <div className="text-stone-600 text-[11px]">Push &amp; Pull Subscriptions</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#1A1A1A] shadow-xs space-y-1">
          <div className="text-stone-500 text-[10px]">FIRESTORE SYNC</div>
          <div className="text-indigo-700 font-bold text-sm">Real-time Stream</div>
          <div className="text-emerald-700 text-[11px]">Rules Audited &amp; Deployed</div>
        </div>
      </div>

      {/* Live Pub/Sub Message Bus Publisher & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Topics List */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Active Cloud Pub/Sub Topics
              </h2>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.name)}
                className={`w-full p-3.5 rounded-xl text-left border transition flex flex-col space-y-1.5 ${
                  selectedTopic === t.name
                    ? 'bg-sky-50 border-sky-500 shadow-2xs'
                    : 'bg-[#FAF9F6] border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{t.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    {t.status}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 truncate">{t.name}</div>
                <div className="flex justify-between text-[10px] text-stone-600 pt-1 border-t border-stone-200">
                  <span>Publish Rate:</span>
                  <span className="font-bold text-sky-800">{t.publishRate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Payload Simulator */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#1A1A1A]" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Publish Custom Acoustic / Biometric Event Payload
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500 truncate max-w-xs">
              Target: {selectedTopic.split('/').pop()}
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-stone-700">
              JSON Event Payload:
            </label>
            <textarea
              rows={6}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-300 font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs flex items-center space-x-2 transition shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>{isPublishing ? 'Publishing Event...' : 'Publish to Cloud Pub/Sub Topic'}</span>
            </button>
          </div>

          {/* Published Messages Stream */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-stone-500">
              Recent Topic Deliveries (Live Acknowledgment Stream):
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-xs">
              {publishedMessages.map((msg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{msg.messageId}</span>
                    </div>
                    <div className="text-[10px] text-stone-500">{msg.topic}</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      ACK &lt;{msg.latencyMs}ms
                    </div>
                    <div className="text-[10px] text-stone-400">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
