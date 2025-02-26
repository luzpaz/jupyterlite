// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Application, IPlugin } from '@lumino/application';

import { LiteServiceManager } from './service';

export type JupyterLiteServerPlugin<T> = IPlugin<JupyterLiteServer, T>;

/**
 * Server is the main application class. It is instantiated once and shared.
 */
export class JupyterLiteServer extends Application<never> {
  /**
   * Construct a new JupyterLite object.
   *
   * @param options The instantiation options for a JupyterLiteServer application.
   */
  constructor(options: Application.IOptions<never>) {
    super(options);
  }

  /**
   * The name of the application.
   */
  readonly name = 'JupyterLite Server';

  /**
   * A namespace/prefix plugins may use to denote their provenance.
   */
  readonly namespace = this.name;

  /**
   * The version of the application.
   */
  readonly version = 'unknown';

  /**
   * Get the underlying lite service manager for this app.
   */
  get serviceManager(): LiteServiceManager | null {
    return this._serviceManager;
  }

  /**
   * Attach the application shell to the DOM.
   *
   * @param id - The id of the host node for the shell, or `''`.
   *
   * #### Notes
   * For this server application there is no shell to attach
   */
  protected attachShell(id: string): void {
    // no-op
  }

  /**
   * A method invoked on a window `'resize'` event.
   *
   * #### Notes
   * For this server application there is no shell to update
   */
  protected evtResize(event: Event): void {
    // no-op
  }

  /**
   * Register plugins from a plugin module.
   *
   * @param mod - The plugin module to register.
   */
  registerPluginModule(mod: JupyterLiteServer.IPluginModule): void {
    let data = mod.default;
    // Handle commonjs exports.
    if (!Object.prototype.hasOwnProperty.call(mod, '__esModule')) {
      data = mod as any;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.forEach((item) => {
      try {
        this.registerPlugin(item);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * Register the plugins from multiple plugin modules.
   *
   * @param mods - The plugin modules to register.
   */
  registerPluginModules(mods: JupyterLiteServer.IPluginModule[]): void {
    mods.forEach((mod) => {
      this.registerPluginModule(mod);
    });
  }

  /**
   * Register the underlying lite service manager for this app.
   *
   * @param serviceManager The Service Manager for the app.
   */
  registerServiceManager(serviceManager: LiteServiceManager): void {
    this._serviceManager = serviceManager;
  }

  private _serviceManager: LiteServiceManager | null = null;
}

/**
 * A namespace for Server statics.
 */
export namespace JupyterLiteServer {
  /**
   * The interface for a module that exports a plugin or plugins as
   * the default value.
   */
  export interface IPluginModule {
    /**
     * The default export.
     */
    default: IPlugin<JupyterLiteServer, any> | IPlugin<JupyterLiteServer, any>[];
  }
}
