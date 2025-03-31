export interface HarvesterResults {
    hosts?: string[];
    ips?: string[];
    emails?: string[];
    shodan?: string[];
    dns?: string[];
    urls?: string[];
    vulnerabilities?: string[];
  }
  
  export interface ScanResult {
    id: string;
    domain: string;
    status: string;
    startTime: string;
    endTime?: string;
    results?: HarvesterResults;
  }
  
  export interface SSEEvent {
    event: 'completion' | 'error' | 'ping';
    data: any;
  }