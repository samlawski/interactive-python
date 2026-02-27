/* ===================================================================
   storage.js — localStorage wrapper for exercise state
   =================================================================== */

const PREFIX = 'pyex-';

/** Return the saved code for an exercise, or null. */
export function getCode(exerciseId) {
  return localStorage.getItem(`${PREFIX}${exerciseId}-code`);
}

/** Persist the current code for an exercise. */
export function saveCode(exerciseId, code) {
  localStorage.setItem(`${PREFIX}${exerciseId}-code`, code);
}

/** Return true if the exercise has been marked as done. */
export function isDone(exerciseId) {
  return localStorage.getItem(`${PREFIX}${exerciseId}-done`) === '1';
}

/** Mark an exercise as done (or not done). */
export function setDone(exerciseId, done = true) {
  if (done) {
    localStorage.setItem(`${PREFIX}${exerciseId}-done`, '1');
  } else {
    localStorage.removeItem(`${PREFIX}${exerciseId}-done`);
  }
}

/** Return true if the student has started working on the exercise. */
export function hasWorkedOn(exerciseId) {
  return localStorage.getItem(`${PREFIX}${exerciseId}-code`) !== null;
}

/** Clear all saved state for an exercise (code + done status). */
export function clearExercise(exerciseId) {
  localStorage.removeItem(`${PREFIX}${exerciseId}-code`);
  localStorage.removeItem(`${PREFIX}${exerciseId}-done`);
}
