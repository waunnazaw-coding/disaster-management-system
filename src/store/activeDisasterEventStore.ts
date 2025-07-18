import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { DisasterEvent, Impact } from "../types/disaster"

interface ActiveDisasterEventState {
  activeEvents: DisasterEvent[]
  setActiveEvents: (events: DisasterEvent[]) => void
  addImpact: (eventId: number, impact: Impact) => void
  updateEvent: (event: DisasterEvent) => void
  clear: () => void
}

export const useActiveDisasterEventStore = create<ActiveDisasterEventState>()(
  immer((set) => ({
    activeEvents: [],
    setActiveEvents: (events) =>
      set((state) => { state.activeEvents = events }),
    addImpact: (eventId, impact) =>
      set((state) => {
        const ev = state.activeEvents.find(e => e.id === eventId)
        if (ev) {
          if (!ev.impacts) ev.impacts = []
          ev.impacts.push(impact)
        }
      }),
    updateEvent: (event) =>
      set((state) => {
        const i = state.activeEvents.findIndex(e => e.id === event.id)
        if (i !== -1) state.activeEvents[i] = event
      }),
    clear: () => set((state) => { state.activeEvents = [] }),
  }))
)
