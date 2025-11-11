import { writable } from 'svelte/store';

export const cursos = writable([]);
export const loadingCursos = writable(false);
export const errorCursos = writable(null);
export const successCursos = writable(null);
