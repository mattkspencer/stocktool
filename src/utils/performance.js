import * as Sentry from "@sentry/react";

export class PerformanceMonitor {
  static metrics = {
    timeToFirstByte: {},
    apiCallDuration: {},
    renderTime: {},
    memoryUsage: {}
  };

  static startMeasurement(name) {
    this.metrics[name] = {
      startTime: performance.now()
    };
  }

  static endMeasurement(name) {
    if (this.metrics[name]) {
      const duration = performance.now() - this.metrics[name].startTime;
      Sentry.captureMessage('Performance Metric', {
        extra: {
          metric: name,
          duration: `${duration.toFixed(2)}ms`
        }
      });
      return duration;
    }
    return null;
  }

  static trackApiCall(endpoint) {
    return async (callback) => {
      this.startMeasurement(`api_${endpoint}`);
      try {
        const result = await callback();
        const duration = this.endMeasurement(`api_${endpoint}`);
        console.log(`API call to ${endpoint} took ${duration}ms`);
        return result;
      } catch (error) {
        this.endMeasurement(`api_${endpoint}`);
        throw error;
      }
    };
  }

  static trackMemoryUsage() {
    if (performance.memory) {
      const memory = performance.memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize
      };
    }
    return null;
  }
}
