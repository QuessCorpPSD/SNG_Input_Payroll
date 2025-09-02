
import { BackgroundCheckService } from "./BackgroundCheckService";


export function initBackground(service: BackgroundCheckService) {
  return () => {
    console.log('APP_INITIALIZER triggered');
    service.startBackgroundTask(); // fire your logic
    return Promise.resolve(); // MUST return a Promise or void
  };
}
