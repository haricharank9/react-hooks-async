import { useRef } from 'react';
import axios from 'axios';
import { useAsyncTask } from './use-async-task';
import { useAsyncRun } from './use-async-run';
import { shallowArrayEqual } from './utils';

// this can be too naive
export const useMemoPrev = (create, deps) => {
  const memoized = useRef(null);
  const prevDeps = useRef(null);
  if (!prevDeps.current || !shallowArrayEqual(prevDeps.current, deps)) {
    prevDeps.current = deps;
    memoized.current = create();
  }
  return memoized.current;
};

export const useAsyncTaskAxios = config => useAsyncTask(
  (abortController) => {
    const source = axios.CancelToken.source();
    abortController.signal.addEventListener('abort', () => {
      source.cancel('canceled');
    });
    return axios({
      ...config,
      cancelToken: source.token,
    });
  },
  [config],
);

export const useAxios = (...args) => {
  const asyncTask = useAsyncTaskAxios(...args);
  useAsyncRun(asyncTask);
  return asyncTask;
};

export default useAsyncTaskAxios;
