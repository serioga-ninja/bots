import { App } from '../../index';

export abstract class ModuleBase {
  abstract register(app: App): void;
}
