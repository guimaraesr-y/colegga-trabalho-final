export async function handleError<T>(cb: () => T) {
  try {
    return await cb();
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};