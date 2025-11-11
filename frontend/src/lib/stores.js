import { writable } from 'svelte/store';

export const estudiantes = writable([]);
export const loading = writable(false);
export const error = writable(null);
export const success = writable(null);
