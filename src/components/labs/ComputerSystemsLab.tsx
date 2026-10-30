'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Cpu,
  Layers,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Binary,
  Activity,
  Terminal,
  Shield,
  ArrowRight,
  Database,
} from 'lucide-react';

interface ComputerSystemsLabProps {
  week: number;
}

export const ComputerSystemsLab: React.FC<ComputerSystemsLabProps> = ({ week }) => {
  const { awardXp } = useAppStore();

  // Week 1 & 2: Number Systems & IEEE 754 State
  const [decimalInput, setDecimalInput] = useState<number>(-18);
  const [addOpA, setAddOpA] = useState<number>(95);
  const [addOpB, setAddOpB] = useState<number>(50);

  // Week 3, 4 & 5: Digital Logic State
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR' | 'FULL_ADDER'>('FULL_ADDER');
  const [gateInputA, setGateInputA] = useState<boolean>(true);
  const [gateInputB, setGateInputB] = useState<boolean>(false);
  const [gateInputCin, setGateInputCin] = useState<boolean>(true);

  // Week 6, 7 & 8: CPU & Assembly State
  const [cpuClockPhase, setCpuClockPhase] = useState<'FETCH' | 'DECODE' | 'EXECUTE'>('FETCH');
  const [cpuCycleCount, setCpuCycleCount] = useState<number>(0);
  const [cpuPC, setCpuPC] = useState<number>(0);
  const [cpuIR, setCpuIR] = useState<string>('MOV R1, #5');
  const [cpuACC, setCpuACC] = useState<number>(0);
  const [cpuRegisters, setCpuRegisters] = useState<{ R1: number; R2: number; R3: number }>({ R1: 5, R2: 3, R3: 0 });
  const [asmProgram, setAsmProgram] = useState<string>(
    'MOV R1, #5\nMOV R2, #3\nADD R3, R1, R2\nSUB R1, R1, #1\nCMP R1, #0'
  );
  const [activeInstructionIndex, setActiveInstructionIndex] = useState<number>(0);

  // Week 9 & 10: Cache & Virtual Memory State
  const [memAddressInput, setMemAddressInput] = useState<string>('0x00403018');
  const [cacheAssociativity, setCacheAssociativity] = useState<number>(4); // 4-way
  const [cacheHistory, setCacheHistory] = useState<{ address: string; tag: string; set: number; offset: number; status: 'HIT' | 'MISS' }[]>([
    { address: '0x00403018', tag: '0x00403', set: 0, offset: 24, status: 'MISS' },
  ]);

  // Week 11 & 12: Process Scheduling State
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [schedulerTicks, setSchedulerTicks] = useState<number>(0);
  const [processes, setProcesses] = useState<{ id: string; name: string; burst: number; remaining: number; state: 'ready' | 'running' | 'done' }[]>([
    { id: 'p1', name: 'Process 1 (Compiler)', burst: 6, remaining: 6, state: 'ready' },
    { id: 'p2', name: 'Process 2 (Database)', burst: 4, remaining: 4, state: 'ready' },
    { id: 'p3', name: 'Process 3 (Web Server)', burst: 2, remaining: 2, state: 'ready' },
  ]);

  // Helper Calculations for Week 1 & 2
  const toTwoComp8 = (val: number) => {
    const clamped = Math.max(-128, Math.min(127, val));
    const u8 = (clamped < 0 ? (256 + clamped) : clamped) & 0xff;
    return u8.toString(2).padStart(8, '0');
  };

  const toHex8 = (val: number) => {
    const clamped = Math.max(-128, Math.min(127, val));
    const u8 = (clamped < 0 ? (256 + clamped) : clamped) & 0xff;
    return '0x' + u8.toString(16).toUpperCase().padStart(2, '0');
  };

  // Addition with Overflow Flag calculation
  const sumVal = addOpA + addOpB;
  const isOverflow = (addOpA > 0 && addOpB > 0 && sumVal > 127) || (addOpA < 0 && addOpB < 0 && sumVal < -128);

  // Logic Gate Evaluation
  const evalGate = () => {
    const a = gateInputA ? 1 : 0;
    const b = gateInputB ? 1 : 0;
    const cin = gateInputCin ? 1 : 0;

    if (selectedGate === 'AND') return { out1: (a && b) ? 1 : 0, name1: 'Output (Q)' };
    if (selectedGate === 'OR') return { out1: (a || b) ? 1 : 0, name1: 'Output (Q)' };
    if (selectedGate === 'NAND') return { out1: !(a && b) ? 1 : 0, name1: 'Output (Q)' };
    if (selectedGate === 'NOR') return { out1: !(a || b) ? 1 : 0, name1: 'Output (Q)' };
    if (selectedGate === 'XOR') return { out1: (a ^ b) ? 1 : 0, name1: 'Output (Q)' };
    if (selectedGate === 'FULL_ADDER') {
      const sum = a ^ b ^ cin;
      const cout = (a & b) | (cin & (a ^ b));
      return { out1: sum, name1: 'Sum (S)', out2: cout, name2: 'Carry Out (Cout)' };
    }
    return { out1: 0, name1: 'Output' };
  };

  // CPU Step Execution
  const handleCpuStep = () => {
    sound.playClick();
    const lines = asmProgram.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    if (cpuClockPhase === 'FETCH') {
      const nextInstr = lines[activeInstructionIndex % lines.length];
      setCpuIR(nextInstr);
      setCpuPC((prev) => prev + 4);
      setCpuClockPhase('DECODE');
    } else if (cpuClockPhase === 'DECODE') {
      setCpuClockPhase('EXECUTE');
    } else {
      // EXECUTE
      const instr = cpuIR.trim().toUpperCase();
      if (instr.startsWith('MOV R1')) {
        setCpuRegisters((prev) => ({ ...prev, R1: 5 }));
      } else if (instr.startsWith('MOV R2')) {
        setCpuRegisters((prev) => ({ ...prev, R2: 3 }));
      } else if (instr.startsWith('ADD R3')) {
        setCpuRegisters((prev) => ({ ...prev, R3: prev.R1 + prev.R2 }));
        setCpuACC(cpuRegisters.R1 + cpuRegisters.R2);
      } else if (instr.startsWith('SUB R1')) {
        setCpuRegisters((prev) => ({ ...prev, R1: Math.max(0, prev.R1 - 1) }));
      }

      setCpuCycleCount((prev) => prev + 1);
      setActiveInstructionIndex((prev) => (prev + 1) % lines.length);
      setCpuClockPhase('FETCH');
      awardXp(5, 'Stepped CPU clock cycle');
    }
  };

  // Cache Access Simulator
  const handleSimulateCacheAccess = () => {
    sound.playClick();
    const cleanAddr = memAddressInput.trim();
    const num = parseInt(cleanAddr, 16);
    if (isNaN(num)) return;

    const offset = num & 0x3f; // 6 bits = 64 bytes
    const setIdx = (num >> 6) & 0xff; // 8 bits = 256 sets
    const tag = '0x' + (num >> 14).toString(16).toUpperCase();

    // Random hit/miss with 80% hit probability on repeated accesses
    const exists = cacheHistory.some((h) => h.tag === tag && h.set === setIdx);
    const isHit = exists;

    setCacheHistory((prev) => [
      { address: cleanAddr, tag, set: setIdx, offset, status: isHit ? 'HIT' : 'MISS' },
      ...prev.slice(0, 7),
    ]);

    if (isHit) sound.playSuccess();
    awardXp(10, 'Executed Cache Address Lookup');
  };

  // Scheduler Step
  const handleSchedulerTick = () => {
    sound.playClick();
    setProcesses((prev) => {
      const activeIdx = prev.findIndex((p) => p.remaining > 0);
      if (activeIdx === -1) return prev;

      return prev.map((p, idx) => {
        if (idx === activeIdx) {
          const rem = Math.max(0, p.remaining - 1);
          return {
            ...p,
            remaining: rem,
            state: rem === 0 ? 'done' : 'running',
          };
        }
        return {
          ...p,
          state: p.remaining === 0 ? 'done' : 'ready',
        };
      });
    });
    setSchedulerTicks((prev) => prev + 1);
  };

  const gateResult = evalGate();

  return (
    <div className="space-y-4">
      {/* Week 1 & 2: Number Systems & Floating-Point Lab */}
      {(week === 1 || week === 2) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-800/50 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Binary className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-black text-cyan-200">
                Two’s Complement, Binary Radix &amp; IEEE 754 Bitfield Dissector
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              Hardware Arithmetic Lab
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Value Converter */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Signed Integer Input:</span>
                <input
                  type="number"
                  value={decimalInput}
                  onChange={(e) => setDecimalInput(parseInt(e.target.value) || 0)}
                  className="w-24 p-1.5 text-center font-mono text-xs rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">8-Bit Two’s Comp:</span>
                  <span className="text-cyan-300 font-black tracking-widest">{toTwoComp8(decimalInput)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Hexadecimal:</span>
                  <span className="text-amber-300 font-black">{toHex8(decimalInput)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Sign Bit:</span>
                  <span className={decimalInput < 0 ? 'text-rose-400 font-black' : 'text-emerald-400 font-black'}>
                    {decimalInput < 0 ? '1 (Negative)' : '0 (Positive)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Overflow Detector */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                8-Bit Addition &amp; Hardware Overflow (V) Flag:
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block">Operand A:</label>
                  <input
                    type="number"
                    value={addOpA}
                    onChange={(e) => setAddOpA(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 text-center font-mono rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Operand B:</label>
                  <input
                    type="number"
                    value={addOpB}
                    onChange={(e) => setAddOpB(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 text-center font-mono rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                isOverflow
                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              }`}>
                <span>
                  Sum: <strong>{sumVal}</strong> ({toTwoComp8(sumVal)})
                </span>
                <span className="font-bold">
                  {isOverflow ? '⚠️ OVERFLOW (V=1)' : '✓ VALID (V=0)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 3, 4 & 5: Digital Logic & ALU Builder */}
      {(week === 3 || week === 4 || week === 5) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-800/50 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-black text-amber-200">
                Interactive Digital Logic Gates &amp; 1-Bit Full-Adder Breadboard
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              Circuit Synthesis Lab
            </span>
          </div>

          {/* Gate Selector Bar */}
          <div className="flex flex-wrap gap-1.5">
            {(['AND', 'OR', 'NAND', 'NOR', 'XOR', 'FULL_ADDER'] as const).map((gate) => (
              <button
                key={gate}
                onClick={() => {
                  setSelectedGate(gate);
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGate === gate
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {gate.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Circuit Interactive Breadboard */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Input Switches */}
            <div className="space-y-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Input Pins (TTL Logic):
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setGateInputA(!gateInputA)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                    gateInputA ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Pin A: {gateInputA ? 'HIGH (1)' : 'LOW (0)'}
                </button>
                <button
                  onClick={() => setGateInputB(!gateInputB)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                    gateInputB ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Pin B: {gateInputB ? 'HIGH (1)' : 'LOW (0)'}
                </button>
                {selectedGate === 'FULL_ADDER' && (
                  <button
                    onClick={() => setGateInputCin(!gateInputCin)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                      gateInputCin ? 'bg-purple-500 text-white border-purple-400' : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    Cin: {gateInputCin ? '1' : '0'}
                  </button>
                )}
              </div>
            </div>

            {/* Gate Diagram Center */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-14 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400 flex items-center justify-center font-black text-sm text-amber-300 shadow-md">
                {selectedGate}
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600" />
            </div>

            {/* Output Lines */}
            <div className="space-y-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Measured Outputs:
              </span>
              <div className="flex gap-2">
                <div className={`p-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                  gateResult.out1 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span>{gateResult.name1}:</span>
                  <span className="font-black text-sm">{gateResult.out1}</span>
                </div>
                {gateResult.out2 !== undefined && (
                  <div className={`p-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                    gateResult.out2 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <span>{gateResult.name2}:</span>
                    <span className="font-black text-sm">{gateResult.out2}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 6, 7 & 8: CPU Fetch-Decode-Execute & Assembly Simulator */}
      {(week === 6 || week === 7 || week === 8) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-800/50 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-black text-purple-200">
                Von Neumann CPU Datapath &amp; Assembly Instruction Simulator
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                Cycle: {cpuCycleCount}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold">
                Phase: {cpuClockPhase}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CPU Registers */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Internal CPU Registers:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">PC (Program Counter)</span>
                  <span className="text-cyan-300 font-bold">0x{cpuPC.toString(16).padStart(4, '0')}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">ACC (Accumulator)</span>
                  <span className="text-amber-300 font-bold">{cpuACC}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Register R1</span>
                  <span className="text-emerald-300 font-bold">{cpuRegisters.R1}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Register R2</span>
                  <span className="text-emerald-300 font-bold">{cpuRegisters.R2}</span>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
                <span className="text-[10px] text-slate-500 block">IR (Instruction Register)</span>
                <span className="text-purple-300 font-bold">{cpuIR}</span>
              </div>
            </div>

            {/* Instruction Memory Program */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Assembly Instructions:</span>
                <button
                  onClick={handleCpuStep}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Step Clock ({cpuClockPhase})
                </button>
              </div>

              <div className="space-y-1 font-mono text-xs">
                {asmProgram.split('\n').map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded px-2.5 flex items-center justify-between ${
                      idx === activeInstructionIndex
                        ? 'bg-purple-900/60 border border-purple-500 text-white font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span>{line}</span>
                    <span className="text-[10px] text-slate-500">Address 0x{(idx * 4).toString(16).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 9 & 10: Cache Design & Virtual Memory Lab */}
      {(week === 9 || week === 10) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-800/50 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-black text-emerald-200">
                4-Way Set-Associative Cache Address Partitioning &amp; Hit Analyzer
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Memory Hierarchy Lab
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="text-[10px] text-slate-400 block mb-1">Enter 32-Bit Memory Address (Hex):</label>
                <input
                  type="text"
                  value={memAddressInput}
                  onChange={(e) => setMemAddressInput(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-300 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSimulateCacheAccess}
                className="w-full sm:w-auto px-4 py-2 mt-4 sm:mt-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Activity className="w-4 h-4" /> Simulate Cache Lookup
              </button>
            </div>

            {/* Partition breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Tag Field (18 Bits)</span>
                <span className="text-emerald-400 font-bold">0x00403</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Set Index (8 Bits)</span>
                <span className="text-amber-400 font-bold">Set 0 (00000000)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Block Offset (6 Bits)</span>
                <span className="text-cyan-400 font-bold">Byte 24 (64B Line)</span>
              </div>
            </div>

            {/* Access History */}
            <div className="space-y-1 text-xs font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Recent Cache Access Stream:</span>
              {cacheHistory.map((h, i) => (
                <div key={i} className="p-1.5 rounded px-2.5 bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span>Addr: {h.address} [Tag: {h.tag}, Set: {h.set}, Offset: {h.offset}]</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    h.status === 'HIT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Week 11 & 12: OS Process Scheduling & Concurrency */}
      {(week === 11 || week === 12) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-800/50 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-black text-indigo-200">
                Round-Robin CPU Process Scheduling &amp; Preemption Simulator
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                Scheduler Ticks: {schedulerTicks}
              </span>
              <button
                onClick={handleSchedulerTick}
                className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3" /> Step Time Quantum (Q={timeQuantum})
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {processes.map((proc) => {
              const progressPct = ((proc.burst - proc.remaining) / proc.burst) * 100;
              return (
                <div key={proc.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{proc.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      proc.state === 'running'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : proc.state === 'done'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {proc.state.toUpperCase()} • {proc.remaining} / {proc.burst} Ticks Left
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        proc.state === 'done' ? 'bg-emerald-400' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
