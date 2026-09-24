'use client';

import React, { useState } from 'react';
import { Cloud, Server, Database, Cpu, Activity, AlertTriangle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const CloudScalingLab: React.FC = () => {
  const [trafficUsers, setTrafficUsers] = useState<number>(100);
  const [hasLoadBalancer, setHasLoadBalancer] = useState<boolean>(false);
  const [hasReadReplicas, setHasReadReplicas] = useState<boolean>(false);
  const [hasRedisCache, setHasRedisCache] = useState<boolean>(false);
  const [hasMessageQueue, setHasMessageQueue] = useState<boolean>(false);
  const [hasObjectStorage, setHasObjectStorage] = useState<boolean>(false);

  // Compute system metrics based on traffic vs components
  let rawLoadFactor = trafficUsers / 100;
  if (hasLoadBalancer) rawLoadFactor *= 0.55;
  if (hasReadReplicas) rawLoadFactor *= 0.45;
  if (hasRedisCache) rawLoadFactor *= 0.35;
  if (hasMessageQueue) rawLoadFactor *= 0.65;
  if (hasObjectStorage) rawLoadFactor *= 0.75;

  const latencyMs = Math.max(1.2, Math.round(rawLoadFactor * 2.8 * 10) / 10);
  const cpuPercent = Math.min(100, Math.round(rawLoadFactor * 8.5));
  const isOverloaded = cpuPercent > 85;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 text-xs font-black uppercase tracking-wider mb-2 border border-indigo-800">
            <Cloud className="w-3.5 h-3.5" /> Distributed Systems Architecture
          </div>
          <h3 className="text-xl font-black text-white">
            Cloud Computing: Horizontal Scaling &amp; High-Availability Simulation
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Experience why distributed cloud architectures exist. Increase concurrency to simulate peak load spikes, observe database thread exhaustion, and architect resilient cloud tiers.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-indigo-300 self-start sm:self-center">
          PaaS / IaaS Scalability
        </span>
      </div>

      {/* Traffic Control & Metrics Bar */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-300">
            Simulated Concurrent User Traffic: <span className="text-cyan-400 font-mono text-base">{trafficUsers.toLocaleString()} Users</span>
          </label>
          <div className="flex items-center gap-2">
            {[100, 1000, 10000, 50000, 100000].map((count) => (
              <button
                key={count}
                onClick={() => setTrafficUsers(count)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                  trafficUsers === count
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {count >= 1000 ? `${count / 1000}k` : count}
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="100"
          max="100000"
          step="500"
          value={trafficUsers}
          onChange={(e) => setTrafficUsers(Number(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />

        {/* Live Cluster Health Telemetry */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Latency */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">p95 Latency</span>
            <div className={`text-xl font-mono font-black ${latencyMs > 50 ? 'text-rose-400 animate-pulse' : latencyMs > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {latencyMs} ms
            </div>
            <span className="text-[10px] text-slate-500">Target: &lt; 20 ms</span>
          </div>

          {/* CPU Load */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Database CPU Load</span>
            <div className={`text-xl font-mono font-black ${cpuPercent > 85 ? 'text-rose-500' : cpuPercent > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {cpuPercent}%
            </div>
            <span className="text-[10px] text-slate-500">{isOverloaded ? 'CPU Throttling!' : 'Normal Capacity'}</span>
          </div>

          {/* Health Status */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cluster Health</span>
            <div className={`text-sm font-bold flex items-center gap-1.5 mt-1 ${isOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isOverloaded ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Service Degradation
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Healthy (99.99%)
                </>
              )}
            </div>
          </div>

          {/* Active Tiers */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Cloud Tiers</span>
            <div className="text-base font-mono font-bold text-indigo-400 mt-1">
              {[hasLoadBalancer, hasReadReplicas, hasRedisCache, hasMessageQueue, hasObjectStorage].filter(Boolean).length + 1} Tiers Active
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Components Provisioning Matrix */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300">
          Architectural Scalability Components (Toggle to Provision):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Load Balancer */}
          <div
            onClick={() => setHasLoadBalancer(!hasLoadBalancer)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              hasLoadBalancer
                ? 'bg-slate-950 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                1. Load Balancer (ALB)
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasLoadBalancer ? 'bg-indigo-950 text-indigo-300' : 'bg-slate-900 text-slate-500'}`}>
                {hasLoadBalancer ? 'PROVISIONED' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Evenly distributes TCP/HTTP ingress traffic across multiple availability zones (AZs).
            </p>
          </div>

          {/* 2. Read Replicas */}
          <div
            onClick={() => setHasReadReplicas(!hasReadReplicas)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              hasReadReplicas
                ? 'bg-slate-950 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" />
                2. Read Replicas (PostgreSQL)
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasReadReplicas ? 'bg-purple-950 text-purple-300' : 'bg-slate-900 text-slate-500'}`}>
                {hasReadReplicas ? 'PROVISIONED' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Offloads heavy analytical SELECT queries from the primary transactional write master.
            </p>
          </div>

          {/* 3. In-Memory Redis Cache */}
          <div
            onClick={() => setHasRedisCache(!hasRedisCache)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              hasRedisCache
                ? 'bg-slate-950 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                3. Redis In-Memory Cache
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasRedisCache ? 'bg-amber-950 text-amber-300' : 'bg-slate-900 text-slate-500'}`}>
                {hasRedisCache ? 'PROVISIONED' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Caches hot product and user session keys in RAM, serving responses in sub-millisecond times.
            </p>
          </div>

          {/* 4. Message Queue (Kafka/RabbitMQ) */}
          <div
            onClick={() => setHasMessageQueue(!hasMessageQueue)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              hasMessageQueue
                ? 'bg-slate-950 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                4. Asynchronous Queue (Kafka)
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasMessageQueue ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>
                {hasMessageQueue ? 'PROVISIONED' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Decouples write surges and orders into an append-only log, smoothing out database load spikes.
            </p>
          </div>

          {/* 5. Object Storage (S3 / GCS) */}
          <div
            onClick={() => setHasObjectStorage(!hasObjectStorage)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              hasObjectStorage
                ? 'bg-slate-950 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-white flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-cyan-400" />
                5. Object Storage (S3 / Cloud)
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasObjectStorage ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-900 text-slate-500'}`}>
                {hasObjectStorage ? 'PROVISIONED' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Stores static assets, PDF invoices, and photos on object storage instead of relational BLOBs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
