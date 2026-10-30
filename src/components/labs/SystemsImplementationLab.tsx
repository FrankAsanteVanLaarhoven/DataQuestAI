'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Layers,
  Cpu,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  Activity,
  Server,
  Network,
  Radio,
  Lock,
  Unlock,
  AlertTriangle,
  Terminal,
  GitFork,
  ArrowRight,
  Database,
  ShieldAlert,
} from 'lucide-react';

interface SystemsImplementationLabProps {
  week: number;
}

export const SystemsImplementationLab: React.FC<SystemsImplementationLabProps> = ({ week }) => {
  const { awardXp } = useAppStore();

  // Week 1: Dual-Mode Execution & Privilege Rings
  const [privilegeRing, setPrivilegeRing] = useState<'Ring3_User' | 'Ring0_Kernel'>('Ring3_User');
  const [activeSyscall, setActiveSyscall] = useState<'read' | 'write' | 'fork' | 'mmap'>('read');
  const [syscallLogs, setSyscallLogs] = useState<string[]>([
    'user_space: executing application instructions (Ring 3)',
    'user_space: loading register %rax with syscall number 0 (sys_read)',
    'cpu: executing SYSCALL instruction -> trap to kernel interrupt vector',
  ]);

  // Week 2: UNIX Process Tree & Fork/Exec Lifecycle
  const [parentPid] = useState(1040);
  const [childPid, setChildPid] = useState<number | null>(null);
  const [childState, setChildState] = useState<'UNSPAWNED' | 'RUNNING' | 'ZOMBIE' | 'REAPED'>('UNSPAWNED');

  // Week 3: Virtual Memory State
  const [virtualAddressHex, setVirtualAddressHex] = useState('0x00401A20');
  const [tlbHits, setTlbHits] = useState(14);
  const [tlbMisses, setTlbMisses] = useState(2);

  // Week 4: CPU Scheduler State
  const [schedulerPolicy, setSchedulerPolicy] = useState<'FCFS' | 'SJF' | 'RR'>('RR');
  const [quantum] = useState(4);

  // Week 5: Threads & Race Condition State
  const [sharedCounter, setSharedCounter] = useState(0);
  const [useMutex, setUseMutex] = useState(false);
  const [threadStatus, setThreadStatus] = useState<string | null>(null);

  // Week 6: Producer-Consumer Bounded Buffer
  const [bufferCapacity] = useState(5);
  const [bufferItems, setBufferItems] = useState<number[]>([101, 102]);

  // Week 7: Deadlock & Banker's Algorithm State
  const [availableResources] = useState([3, 3, 2]);
  const [bankerSafe, setBankerSafe] = useState(true);

  // Week 8: POSIX Pipe IPC
  const [pipeData, setPipeData] = useState('Newcastle Computing');
  const [pipeTransferred, setPipeTransferred] = useState(false);

  // Week 10: TCP Handshake State
  const [tcpState, setTcpState] = useState<'CLOSED' | 'SYN_SENT' | 'SYN_RECEIVED' | 'ESTABLISHED'>('CLOSED');

  // Week 11: Berkeley Sockets
  const [serverSocketState, setServerSocketState] = useState<'NONE' | 'SOCKET' | 'BOUND' | 'LISTENING' | 'ACCEPTED'>('NONE');

  const handleTriggerSyscall = () => {
    sound.playClick();
    setPrivilegeRing('Ring0_Kernel');
    const newLogs = [
      `user_space: loaded arguments (%rdi=fd, %rsi=buf, %rdx=count)`,
      `cpu: TRAP GATE triggered. Switched hardware CPL from Ring 3 to Ring 0.`,
      `kernel: executing sys_${activeSyscall}() in Ring 0 supervisor mode`,
      `kernel: returning result to user register %rax via SYSRET instruction`,
    ];
    setSyscallLogs(newLogs);
    setTimeout(() => {
      setPrivilegeRing('Ring3_User');
    }, 1200);
    sound.playSuccess();
    awardXp(20, `Executed POSIX sys_${activeSyscall}() system call trap`);
  };

  const handleForkProcess = () => {
    sound.playClick();
    const newPid = Math.floor(1041 + Math.random() * 100);
    setChildPid(newPid);
    setChildState('RUNNING');
    sound.playSuccess();
    awardXp(20, `Executed fork() creating child PID #${newPid} with Copy-on-Write`);
  };

  const handleChildExit = () => {
    sound.playClick();
    setChildState('ZOMBIE');
    sound.playError();
  };

  const handleReapProcess = () => {
    sound.playClick();
    setChildState('REAPED');
    sound.playSuccess();
    awardXp(25, `Reaped zombie process via waitpid() — PCB deallocated`);
  };

  const handleProduceItem = () => {
    sound.playClick();
    if (bufferItems.length < bufferCapacity) {
      setBufferItems([...bufferItems, Date.now() % 1000]);
      sound.playSuccess();
      awardXp(10, 'Produced item into bounded buffer (sem_wait empty)');
    } else {
      sound.playError();
    }
  };

  const handleConsumeItem = () => {
    sound.playClick();
    if (bufferItems.length > 0) {
      setBufferItems(bufferItems.slice(1));
      sound.playSuccess();
      awardXp(10, 'Consumed item from bounded buffer (sem_wait full)');
    } else {
      sound.playError();
    }
  };

  const handleRunThreads = () => {
    sound.playClick();
    if (useMutex) {
      setSharedCounter((prev) => prev + 2000);
      setThreadStatus('Thread 1 and Thread 2 synchronized with pthread_mutex_t. Expected: 2000, Actual: 2000 (Safe).');
      sound.playSuccess();
      awardXp(20, 'Synchronized threads with POSIX Mutex');
    } else {
      const corrupt = Math.floor(1340 + Math.random() * 200);
      setSharedCounter(corrupt);
      setThreadStatus(`RACE CONDITION DETECTED! Unsynchronized counter suffered lost updates. Expected: 2000, Actual: ${corrupt}.`);
      sound.playError();
    }
  };

  const handleStepTcp = () => {
    sound.playClick();
    if (tcpState === 'CLOSED') {
      setTcpState('SYN_SENT');
    } else if (tcpState === 'SYN_SENT') {
      setTcpState('SYN_RECEIVED');
    } else if (tcpState === 'SYN_RECEIVED') {
      setTcpState('ESTABLISHED');
      sound.playSuccess();
      awardXp(20, 'Completed TCP 3-Way Handshake');
    } else {
      setTcpState('CLOSED');
    }
  };

  const handleStepSocketServer = () => {
    sound.playClick();
    if (serverSocketState === 'NONE') setServerSocketState('SOCKET');
    else if (serverSocketState === 'SOCKET') setServerSocketState('BOUND');
    else if (serverSocketState === 'BOUND') setServerSocketState('LISTENING');
    else if (serverSocketState === 'LISTENING') {
      setServerSocketState('ACCEPTED');
      sound.playSuccess();
      awardXp(25, 'Accepted TCP client connection via accept() returning conn_fd');
    } else setServerSocketState('NONE');
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              CSC2035 Software Systems Design &amp; Implementation Lab
              <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                Week {week}
              </span>
            </h3>
            <p className="text-xs text-purple-200/80">Operating Systems, Memory Management, Concurrency &amp; TCP/IP Networks</p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-900/60 text-purple-300 font-bold border border-purple-600/60">
          30 Credits • Stage 2 Core
        </span>
      </div>

      {/* Week 1: Dual-Mode Execution & Privilege Rings */}
      {week === 1 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Hardware Dual-Mode Execution &amp; Syscall Trap Dispatcher</h4>
              <p className="text-[11px] text-slate-400">x86_64 Privilege Level Rings: Ring 3 (User Space) vs Ring 0 (Kernel Supervisor)</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              privilegeRing === 'Ring0_Kernel'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
            }`}>
              Current CPU Mode: {privilegeRing}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['read', 'write', 'fork', 'mmap'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => { setActiveSyscall(sc); sound.playClick(); }}
                className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                  activeSyscall === sc
                    ? 'border-purple-400 bg-purple-600/30 text-white font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                sys_{sc}()
              </button>
            ))}
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Execution Trace:</div>
            {syscallLogs.map((log, i) => (
              <div key={i} className={log.includes('TRAP') || log.includes('Ring 0') ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>

          <button
            onClick={handleTriggerSyscall}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5" /> Execute `syscall sys_{activeSyscall}()` Instruction
          </button>
        </div>
      )}

      {/* Week 2: Process Control & Fork/Exec Lifecycle */}
      {week === 2 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-200">POSIX Process Management: fork(), exec(), and waitpid()</h4>
              <p className="text-[11px] text-slate-400">Process Control Block (PCB) states, Copy-on-Write, and Zombie process reclamation</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-full border border-purple-700/60">
              Parent PID: #{parentPid}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Parent Process (PID #{parentPid})</span>
              <div className="text-emerald-400 font-bold">State: RUNNING (bash)</div>
              <div className="text-slate-400 text-[11px]">Virtual Memory: Code, Data, Heap, Stack</div>
              <button
                onClick={handleForkProcess}
                disabled={childState === 'RUNNING'}
                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <GitFork className="w-3.5 h-3.5" /> fork() New Child
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Child Process (PID #{childPid || '---'})</span>
              <div className={`font-bold ${
                childState === 'RUNNING' ? 'text-emerald-400' : childState === 'ZOMBIE' ? 'text-rose-400' : 'text-slate-500'
              }`}>
                State: {childState}
              </div>
              <div className="text-slate-400 text-[11px]">
                {childState === 'ZOMBIE' ? '⚠ Child exited. PCB retained in kernel table awaiting parent waitpid().' : 'Copy-on-Write sharing with parent.'}
              </div>
              <div className="flex gap-2 pt-1">
                {childState === 'RUNNING' && (
                  <button
                    onClick={handleChildExit}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                  >
                    child exit(0)
                  </button>
                )}
                {childState === 'ZOMBIE' && (
                  <button
                    onClick={handleReapProcess}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    parent waitpid()
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 3: Virtual Memory & Page Tables */}
      {week === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">32-Bit Virtual Address (Hex):</label>
              <input
                type="text"
                value={virtualAddressHex}
                onChange={(e) => setVirtualAddressHex(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-slate-700 text-xs font-mono text-white"
              />
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-purple-500/30 flex items-center justify-around font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">TLB HITS:</span>
                <span className="text-emerald-400 font-bold text-lg">{tlbHits}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TLB MISSES:</span>
                <span className="text-rose-400 font-bold text-lg">{tlbMisses}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">HIT RATIO:</span>
                <span className="text-purple-300 font-bold text-lg">
                  {Math.round((tlbHits / (tlbHits + tlbMisses)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-slate-400">MMU Address Translation Breakdown (4 KB Pages):</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded bg-purple-900/30 border border-purple-700/40">
                <span className="text-slate-400 block text-[9px]">PAGE DIR INDEX</span>
                <span className="text-purple-200 font-bold">Bits 22–31 (10 bits)</span>
              </div>
              <div className="p-2 rounded bg-purple-900/30 border border-purple-700/40">
                <span className="text-slate-400 block text-[9px]">PAGE TABLE INDEX</span>
                <span className="text-purple-200 font-bold">Bits 12–21 (10 bits)</span>
              </div>
              <div className="p-2 rounded bg-purple-900/30 border border-purple-700/40">
                <span className="text-slate-400 block text-[9px]">PAGE OFFSET</span>
                <span className="text-purple-200 font-bold">Bits 0–11 (12 bits)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 4: CPU Scheduling */}
      {week === 4 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {(['FCFS', 'SJF', 'RR'] as const).map((pol) => (
              <button
                key={pol}
                onClick={() => { setSchedulerPolicy(pol); sound.playClick(); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  schedulerPolicy === pol ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {pol === 'FCFS' && 'First-Come First-Served (FCFS)'}
                {pol === 'SJF' && 'Shortest Job First (SJF)'}
                {pol === 'RR' && `Round Robin (RR, Quantum=${quantum})`}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-slate-300">Simulated Process Execution Timeline:</div>
            <div className="flex items-center gap-1.5 h-8 w-full bg-slate-900 rounded-lg p-1 overflow-hidden font-mono text-[10px] text-white">
              <div className="bg-blue-600 h-full flex items-center justify-center px-3 rounded">P1 (0..8ms)</div>
              <div className="bg-emerald-600 h-full flex items-center justify-center px-3 rounded">P2 (8..12ms)</div>
              <div className="bg-amber-600 h-full flex items-center justify-center px-3 rounded">P3 (12..21ms)</div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Avg Turnaround: 13.6 ms</span>
              <span>Avg Waiting Time: 6.6 ms</span>
              <span>CPU Utilization: 100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Week 5: Concurrency, Threads & Race Conditions */}
      {week === 5 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-200">Shared Counter Variable (Heap):</span>
              <div className="text-2xl font-black font-mono text-purple-300">{sharedCounter}</div>
            </div>

            <button
              onClick={() => { setUseMutex(!useMutex); sound.playClick(); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer border ${
                useMutex
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : 'border-rose-500 bg-rose-500/20 text-rose-300'
              }`}
            >
              {useMutex ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {useMutex ? 'POSIX Mutex Lock: ENABLED' : 'POSIX Mutex Lock: DISABLED'}
            </button>
          </div>

          <button
            onClick={handleRunThreads}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5" /> Spawn 2 Concurrent Worker Threads (1,000 Increments Each)
          </button>

          {threadStatus && (
            <div className={`p-3 rounded-xl border font-mono text-xs ${
              useMutex ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
            }`}>
              {threadStatus}
            </div>
          )}
        </div>
      )}

      {/* Week 6: Producer-Consumer Bounded Buffer with Semaphores */}
      {week === 6 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Producer-Consumer Bounded Buffer with Counting Semaphores</h4>
              <p className="text-[11px] text-slate-400">
                sem_empty: {bufferCapacity - bufferItems.length} • sem_full: {bufferItems.length} • mutex: unlocked
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-full border border-purple-700/60">
              Capacity: {bufferCapacity} Slots
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {Array.from({ length: bufferCapacity }).map((_, idx) => {
              const item = bufferItems[idx];
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center font-mono transition-all ${
                    item !== undefined
                      ? 'bg-purple-900/40 border-purple-500/60 text-purple-200'
                      : 'bg-black/40 border-slate-800 text-slate-600'
                  }`}
                >
                  <span className="text-[9px] block text-slate-400">Slot[{idx}]</span>
                  <span className="text-xs font-bold">{item !== undefined ? `#${item}` : 'EMPTY'}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleProduceItem}
              disabled={bufferItems.length >= bufferCapacity}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Produce Item (sem_wait empty)
            </button>
            <button
              onClick={handleConsumeItem}
              disabled={bufferItems.length === 0}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Consume Item (sem_wait full)
            </button>
          </div>
        </div>
      )}

      {/* Week 7: Banker's Algorithm & Deadlock Safety */}
      {week === 7 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200">Dijkstra’s Banker’s Algorithm for Deadlock Avoidance</h4>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/40">
              State: SAFE SEQUENCE FOUND
            </span>
          </div>

          <div className="p-3 bg-black/50 border border-slate-800 rounded-xl font-mono text-xs space-y-2">
            <div className="text-slate-400">Available Resource Vector [A, B, C]: [{availableResources.join(', ')}]</div>
            <div className="text-slate-300">
              Discovered Safe Sequence: <span className="text-emerald-400 font-bold">&lt;P1 → P3 → P4 → P0 → P2&gt;</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Every process can satisfy its Max Need without triggering circular wait or resource starvation.
            </p>
          </div>
        </div>
      )}

      {/* Week 8: POSIX Pipe IPC Data Pipeline */}
      {week === 8 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200">Inter-Process Communication: Unidirectional POSIX Pipe</h4>
            <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-full border border-purple-700/60">
              pipe(fd[2])
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 flex-1 text-center">
              <span className="text-[10px] text-slate-400 block">Writer (fd[1])</span>
              <span className="text-indigo-300 font-bold">{pipeData}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 flex-1 text-center">
              <span className="text-[10px] text-slate-400 block">Reader (fd[0])</span>
              <span className="text-emerald-300 font-bold">{pipeTransferred ? pipeData : '(waiting for read())'}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setPipeTransferred(true);
              sound.playSuccess();
              awardXp(20, 'Transferred bytes through POSIX pipe buffer');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-sm"
          >
            write(fd[1]) → read(fd[0])
          </button>
        </div>
      )}

      {/* Week 10: TCP 3-Way Handshake */}
      {week === 10 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">TCP Protocol Connection State:</span>
            <span className="px-2.5 py-1 rounded-full font-mono text-xs font-bold bg-purple-900/60 border border-purple-500/40 text-purple-200">
              {tcpState}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className={`p-3 rounded-xl border ${tcpState === 'SYN_SENT' || tcpState === 'SYN_RECEIVED' || tcpState === 'ESTABLISHED' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              1. SYN (seq=100)
            </div>
            <div className={`p-3 rounded-xl border ${tcpState === 'SYN_RECEIVED' || tcpState === 'ESTABLISHED' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              2. SYN-ACK (seq=300, ack=101)
            </div>
            <div className={`p-3 rounded-xl border ${tcpState === 'ESTABLISHED' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              3. ACK (ack=301)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStepTcp}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Network className="w-3.5 h-3.5" /> Advance Handshake Step
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {tcpState === 'ESTABLISHED' ? '✓ Reliable TCP Byte Stream Ready' : 'Negotiating sequence numbers...'}
            </span>
          </div>
        </div>
      )}

      {/* Week 11: Berkeley Sockets Server/Client */}
      {week === 11 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200">POSIX Berkeley Socket API Server Lifecycle</h4>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/40 font-bold">
              Status: {serverSocketState}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            {[
              { id: 'SOCKET', label: '1. socket(AF_INET, SOCK_STREAM)' },
              { id: 'BOUND', label: '2. bind(ip, port=8080)' },
              { id: 'LISTENING', label: '3. listen(backlog=128)' },
              { id: 'ACCEPTED', label: '4. accept() -> conn_fd' },
            ].map((st, i) => {
              const order = ['SOCKET', 'BOUND', 'LISTENING', 'ACCEPTED'];
              const currentIdx = order.indexOf(serverSocketState);
              const isActive = currentIdx >= i;
              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-xl border ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {st.label}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStepSocketServer}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5" /> Step Berkeley Socket Lifecycle
          </button>
        </div>
      )}

      {/* Other weeks default sandbox */}
      {week !== 1 && week !== 2 && week !== 3 && week !== 4 && week !== 5 && week !== 6 && week !== 7 && week !== 8 && week !== 10 && week !== 11 && (
        <div className="p-4 rounded-xl bg-black/40 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400">Systems Design &amp; POSIX Engineering Sandbox</span>
            <span className="text-[10px] text-slate-400 font-mono">Status: Ready</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice systems programming and network protocol design. Decompose POSIX abstractions, investigate kernel scheduling, and verify hardware/software boundaries according to Newcastle University CSC2035 syllabus.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { sound.playSuccess(); awardXp(25, `Completed Week ${week} systems lab exercise`); }}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Verify Systems Invariant (+25 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
