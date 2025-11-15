"use client";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { XTerminal } from "@/components/terminal";
import { ContainerManager } from "@/components/container-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] min-h-screen p-4 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="row-start-1">
        <Tabs defaultValue="terminal" className="h-full">
          <TabsList>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="containers">Container Manager</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terminal" className="h-[calc(100%-40px)]">
            <XTerminal />
          </TabsContent>
          
          <TabsContent value="containers">
            <ContainerManager />
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />
    </div>
  );
}