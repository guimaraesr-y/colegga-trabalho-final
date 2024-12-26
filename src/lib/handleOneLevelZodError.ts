import { ZodError } from "zod";

/**
 * This function takes a ZodError object and returns a flattened object with the 
 * path names as keys and the error messages as values. If the error is not an
 * object (i.e. it's a single error on a primitive type), it returns the error
 * message as a string.
 * 
 * @example
 * handleOneLevelZodError({
 *   issues: [
 *     { path: ['name'], message: 'Name is required' },
 *     { path: ['age'], message: 'Age is required' },
 *   ],
 * }) // returns { 'name': 'Name is required', 'age': 'Age is required' }
 * 
 * @param {ZodError} error - The ZodError object to be flattened.
 * @returns {Record<string, string> | string} - The flattened object or error message.
 */
const handleOneLevelZodError = ({ issues }: ZodError<unknown>): Record<string, string> | string => {
  const formData: Record<string, string> = {};

  if (issues.length === 1 && issues[0].path.length < 1)
    return issues[0].message;

  issues.forEach(({ path, message }) => {
    formData[path.join('-')] = message;
  });

  return formData;
};

export default handleOneLevelZodError
