import { interruptCheckpoints } from '../data/prompts';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleInterruptNotifications(): number[] {
  const timeouts: number[] = [];
  const now = new Date();

  for (const checkpoint of interruptCheckpoints) {
    const [h, m] = checkpoint.time.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    const diff = target.getTime() - now.getTime();
    if (diff > 0 && Notification.permission === 'granted') {
      const tid = window.setTimeout(() => {
        new Notification('Interrupt Check', {
          body: checkpoint.questions[0],
          icon: '/favicon.svg',
          tag: checkpoint.id,
        });
      }, diff);
      timeouts.push(tid);
    }
  }

  return timeouts;
}

export function getNextCheckpoint(): { id: string; time: string; label: string; minutesUntil: number } | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const cp of interruptCheckpoints) {
    const [h, m] = cp.time.split(':').map(Number);
    const cpMinutes = h * 60 + m;
    if (cpMinutes > nowMinutes) {
      return { ...cp, minutesUntil: cpMinutes - nowMinutes };
    }
  }
  return null;
}

export function getCheckpointStatus(time: string): 'past' | 'current' | 'future' {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [h, m] = time.split(':').map(Number);
  const cpMinutes = h * 60 + m;

  if (cpMinutes < nowMinutes - 30) return 'past';
  if (cpMinutes <= nowMinutes + 15) return 'current';
  return 'future';
}
