export interface ComponentInterface {
  title: string;

  /**
   * Check whether current logged user can access to specified path.
   * @param path
   * @returns {boolean}
   */
  isRouteGranted(path: string): boolean;
}
