import { Component, ElementRef, HostListener, ViewChild, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  template: `
    @if (auth.isAuthenticated()) {
      @if (open()) {
        <div
          class="fixed inset-x-4 bottom-24 z-50 flex h-[70vh] max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl transition-all duration-150 sm:inset-x-auto sm:right-6 sm:w-80"
        >
          <div class="flex items-center justify-between border-b border-neutral-200 bg-primary-600 px-4 py-3">
            <span class="text-sm font-semibold text-white">Shopping Assistant</span>
            <div class="flex items-center gap-3">
              @if (chat.messages().length > 0) {
                <button
                  type="button"
                  class="text-xs font-medium text-white/80 hover:text-white"
                  (click)="chat.clear()"
                  aria-label="Clear conversation"
                >
                  Clear
                </button>
              }
              <button
                type="button"
                class="text-white/80 hover:text-white"
                (click)="toggle()"
                aria-label="Close shopping assistant"
              >
                <app-icon name="close" svgClass="h-5 w-5" />
              </button>
            </div>
          </div>

          <div #scrollContainer class="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            @if (chat.messages().length === 0) {
              <p class="text-sm text-neutral-500">
                Ask me to find a product, tell you more about one, or add something to your cart.
              </p>
            }
            @for (message of chat.messages(); track $index) {
              <div
                class="max-w-[85%] whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm"
                [class.ml-auto]="message.role === 'user'"
                [class.bg-primary-500]="message.role === 'user'"
                [class.text-white]="message.role === 'user'"
                [class.bg-neutral-100]="message.role === 'assistant'"
                [class.text-neutral-800]="message.role === 'assistant'"
              >
                {{ message.content }}
              </div>
            }
            @if (chat.loading()) {
              <div class="flex items-center gap-1 rounded-xl bg-neutral-100 px-3 py-2 text-sm text-neutral-500 w-fit">
                <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"></span>
                <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]"></span>
                <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]"></span>
              </div>
            }
          </div>

          <form class="flex gap-2 border-t border-neutral-200 p-3" (ngSubmit)="send()">
            <input
              #chatInput
              type="text"
              name="chatInput"
              placeholder="Ask about products..."
              autocomplete="off"
              maxlength="2000"
              [(ngModel)]="draft"
              [disabled]="chat.loading()"
              class="flex-1 rounded-full border border-neutral-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              [disabled]="chat.loading() || !draft.trim()"
              class="rounded-full bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      }

      <button
        type="button"
        (click)="toggle()"
        class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-700"
        aria-label="Open shopping assistant"
      >
        <app-icon [name]="open() ? 'close' : 'chat'" svgClass="h-6 w-6" />
      </button>
    } @else if (open()) {
      <div
        class="fixed inset-x-4 bottom-24 z-50 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl text-sm text-neutral-700 sm:inset-x-auto sm:right-6 sm:w-72"
      >
        <p class="mb-3">Log in to chat with our shopping assistant.</p>
        <a routerLink="/login" class="font-medium text-primary-600 hover:text-primary-700" (click)="toggle()">
          Go to login &rarr;
        </a>
      </div>
      <button
        type="button"
        (click)="toggle()"
        class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700"
        aria-label="Open shopping assistant"
      >
        <app-icon [name]="open() ? 'close' : 'chat'" svgClass="h-6 w-6" />
      </button>
    }
  `,
})
export class ChatWidgetComponent {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') private chatInput?: ElementRef<HTMLInputElement>;

  readonly open = signal(false);
  draft = '';

  constructor(
    public auth: AuthService,
    public chat: ChatService
  ) {
    effect(() => {
      // Re-run whenever messages/loading change, then scroll to bottom.
      this.chat.messages();
      this.chat.loading();
      queueMicrotask(() => this.scrollToBottom());
    });

    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.chatInput?.nativeElement.focus());
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.chat.loading()) {
      return;
    }
    this.draft = '';
    this.chat.sendMessage(text).subscribe();
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
