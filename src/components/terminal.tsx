"use client";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useEffect, useRef } from 'react';
import 'xterm/css/xterm.css';

export const XTerminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal>();
  const fitAddon = useRef<FitAddon>();

  useEffect(() => {
    if (!terminalRef.current) return;

    terminal.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))'
      }
    });
    fitAddon.current = new FitAddon();
    
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.loadAddon(new WebLinksAddon());
    
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();
    
    terminal.current.writeln('Welcome to VM Terminal Hub');
    terminal.current.write('$ ');

    return () => {
      terminal.current?.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="h-full w-full" />;
};