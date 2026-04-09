"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InitiationJob = {
  id: string;
  region: string;
  policy: string;
  status: "queued" | "optimized" | "scheduled" | "repairing" | "completed" | "failed";
  updatedAt: string;
};

type RepairAction = {
  id: string;
  jobId: string;
  action: string;
  result: "applied" | "pending" | "skipped";
  at: string;
};

const FALLBACK_JOBS: InitiationJob[] = [
  {
    id: "job-20260409-001",
    region: "us-east-1",
    policy: "sovereign-default",
    status: "completed",
    updatedAt: "2026-04-09T11:22:00Z",
  },
  {
    id: "job-20260409-002",
    region: "us-west-2",
    policy: "latency-first",
    status: "repairing",
    updatedAt: "2026-04-09T11:30:00Z",
  },
  {
    id: "job-20260409-003",
    region: "eu-central-1",
    policy: "cost-balanced",
    status: "scheduled",
    updatedAt: "2026-04-09T11:41:00Z",
  },
];

const FALLBACK_REPAIRS: RepairAction[] = [
  {
    id: "repair-7783",
    jobId: "job-20260409-002",
    action: "reschedule-drained-node",
    result: "applied",
    at: "2026-04-09T11:32:14Z",
  },
  {
    id: "repair-7784",
    jobId: "job-20260409-002",
    action: "rebalance-zone-allocation",
    result: "pending",
    at: "2026-04-09T11:33:48Z",
  },
];

const STATUS_TONE: Record<InitiationJob["status"], "default" | "secondary" | "destructive"> = {
  queued: "secondary",
  optimized: "secondary",
  scheduled: "default",
  repairing: "secondary",
  completed: "default",
  failed: "destructive",
};

const RESULT_TONE: Record<RepairAction["result"], "default" | "secondary"> = {
  applied: "default",
  pending: "secondary",
  skipped: "secondary",
};

function iso(value: string): string {
  return new Date(value).toLocaleString();
}

export function SovereignDashboard() {
  const [jobs, setJobs] = useState<InitiationJob[]>(FALLBACK_JOBS);
  const [repairs, setRepairs] = useState<RepairAction[]>(FALLBACK_REPAIRS);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SOVEREIGN_API;
    if (!baseUrl) {
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [jobsResponse, repairsResponse] = await Promise.all([
          fetch(`${baseUrl}/v1/ledger/initiation-jobs`, { signal: controller.signal }),
          fetch(`${baseUrl}/v1/ledger/repair-actions`, { signal: controller.signal }),
        ]);

        if (jobsResponse.ok) {
          setJobs(await jobsResponse.json());
        }
        if (repairsResponse.ok) {
          setRepairs(await repairsResponse.json());
        }
      } catch {
        // Keep fallback data so the dashboard stays usable in local demos.
      }
    };

    fetchData();
    const interval = window.setInterval(fetchData, 15_000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const summary = useMemo(() => {
    const completed = jobs.filter((job) => job.status === "completed").length;
    const repairing = jobs.filter((job) => job.status === "repairing").length;
    const failed = jobs.filter((job) => job.status === "failed").length;
    return {
      total: jobs.length,
      completed,
      repairing,
      failed,
    };
  }, [jobs]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total jobs</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.completed}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Repairing</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.repairing}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.failed}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Initiation ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-xs">{job.id}</TableCell>
                  <TableCell>{job.region}</TableCell>
                  <TableCell>{job.policy}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_TONE[job.status]}>{job.status}</Badge>
                  </TableCell>
                  <TableCell>{iso(job.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repair actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repair id</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell className="font-mono text-xs">{repair.id}</TableCell>
                  <TableCell className="font-mono text-xs">{repair.jobId}</TableCell>
                  <TableCell>{repair.action}</TableCell>
                  <TableCell>
                    <Badge variant={RESULT_TONE[repair.result]}>{repair.result}</Badge>
                  </TableCell>
                  <TableCell>{iso(repair.at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
