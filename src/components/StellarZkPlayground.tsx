import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Shield, Check, Lock, Unlock, Send, RefreshCw, Cpu, 
  Layers, Compass, Eye, EyeOff, Users, Award, Terminal, Copy, Info, 
  AlertTriangle, Sparkles, MessageSquare, Flame, HelpCircle, Database
} from 'lucide-react';

interface Attestation {
  id: string;
  category: 'thank-you' | 'constructive' | 'warm-hug' | 'initiative-vote';
  message: string;
  pseudonym: string;
  txHash: string;
  ledgerNo: number;
  timestamp: string;
  provingSystem: string;
  proofSize: string;
  gasSpent: number;
  voteValue?: string;
  voteKey?: string;
  proofData: {
    merkleRoot: string;
    nullifierHash: string;
    proof_a: string[];
    proof_b: string[][];
    proof_c: string[];
  };
}

interface InitiativePoll {
  question: string;
  options: { key: string; label: string; votes: number }[];
}

export default function StellarZkPlayground() {
  // Member key list for simulating recognized circle keys
  const recognizedKeys = ['warmth', 'tlc', 'stella', 'doctor-t', 'zeniverse', 'healing', 'harmony'];

  // Input states
  const [attestationType, setAttestationType] = useState<'thank-you' | 'constructive' | 'warm-hug' | 'initiative-vote'>('thank-you');
  const [messageText, setMessageText] = useState('');
  const [memberPassphrase, setMemberPassphrase] = useState('warmth');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [selectedVoteOption, setSelectedVoteOption] = useState('c'); // Defaults to Option C!
  const [provingSystem, setProvingSystem] = useState<'groth16' | 'risczero'>('groth16');

  // Interactive controls
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  const [copiedRoot, setCopiedRoot] = useState(false);

  // Prover & Verifier engine states
  const [isProving, setIsProving] = useState(false);
  const [provingLogs, setProvingLogs] = useState<{ id: string; type: 'info' | 'success' | 'warn' | 'process'; message: string; timestamp: string }[]>([]);
  const [generatedAttestation, setGeneratedAttestation] = useState<Attestation | null>(null);

  const [isSubmittingOnChain, setIsSubmittingOnChain] = useState(false);
  const [onChainLogs, setOnChainLogs] = useState<{ id: string; type: 'info' | 'success' | 'warn' | 'process'; message: string; timestamp: string }[]>([]);
  
  // Active explanation tabs
  const [activeTab, setActiveTab] = useState<'how' | 'stellar' | 'merkle' | 'privacy'>('how');

  // Ledger / Feed list
  const [feed, setFeed] = useState<Attestation[]>([
    {
      id: 'att-1',
      category: 'thank-you',
      message: "Dr. T, your unboxing experience is such a breath of fresh air! It brought me so much joy during a stressful week. The Taichi speed double ouch joke is hilarious!",
      pseudonym: "Anonymous Supporter #481",
      txHash: "0x3af8...92c1",
      ledgerNo: 12499104,
      timestamp: "10 mins ago",
      provingSystem: "Groth16 Snark",
      proofSize: "340 bytes",
      gasSpent: 12401,
      proofData: {
        merkleRoot: "0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962",
        nullifierHash: "0x7d1b38f88ce199ea07123bf0280df0a4",
        proof_a: ["0x18ac...", "0x2ba5..."],
        proof_b: [["0x09da...", "0x12fc..."], ["0x3da4...", "0x0bf2..."]],
        proof_c: ["0x0fa5...", "0x1b8c..."]
      }
    },
    {
      id: 'att-2',
      category: 'initiative-vote',
      message: "Voted anonymously for the 'Creative Self-Care Journaling' workshop. Excited to participate!",
      pseudonym: "Cozy Neighbor #205",
      txHash: "0x9c41...a42e",
      ledgerNo: 12499092,
      timestamp: "1 hour ago",
      provingSystem: "Groth16 Snark",
      proofSize: "340 bytes",
      gasSpent: 11850,
      voteValue: "Creative Journaling",
      proofData: {
        merkleRoot: "0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962",
        nullifierHash: "0x5a2d04f208ac6d73f8a02c98d752a4ef",
        proof_a: ["0x02b4...", "0x19a2..."],
        proof_b: [["0x11ab...", "0x2e0c..."], ["0x23df...", "0x15fa..."]],
        proof_c: ["0x14da...", "0x09b1..."]
      }
    },
    {
      id: 'att-3',
      category: 'warm-hug',
      message: "Sending a silent wave of appreciation to everyone building this beautiful workspace. Psychological safety is everything.",
      pseudonym: "Gentle Spirit #090",
      txHash: "0x71e3...2c31",
      ledgerNo: 12498950,
      timestamp: "5 hours ago",
      provingSystem: "Groth16 Snark",
      proofSize: "340 bytes",
      gasSpent: 12050,
      proofData: {
        merkleRoot: "0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962",
        nullifierHash: "0x98bf24c08ade2937af8d0c2e9124be3f",
        proof_a: ["0x1bf5...", "0x0ec2..."],
        proof_b: [["0x1ea5...", "0x2da4..."], ["0x0fb2...", "0x1bc8..."]],
        proof_c: ["0x2da8...", "0x12da..."]
      }
    }
  ]);

  // Initiative Poll State
  const [poll, setPoll] = useState<InitiativePoll>({
    question: "Which Tender Loving Care (TLC) initiative should Dr. T add or launch next?",
    options: [
      { key: 'a', label: "🌸 Weekly Silent Taichi and Breathing Livestreams", votes: 24 },
      { key: 'b', label: "📖 Creative Self-Care Journaling Workshop & PDF Guides", votes: 31 },
      { key: 'c', label: "🏆 Stellar ZK Proof-of-Care Badges for Unboxing Laureates", votes: 48 },
      { key: 'd', label: "🍵 Mindful Tea Ceremony with Sound Bath Meditations", votes: 19 }
    ]
  });

  const proverConsoleRef = useRef<HTMLDivElement>(null);
  const onChainConsoleRef = useRef<HTMLDivElement>(null);

  // Auto scroll consoles
  useEffect(() => {
    if (proverConsoleRef.current) {
      proverConsoleRef.current.scrollTop = proverConsoleRef.current.scrollHeight;
    }
  }, [provingLogs]);

  useEffect(() => {
    if (onChainConsoleRef.current) {
      onChainConsoleRef.current.scrollTop = onChainConsoleRef.current.scrollHeight;
    }
  }, [onChainLogs]);

  const addProverLog = (message: string, type: 'info' | 'success' | 'warn' | 'process') => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    const log = { id: Math.random().toString(), type, message, timestamp: time };
    setProvingLogs(prev => [...prev, log]);
  };

  const addOnChainLog = (message: string, type: 'info' | 'success' | 'warn' | 'process') => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    const log = { id: Math.random().toString(), type, message, timestamp: time };
    setOnChainLogs(prev => [...prev, log]);
  };

  const handleCopyMerkleRoot = () => {
    navigator.clipboard.writeText("0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962");
    setCopiedRoot(true);
    setTimeout(() => setCopiedRoot(false), 2000);
  };

  const executeProver = async () => {
    if (isProving) return;
    setIsProving(true);
    setGeneratedAttestation(null);
    setOnChainLogs([]);
    setProvingLogs([]);

    const formattedPass = memberPassphrase.trim().toLowerCase();
    const systemName = provingSystem === 'groth16' ? 'Groth16 SNARK' : 'RISC Zero STARK';

    addProverLog(`Initializing ${systemName} Merkle-membership proof circuit...`, 'info');
    await new Promise(r => setTimeout(r, 600));

    addProverLog(`Hashing community private pass: H(key="${formattedPass}")`, 'process');
    await new Promise(r => setTimeout(r, 500));

    // Evaluate private key validity (is it part of Dr. T's simulated Merkle Circle?)
    const isMemberValid = recognizedKeys.includes(formattedPass);
    
    if (!isMemberValid) {
      addProverLog(`[ZK CRITICAL WARNING]: Private secret "${formattedPass}" is NOT included in the verified Merkle Tree database.`, 'warn');
      addProverLog(`Computed leaf hash 0x7a8e... does not balance with root 0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962`, 'warn');
      addProverLog(`Constraint System Error: Membership proof generation aborted.`, 'warn');
      setIsProving(false);
      return;
    }

    addProverLog(`Leaf successfully authenticated! Merkle Path constraints confirmed:`, 'success');
    addProverLog(`  └─ Hash_0 (Passphrase Leaf): 0x4f128c9b...`, 'info');
    addProverLog(`  └─ Hash_1 (Sibling Node):    0x19a4e2bd...`, 'info');
    addProverLog(`  └─ Computed Merkle Root Match: 0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962`, 'success');
    await new Promise(r => setTimeout(r, 700));

    addProverLog(`Creating Nullifier Hash to prevent double voting/spamming:`, 'process');
    // Simple deterministic nullifier hash simulation to look authentic
    const nullifierSource = `nullifier_${formattedPass}_${attestationType}_${attestationType === 'initiative-vote' ? selectedVoteOption : 'attest'}`;
    let hash = 0;
    for (let i = 0; i < nullifierSource.length; i++) {
      hash = (hash << 5) - hash + nullifierSource.charCodeAt(i);
      hash |= 0;
    }
    const finalNullifier = '0x' + Math.abs(hash * 9999123).toString(16).padEnd(16, 'b') + 
                           Math.abs(hash * 4555891).toString(16).padStart(16, 'e');
    addProverLog(`  └─ Unique Nullifier Generated: ${finalNullifier.slice(0, 24)}...`, 'success');
    await new Promise(r => setTimeout(r, 500));

    addProverLog(`Structuring constraints for anonymous message payload...`, 'process');
    await new Promise(r => setTimeout(r, 600));

    addProverLog(`Solving elliptic curve bilinear pairings on BN254 curve...`, 'process');
    await new Promise(r => setTimeout(r, 800));

    // Assemble the simulated Cryptographic ZK Attestation
    const randomTxHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const randomLedger = Math.floor(12499200 + Math.random() * 800);
    const pseudonymId = Math.floor(100 + Math.random() * 899);

    const typesLabel = {
      'thank-you': '🌸 Thank You Attestation',
      'constructive': '💡 Constructive Suggestion',
      'warm-hug': '🤗 Warm Support Hug',
      'initiative-vote': '🗳️ Anonymous Initiative Vote'
    };

    let fullMsg = messageText.trim();
    let selectedOptionLabel = '';
    if (attestationType === 'initiative-vote') {
      const opt = poll.options.find(o => o.key === selectedVoteOption);
      selectedOptionLabel = opt ? opt.label : selectedVoteOption;
      fullMsg = `Voted anonymously for "${selectedOptionLabel}". ${messageText ? `Note attached: ${messageText}` : ''}`;
    } else if (!fullMsg) {
      fullMsg = `Sent a quiet wave of ${typesLabel[attestationType]} warmth!`;
    }

    const proofArtifact: Attestation = {
      id: 'att-' + Math.random().toString().slice(2, 8),
      category: attestationType,
      message: fullMsg,
      pseudonym: `Anonymous ${attestationType === 'thank-you' ? 'Healer' : attestationType === 'warm-hug' ? 'Supporter' : 'Member'} #${pseudonymId}`,
      txHash: randomTxHash.slice(0, 6) + '...' + randomTxHash.slice(-4),
      ledgerNo: randomLedger,
      timestamp: "Just now",
      provingSystem: provingSystem === 'groth16' ? 'Groth16 Snark' : 'RISC Zero STARK',
      proofSize: provingSystem === 'groth16' ? '340 bytes' : '256 KB',
      gasSpent: provingSystem === 'groth16' ? 12050 : 34800,
      voteValue: attestationType === 'initiative-vote' ? selectedOptionLabel : undefined,
      voteKey: attestationType === 'initiative-vote' ? selectedVoteOption : undefined,
      proofData: {
        merkleRoot: "0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962",
        nullifierHash: finalNullifier,
        proof_a: ['0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''), '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')],
        proof_b: [
          ['0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''), '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')],
          ['0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''), '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')]
        ],
        proof_c: ['0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''), '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')]
      }
    };

    setGeneratedAttestation(proofArtifact);
    addProverLog(`✨ ZK Cryptographic Proof generated successfully! Size: ${proofArtifact.proofSize}`, 'success');
    addProverLog(`Ready to broadcast to Stellar Soroban on-chain contract.`, 'success');
    setIsProving(false);
  };

  const submitOnChain = async () => {
    if (!generatedAttestation || isSubmittingOnChain) return;
    setIsSubmittingOnChain(true);

    addOnChainLog('Broadcasting transaction to Stellar Soroban public node...', 'info');
    await new Promise(r => setTimeout(r, 600));

    addOnChainLog('Validating zk-SNARK proof of membership on-chain...', 'process');
    addOnChainLog(`  ├─ Verifying Merkle Root: 0x8a92f0fc...`, 'info');
    addOnChainLog(`  ├─ checking Nullifier: ${generatedAttestation.proofData.nullifierHash.slice(0, 16)}...`, 'info');
    await new Promise(r => setTimeout(r, 700));

    addOnChainLog('Verification equation: e(A, B) == e(Alpha, Beta) passed!', 'success');
    addOnChainLog('On-chain state written: Attestation published successfully!', 'success');
    addOnChainLog(`Gas consumed: ${generatedAttestation.gasSpent} Soroban instructions (approx 0.0012 XLM fee)`, 'info');
    await new Promise(r => setTimeout(r, 500));

    // Commit vote in UI if voting
    if (generatedAttestation.category === 'initiative-vote') {
      setPoll(prev => {
        const targetKey = generatedAttestation.voteKey || selectedVoteOption;
        const updatedOptions = prev.options.map(opt => {
          if (opt.key === targetKey) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return { ...prev, options: updatedOptions };
      });
    }

    // Prepend to list
    setFeed(prev => [generatedAttestation, ...prev]);
    setMessageText('');
    setGeneratedAttestation(null);
    setIsSubmittingOnChain(false);
  };

  return (
    <div className="w-full bg-[#fafaf9] dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 shadow-md transition-all duration-300" id="stellar-zk-container">
      
      {/* Dr. T Header Panel with Socratic Warmth */}
      <div className="flex flex-col md:flex-row gap-5 items-start bg-white dark:bg-stone-850 p-6 rounded-2xl border border-rose-100/70 dark:border-stone-800/80 shadow-xs mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-400 via-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 text-2xl shadow-md border-2 border-white dark:border-stone-800">
          👩‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase font-mono bg-rose-500/10 px-2 py-0.5 rounded-md">
              Dr. T's Silent Circle
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 animate-spin" /> humble community zk active
            </span>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans font-medium">
            An anonymous feedback and voting portal where community members leave encrypted expressions of appreciation, share feedback, and vote on community initiatives completely privately using secure, low-fee Stellar zero-knowledge proofs.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create Attestation (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 shadow-xs">
            <h3 className="text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              Craft Your Sealed Attestation
            </h3>

            <div className="space-y-4">
              {/* Secret Membership Key Phrase */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Your Private Circle Passphrase
                  </label>
                  <button 
                    onClick={() => setShowKeyInfo(!showKeyInfo)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> Hints
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassphrase ? "text" : "password"}
                    value={memberPassphrase}
                    onChange={(e) => setMemberPassphrase(e.target.value)}
                    placeholder="Enter circle passphrase"
                    className="w-full text-xs px-3 py-2 pl-3 pr-20 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:border-rose-400 text-stone-800 dark:text-stone-200 font-bold transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
                      title={showPassphrase ? "Hide passphrase" : "Show passphrase"}
                    >
                      {showPassphrase ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {recognizedKeys.includes(memberPassphrase.trim().toLowerCase()) ? (
                      <Lock className="w-4 h-4 text-emerald-500 shrink-0" title="Recognized circle key!" />
                    ) : (
                      <Unlock className="w-4 h-4 text-rose-400 shrink-0" title="Unrecognized key" />
                    )}
                  </div>
                </div>

                {/* Status Validation Feedback */}
                <div className="mt-1.5 flex items-center gap-1.5">
                  {recognizedKeys.includes(memberPassphrase.trim().toLowerCase()) ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Recognized member of the Merkle Tree Circle (Private Leaf verified)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      Unrecognized secret. Proof generation will fail.
                    </span>
                  )}
                </div>

                {/* Pre-approved Passphrase Quick Selection Chips */}
                <div className="mt-2.5">
                  <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 block mb-1.5">
                    🔑 Approved Merkle Leaves (Click to select & test):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {recognizedKeys.map((key) => {
                      const isSelected = memberPassphrase.trim().toLowerCase() === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setMemberPassphrase(key)}
                          className={`text-[9px] px-2 py-0.5 rounded-md font-mono transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {key}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setMemberPassphrase('invalid-key')}
                      className={`text-[9px] px-2 py-0.5 rounded-md font-mono transition-all cursor-pointer border ${
                        memberPassphrase.trim().toLowerCase() === 'invalid-key'
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-300'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      ❌ test invalid
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showKeyInfo && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 text-[9px] text-stone-500 dark:text-stone-400 bg-amber-500/5 border border-amber-200/20 p-2.5 rounded-lg leading-relaxed"
                    >
                      💡 To generate a valid membership proof, your secret must match one of Dr. T's pre-approved leaves inside the circle's Merkle tree. 
                      Try one of these recognized phrases: <strong className="text-rose-500">warmth</strong>, <strong className="text-rose-500">tlc</strong>, <strong className="text-rose-500">stella</strong>, or <strong className="text-rose-500">zeniverse</strong>. Any other word will fail verification!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Attestation Type */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                  Attestation Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAttestationType('thank-you')}
                    className={`p-2 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-1 text-center ${
                      attestationType === 'thank-you'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    <span>🌸</span>
                    <span>Praise & Thanks</span>
                  </button>
                  <button
                    onClick={() => setAttestationType('constructive')}
                    className={`p-2 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-1 text-center ${
                      attestationType === 'constructive'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    <span>💡</span>
                    <span>Idea / Suggestion</span>
                  </button>
                  <button
                    onClick={() => setAttestationType('warm-hug')}
                    className={`p-2 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-1 text-center ${
                      attestationType === 'warm-hug'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    <span>🤗</span>
                    <span>Warm Support</span>
                  </button>
                  <button
                    onClick={() => setAttestationType('initiative-vote')}
                    className={`p-2 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-1 text-center ${
                      attestationType === 'initiative-vote'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    <span>🗳️</span>
                    <span>Initiative Vote</span>
                  </button>
                </div>
              </div>

              {/* Conditional Vote options */}
              <AnimatePresence>
                {attestationType === 'initiative-vote' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-stone-100 dark:border-stone-800 pt-3"
                  >
                    <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                      Select Your Vote Option <span className="text-rose-500 font-extrabold">(Encrypted on-chain)</span>
                    </label>
                    <div className="space-y-1.5">
                      {poll.options.map((opt) => (
                        <div 
                          key={opt.key}
                          onClick={() => setSelectedVoteOption(opt.key)}
                          className={`flex items-start justify-between gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all duration-200 select-none ${
                            selectedVoteOption === opt.key
                              ? 'bg-rose-500/5 border-rose-400 text-rose-800 dark:text-rose-200 font-extrabold shadow-2xs'
                              : 'bg-stone-50 dark:bg-stone-900 border-stone-150 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100/70 dark:hover:bg-stone-800/40'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="radio"
                              name="poll-option"
                              value={opt.key}
                              checked={selectedVoteOption === opt.key}
                              readOnly
                              className="mt-0.5 accent-rose-500 cursor-pointer h-3.5 w-3.5 shrink-0"
                            />
                            <span className="leading-tight">{opt.label}</span>
                          </div>
                          {selectedVoteOption === opt.key && (
                            <span className="text-[9px] font-mono text-rose-500 uppercase tracking-widest px-1.5 py-0.5 bg-rose-100/50 dark:bg-rose-950/20 rounded-md shrink-0">
                              Selected
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message text area */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                  {attestationType === 'initiative-vote' ? 'Add optional message to your vote' : 'Your Anonymous Message'}
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={
                    attestationType === 'thank-you' ? "Leave some sweet praise here..." :
                    attestationType === 'constructive' ? "What can we do to make this place warmer? Share gently..." :
                    attestationType === 'warm-hug' ? "Send silent support out to the universe..." :
                    "Optional message or reason for your vote..."
                  }
                  rows={3}
                  className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:border-rose-400 text-stone-800 dark:text-stone-200 resize-none font-medium"
                />
                
                {/* Interactive Suggestion Chips */}
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 block mb-1">
                    ✨ Quick Suggestions (Click to apply):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {attestationType === 'thank-you' && [
                      "Thank you for creating such a supportive and loving space!",
                      "I really appreciate Dr. T's kind wisdom and Taichi energy.",
                      "Grateful to be part of a community that values deep privacy."
                    ].map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMessageText(text)}
                        className="text-[9px] px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 rounded-lg text-stone-600 dark:text-stone-400 font-medium transition-all text-left truncate max-w-full cursor-pointer"
                      >
                        {text}
                      </button>
                    ))}

                    {attestationType === 'constructive' && [
                      "Would love to see more interactive workshops on mindfulness.",
                      "Maybe we can add a weekly check-in session for private sharing.",
                      "A shared quiet music stream would be a wonderful addition."
                    ].map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMessageText(text)}
                        className="text-[9px] px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 rounded-lg text-stone-600 dark:text-stone-400 font-medium transition-all text-left truncate max-w-full cursor-pointer"
                      >
                        {text}
                      </button>
                    ))}

                    {attestationType === 'warm-hug' && [
                      "Sending warmth, light, and peaceful vibes to everyone here today.",
                      "You are not alone. Wishing you a beautiful and gentle week ahead.",
                      "A quiet, warm wave of appreciation to this cozy neighborhood."
                    ].map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMessageText(text)}
                        className="text-[9px] px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 rounded-lg text-stone-600 dark:text-stone-400 font-medium transition-all text-left truncate max-w-full cursor-pointer"
                      >
                        {text}
                      </button>
                    ))}

                    {attestationType === 'initiative-vote' && [
                      "Supporting Option C because it empowers creative unboxing laureates!",
                      "Excited to see these wonderful ideas turn into reality on Stellar.",
                      "Let's bring more mindfulness and self-care into our daily routines!"
                    ].map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMessageText(text)}
                        className="text-[9px] px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 rounded-lg text-stone-600 dark:text-stone-400 font-medium transition-all text-left truncate max-w-full cursor-pointer"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prover System Selection */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                  Prover Circuit Framework
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setProvingSystem('groth16')}
                    className={`py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                      provingSystem === 'groth16'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-150 dark:border-stone-800 text-stone-500 hover:text-stone-850'
                    }`}
                  >
                    Groth16 (Lightweight SNARK)
                  </button>
                  <button
                    onClick={() => setProvingSystem('risczero')}
                    className={`py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                      provingSystem === 'risczero'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-150 dark:border-stone-800 text-stone-500 hover:text-stone-850'
                    }`}
                  >
                    RISC Zero (STARK)
                  </button>
                </div>
              </div>

              {/* Run button */}
              <button
                onClick={executeProver}
                disabled={isProving}
                className="w-full py-2.5 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md border border-rose-550/20"
              >
                {isProving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Hashing Merkle path...
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" /> Generate Membership Proof
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Execution Console, Proof Outputs & Verified Ledger Feed (span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Prover Console Output */}
          <div className="bg-stone-950 text-stone-200 p-5 rounded-2xl border border-stone-800 shadow-md font-mono text-[9.5px]">
            <div className="flex justify-between items-center border-b border-stone-800 pb-2 mb-2.5">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                Local ZK Proving Engine Console
              </span>
              <span className="text-[8.5px] text-stone-500 uppercase tracking-wider font-extrabold bg-stone-900 px-2 py-0.5 rounded-md">
                Secure Client Sandbox
              </span>
            </div>

            <div 
              ref={proverConsoleRef}
              className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1 scroll-smooth"
            >
              {provingLogs.length === 0 ? (
                <p className="text-stone-500 italic py-2">Console idle. Enter your private passphrase leaf and click "Generate Membership Proof" to build your cryptographic witness trace...</p>
              ) : (
                provingLogs.map((log) => (
                  <div key={log.id} className="flex gap-2 leading-relaxed animate-fadeIn">
                    <span className="text-stone-600 shrink-0">[{log.timestamp}]</span>
                    <span className={`font-black shrink-0 ${
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warn' ? 'text-rose-400 animate-pulse' :
                      log.type === 'process' ? 'text-amber-400' : 'text-stone-400'
                    }`}>
                      {log.type === 'success' ? '✔' : log.type === 'warn' ? '✖' : log.type === 'process' ? '⚙' : 'i'}
                    </span>
                    <span className={log.type === 'warn' ? 'text-rose-400 font-semibold' : log.type === 'success' ? 'text-stone-100' : 'text-stone-300'}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cryptographic Membership Proof Object */}
          <AnimatePresence>
            {generatedAttestation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 shadow-xs"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    Assembled ZK Cryptographic Proof
                  </h3>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase px-1.5 py-0.5 rounded-md">
                    Membership Verified
                  </span>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-150 dark:border-stone-800 font-mono text-[9px] text-stone-600 dark:text-stone-400 max-h-[120px] overflow-y-auto mb-4 custom-scrollbar">
                  <pre className="whitespace-pre-wrap leading-relaxed select-all">{JSON.stringify(generatedAttestation, null, 2)}</pre>
                </div>

                {/* Submit to Soroban Verifier Contract Button */}
                <button
                  onClick={submitOnChain}
                  disabled={isSubmittingOnChain}
                  className={`w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                    isSubmittingOnChain ? 'animate-pulse' : ''
                  }`}
                >
                  {isSubmittingOnChain ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying pairings on Soroban...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Anonymously to Stellar Ledger
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* On-Chain Verification Console Output */}
          <AnimatePresence>
            {onChainLogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-950 text-stone-200 p-5 rounded-2xl border border-stone-800 shadow-md font-mono text-[9.5px]"
              >
                <div className="flex justify-between items-center border-b border-stone-800 pb-2 mb-2.5">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Stellar Soroban Contract Verifier
                  </span>
                  <span className="text-[8.5px] text-emerald-400 font-extrabold bg-stone-900 px-2 py-0.5 rounded-md">
                    ON-CHAIN RUST CONTRACT
                  </span>
                </div>

                <div 
                  ref={onChainConsoleRef}
                  className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1"
                >
                  {onChainLogs.map((log) => (
                    <div key={log.id} className="flex gap-2 leading-relaxed animate-fadeIn">
                      <span className="text-stone-600 shrink-0">[{log.timestamp}]</span>
                      <span className={`font-black shrink-0 ${
                        log.type === 'success' ? 'text-emerald-400' :
                        log.type === 'warn' ? 'text-rose-400 animate-pulse' :
                        log.type === 'process' ? 'text-amber-400' : 'text-stone-400'
                      }`}>
                        {log.type === 'success' ? '✔' : log.type === 'warn' ? '✖' : log.type === 'process' ? '⚙' : 'i'}
                      </span>
                      <span className={log.type === 'success' ? 'text-emerald-300' : log.type === 'warn' ? 'text-rose-400' : 'text-stone-300'}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Sealed Warmth Attestations Live Feed */}
      <div className="mt-8 bg-white dark:bg-stone-850 p-6 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-rose-500" />
            Sealed Warmth Attestations Feed (Public Ledger)
          </h3>
          <span className="text-[8px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black tracking-widest uppercase px-2 py-0.5 rounded-md">
            Verified Soroban state
          </span>
        </div>

        <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
          {feed.map((att) => (
            <div 
              key={att.id}
              className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-150 dark:border-stone-800/80 hover:border-rose-200/40 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs">
                    {att.category === 'thank-you' ? '🌸' : att.category === 'constructive' ? '💡' : att.category === 'warm-hug' ? '🤗' : '🗳️'}
                  </span>
                  <span className="text-xs font-black text-stone-850 dark:text-stone-200">{att.pseudonym}</span>
                  <span className="text-[8px] bg-stone-200 dark:bg-stone-800 text-stone-500 font-extrabold uppercase px-1.5 py-0.5 rounded-md">
                    {att.provingSystem}
                  </span>
                </div>
                <span className="text-[9px] text-stone-400 font-medium">{att.timestamp}</span>
              </div>

              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-3 pr-4 font-medium italic">
                "{att.message}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/40 dark:border-stone-800/40 pt-2.5 font-mono text-[8.5px] text-stone-400">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span><strong className="text-stone-500">Stellar Tx:</strong> <span className="text-rose-500 font-bold">{att.txHash}</span></span>
                  <span><strong className="text-stone-500">Ledger:</strong> {att.ledgerNo}</span>
                  <span><strong className="text-stone-500">Nullifier:</strong> {att.proofData.nullifierHash.slice(0, 14)}...</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-extrabold uppercase tracking-wide">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified On-Chain</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stellar Initiative Polling Results (Bento panel) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Live Vote Standings */}
        <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-black text-stone-850 dark:text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              TLC Initiative Sealed Standings
            </h4>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">
              Live updates
            </span>
          </div>

          <p className="text-[10px] text-stone-500 mb-4 leading-relaxed">
            The encrypted vote counts derived from zero-knowledge on-chain submittals. Your vote increases the counter dynamically, without revealing which item you selected.
          </p>

          <div className="space-y-3.5">
            {poll.options.map((opt) => {
              const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
              const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              return (
                <div key={opt.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                    <span className="truncate max-w-[200px]">{opt.label}</span>
                    <span>{opt.votes} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-450 to-pink-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cryptographic Setup Details */}
        <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 shadow-xs">
          <h4 className="text-[10px] font-black text-stone-850 dark:text-stone-200 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            Silent Circle Merkle Tree Configuration
          </h4>

          <p className="text-[10px] text-stone-500 mb-3 leading-relaxed">
            Dr. T's community circle is represented by a 4-level deep cryptographic Merkle tree. Every recognized member holds a leaf value in this tree.
          </p>

          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 p-3.5 rounded-xl font-mono text-[9px] text-stone-700 dark:text-stone-400 space-y-2">
            <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-stone-800/80 pb-1.5 text-rose-500 font-black">
              <span>On-Chain Merkle Root:</span>
              <button 
                onClick={handleCopyMerkleRoot}
                className="text-stone-400 hover:text-stone-600 text-[8px] font-extrabold flex items-center gap-0.5 active:scale-95"
              >
                {copiedRoot ? "Copied!" : "Copy Root"}
              </button>
            </div>
            <div className="break-all font-semibold select-all text-stone-800 dark:text-stone-300 text-[8.5px] bg-stone-100 dark:bg-stone-950 p-1.5 rounded-lg border border-stone-200/20">
              0x8a92f0fc9e66b3bcf9143825a2df62e846067b55e3966fb94bcde83ee24f7962
            </div>
            <div className="space-y-1 text-stone-500 pt-1">
              <div className="flex justify-between">
                <span>Total Active Leaves:</span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">128 members</span>
              </div>
              <div className="flex justify-between">
                <span>Tree Depth:</span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">7 levels</span>
              </div>
              <div className="flex justify-between">
                <span>Hash Primitive:</span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">Poseidon (Snark-optimized)</span>
              </div>
              <div className="flex justify-between">
                <span>Soroban Contract Address:</span>
                <span className="font-semibold text-stone-700 dark:text-stone-300 font-mono truncate max-w-[120px]" title="CC6W7A7M4B4VPLZ6H67SOP7UCO6KRE76XZH77">
                  CC6W7A7M4B4VPLZ...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Explainer Tabbed Segment */}
      <div className="mt-8 bg-white dark:bg-stone-850 p-6 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 shadow-xs">
        <h3 className="text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-rose-500" />
          How do Anonymous Community Attestations work on Stellar?
        </h3>

        <div className="flex border-b border-stone-200 dark:border-stone-800 mb-4 gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('how')}
            className={`pb-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'how' ? 'text-rose-500 border-b-2 border-rose-500 font-extrabold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Basic flow
          </button>
          <button
            onClick={() => setActiveTab('stellar')}
            className={`pb-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'stellar' ? 'text-rose-500 border-b-2 border-rose-500 font-extrabold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Stellar Soroban Edge
          </button>
          <button
            onClick={() => setActiveTab('merkle')}
            className={`pb-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'merkle' ? 'text-rose-500 border-b-2 border-rose-500 font-extrabold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            The Merkle Proof
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'privacy' ? 'text-rose-500 border-b-2 border-rose-500 font-extrabold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Anti-Double Voting
          </button>
        </div>

        <div className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
          {activeTab === 'how' && (
            <div className="space-y-2">
              <p>
                Zero-Knowledge Membership proofs allow a user to prove they are an authorized part of a private group (like Dr. T's community) without revealing their personal name, public key, or exact sequence position.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200/50 dark:border-stone-800">
                  <h4 className="font-bold text-stone-850 dark:text-stone-200 text-[10px] uppercase mb-1">1. Keep Seed Private</h4>
                  <p className="text-[9px] leading-relaxed text-stone-500">Your private key passphrase is kept entirely inside your browser. It is hashed and never sent over the network.</p>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200/50 dark:border-stone-800">
                  <h4 className="font-bold text-stone-850 dark:text-stone-200 text-[10px] uppercase mb-1">2. Generate SNARK</h4>
                  <p className="text-[9px] leading-relaxed text-stone-500">The browser compiles a mathematical proof showing you hold a valid cryptographic path to the on-chain Merkle root.</p>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200/50 dark:border-stone-800">
                  <h4 className="font-bold text-stone-850 dark:text-stone-200 text-[10px] uppercase mb-1">3. Verify with Soroban</h4>
                  <p className="text-[9px] leading-relaxed text-stone-500">The smart contract verifies the Snark equations. If correct, the message is approved and written on-chain anonymously.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stellar' && (
            <div className="space-y-2">
              <p>
                Implementing this on Stellar has outstanding real-world advantages over legacy networks like Ethereum:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-[11px] text-stone-500">
                <li>
                  <strong>Micro-attestations:</strong> Stellar’s ultra-low transaction fees (fractions of a cent) allow members to leave warmth, feedback, and votes continuously without worrying about high gas costs.
                </li>
                <li>
                  <strong>Soroban Wasm Engine:</strong> High-performance execution makes on-chain pairings validation incredibly cheap, fast, and scalable.
                </li>
                <li>
                  <strong>Real-world Money Meets Identity:</strong> You can link these anonymous attestations to real stablecoin disbursements—like private community tipping, quadratic funding, or secret mutual aid distributions.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'merkle' && (
            <div className="space-y-2">
              <p>
                A Merkle Tree is a binary tree of cryptographic hashes. We place all 128 recognized circle public hashes at the bottom leaf layer. 
              </p>
              <p className="mt-1">
                To prove your membership without showing your position, you provide your leaf value and the hashes of the siblings on your path up to the <strong>Merkle Root</strong>. The ZK circuit hashes your inputs together, checks that the computed result exactly equals the on-chain root, and outputs a single <strong>Groth16 Snark proof object</strong> representing the correctness of this calculation.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-2">
              <p>
                How do we prevent a member from voting or posting spam 100 times if their identity is hidden? 
              </p>
              <p className="mt-1">
                We introduce a cryptographic value called a <strong>Nullifier</strong>. It is a unique hash derived from both your secret key and the specific action identifier (e.g., <code>H(passphrase, poll_id)</code>). 
              </p>
              <p className="mt-1">
                The smart contract maintains a registry of spent nullifiers. If a user tries to submit a second vote, the nullifier matches a previously spent entry and is rejected, yet no one can trace the nullifier back to your personal identity!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
