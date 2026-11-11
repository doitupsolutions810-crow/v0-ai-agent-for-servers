"use client";
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const ContainerManager = () => {
  const [containers, setContainers] = useState<Array<{
    id: string;
    name: string;
    status: 'running' | 'stopped';
    createdAt: string;
  }>>([]);

  const createContainer = async () => {
    // This will be connected to Supabase backend later
    const newContainer = {
      id: Math.random().toString(36).substring(2, 9),
      name: `container-${Date.now()}`,
      status: 'running' as const,
      createdAt: new Date().toISOString()
    };
    setContainers([...containers, newContainer]);
  };

  return (
    <div className="space-y-4">
      <Button onClick={createContainer}>Create New Container</Button>
      
      <div className="grid gap-4">
        {containers.map(container => (
          <div key={container.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <h3>{container.name}</h3>
              <span>{container.status}</span>
            </div>
            <p>Created: {new Date(container.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};