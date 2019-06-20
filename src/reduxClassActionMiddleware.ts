import {
  IAction,
} from './Interfaces';

import isPlainObject from './isPlainObject';

export const reduxClassActionMiddleware =
  (store: object) =>
    (next: (action: IAction) => void) =>
      (action: any) => {
        const _action = isPlainObject(action) ? action : {...action};
        const result = next(_action);
        return result;
      };

export default reduxClassActionMiddleware;