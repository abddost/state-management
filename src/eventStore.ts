// src/eventStore.ts

export class EventStore {
  private events: Event[] = [];
  private isTimeTraveling = false;
  private timeTravelIndex = 0;

  append(event: Event) {
    if (!this.isTimeTraveling) {
      this.events.push(event);
    }
  }

  getEvents(): Event[] {
    return [...this.events];
  }

  jumpToEvent(index: number) {
    if (index < 0 || index >= this.events.length) {
      throw new Error("Invalid event index");
    }
    this.isTimeTraveling = true;
    this.timeTravelIndex = index;
  }

  resume() {
    this.isTimeTraveling = false;
    this.timeTravelIndex = this.events.length - 1;
  }

  getCurrentEvents(): Event[] {
    if (this.isTimeTraveling) {
      return this.events.slice(0, this.timeTravelIndex + 1);
    }
    return this.getEvents();
  }
}
