"use client";
import { MadeWithDyad } from "@/components/made-with-dyad";
import dynamic from "next/dynamic";
import { ContainerManager } from "@/components/container-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SovereignDashboard } from "@/components/sovereign-dashboard";

// xterm touches `self` at import time, so the terminal must never be prerendered on the server.
const XTerminal = dynamic(() => import("@/components/terminal").then((m) => m.XTerminal), { ssr: false });

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] min-h-screen p-4 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="row-start-1">
        <Tabs defaultValue="terminal" className="h-full">
          <TabsList>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="containers">Container Manager</TabsTrigger>
            <TabsTrigger value="sovereign">Sovereign Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terminal" className="h-[calc(100%-40px)]">
            <XTerminal />
          </TabsContent>
          
          <TabsContent value="containers">
            <ContainerManager />
          </TabsContent>

          <TabsContent value="sovereign">
            <SovereignDashboard />
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />
    </div>
  );
}