import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../models/chat.model';

const HISTORY_LIMIT = 20;

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = environment.apiBaseUrl;

  private readonly messagesSignal = signal<ChatMessage[]>([]);
  readonly messages = this.messagesSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {}

  sendMessage(text: string): Observable<ChatMessage[]> {
    const userMessage: ChatMessage = { role: 'user', content: text };
    this.messagesSignal.update((messages) => [...messages, userMessage]);
    this.loadingSignal.set(true);

    // Cap the history sent to the server to bound payload/token size.
    const historyToSend = this.messagesSignal().slice(-HISTORY_LIMIT);

    return this.http.post<{ reply: string }>(`${this.baseUrl}/chat`, { messages: historyToSend }).pipe(
      tap((res) =>
        this.messagesSignal.update((messages) => [...messages, { role: 'assistant', content: res.reply }])
      ),
      map(() => this.messagesSignal()),
      catchError((error: unknown) => {
        const fallback = 'Sorry, something went wrong. Please try again.';
        const message =
          error instanceof HttpErrorResponse && typeof error.error?.reply === 'string'
            ? error.error.reply
            : fallback;
        this.messagesSignal.update((messages) => [...messages, { role: 'assistant', content: message }]);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  clear(): void {
    this.messagesSignal.set([]);
  }
}
