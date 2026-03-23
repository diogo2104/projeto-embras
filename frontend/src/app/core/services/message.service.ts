import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AppMessageService {
  private readonly messageService = inject(MessageService);

  success(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  error(summary: string, detail: string): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }

  warn(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }
}
