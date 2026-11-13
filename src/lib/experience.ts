import { getCollection, type CollectionEntry } from 'astro:content';
import { gear, type Gear } from './equipment';

export type JobStatus = 'upcoming' | 'current' | 'done';
export type Job = CollectionEntry<'experience'> & {
  phase: string;
  status: JobStatus;
};

function startOf(date: string): Date {
  const [y, m, d = 1] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function endOf(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return d ? new Date(y, m - 1, d + 1) : new Date(y, m, 1);
}

export function getJobStatus(
  { start, end }: { start: string; end?: string },
  now = new Date(),
): JobStatus {
  if (now < startOf(start)) return 'upcoming';
  if (end && now >= endOf(end)) return 'done';
  return 'current';
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const numeral = (index: number) => NUMERALS[index] ?? String(index + 1);

export async function getJobs(): Promise<Job[]> {
  const jobs = await getCollection('experience');
  const oldestFirst = [...jobs].sort((a, b) =>
    a.data.start.localeCompare(b.data.start),
  );
  return oldestFirst
    .map((job, i) => ({
      ...job,
      phase: numeral(i),
      status: getJobStatus(job.data),
    }))
    .reverse();
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatMonth(date: string): string {
  const [year, month] = date.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function dateRange({ data, status }: Job): string {
  if (status === 'upcoming') return `Starts ${formatMonth(data.start)}`;
  return `${formatMonth(data.start)} - ${data.end ? formatMonth(data.end) : 'Present'}`;
}

export function gearForJob(job: Job): Gear[] {
  return job.data.tags
    .map((tag) => gear.find((item) => item.tags?.includes(tag)))
    .filter((item, i, all): item is Gear => !!item && all.indexOf(item) === i);
}

export function jobsForGear(item: Gear, jobs: Job[]): Job[] {
  const tags = item.tags ?? [];
  return jobs.filter(
    (job) =>
      job.status !== 'upcoming' &&
      job.data.tags.some((tag) => tags.includes(tag)),
  );
}
