
// Storage utilities for tracking message views
export interface MessagePayload {
  text: string;
  createdAt: string;
  ttl: number;
  maxViews: number;
}

export function getViewCount(msgId: string): number {
  const count = localStorage.getItem(`msg_views_${msgId}`);
  return count ? parseInt(count, 10) : 0;
}

export function incrementViewCount(msgId: string): number {
  const current = getViewCount(msgId);
  const newCount = current + 1;
  localStorage.setItem(`msg_views_${msgId}`, newCount.toString());
  return newCount;
}

export function isMessageDestroyed(msgId: string): boolean {
  return sessionStorage.getItem(`msg_destroyed_${msgId}`) === 'true';
}

export function markMessageDestroyed(msgId: string): void {
  sessionStorage.setItem(`msg_destroyed_${msgId}`, 'true');
}

export function isMessageExpired(payload: MessagePayload): boolean {
  const now = new Date().getTime();
  const createdAt = new Date(payload.createdAt).getTime();
  return now > (createdAt + payload.ttl * 1000);
}
