// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import type {
//   FinancialAllocationResponseDto,
//   FinancialAllocationRequestDto,
//   AllocationTypeSummary,
// } from "@/api/financialAllocationService";
// import * as api from "@/api/financialAllocationService";

// interface TotalsOverviewResult {
//   totalDonations: number | null;
//   totalAllocations: number | null;
//   totalAllocationsCount: number;
//   difference: number | null;
// }

// interface FinancialAllocationsState {
//   // Data
//   allocations: FinancialAllocationResponseDto[];
//   allocationSummary: AllocationTypeSummary[];
//   totalsOverview: TotalsOverviewResult | null;
//   budgetData: {
//     totalBudget: number;
//   };

//   // UI State
//   selectedYear: string;
//   activeTab: string;
//   showForm: boolean;
//   editingAllocation: FinancialAllocationResponseDto | null;
//   isLoading: boolean;
//   error: string | null;

//   // Computed values (getters)
//   filteredAllocations: FinancialAllocationResponseDto[];
//   totalAllocated: number;
//   remainedAmount: number;
//   availableYears: string[];

//   // Actions
//   setSelectedYear: (year: string) => void;
//   setActiveTab: (tab: string) => void;
//   setShowForm: (show: boolean) => void;
//   setEditingAllocation: (allocation: FinancialAllocationResponseDto | null) => void;

//   createAllocation: (data: FinancialAllocationRequestDto) => Promise<void>;
//   updateAllocation: (data: FinancialAllocationRequestDto) => Promise<void>;
//   deleteAllocation: (id: number) => Promise<void>;

//   loadAllocations: (year?: string) => Promise<void>;
//   loadAllocationSummary: (year: string) => Promise<void>;
//   loadTotalsOverview: (year: string) => Promise<void>;

//   importExcelFile: (file: File) => Promise<void>;
//   downloadPdfReport: (year: number) => Promise<void>;

//   refreshData: () => Promise<void>;
//   cancelForm: () => void;
// }

// export const useFinancialAllocationsStore = create<FinancialAllocationsState>()(
//   immer((set, get) => ({
//     // Initial data
//     allocations: [],
//     allocationSummary: [],
//     totalsOverview: null,
//     budgetData: { totalBudget: 0 },

//     // UI state
//     selectedYear: new Date().getFullYear().toString(), // <-- dynamic current year default
//     activeTab: "overview",
//     showForm: false,
//     editingAllocation: null,
//     isLoading: false,
//     error: null,

//     // Computed values

//     get filteredAllocations() {
//       const { allocations, selectedYear } = get();
//       return allocations.filter((allocation) => {
//         if (!allocation.allocationDate) {
//           console.warn(`Allocation ID ${allocation.allocationId} missing allocationDate`);
//           return false;
//         }
//         const date = new Date(allocation.allocationDate);
//         if (isNaN(date.getTime())) {
//           console.warn(`Allocation ID ${allocation.allocationId} invalid allocationDate: ${allocation.allocationDate}`);
//           return false;
//         }
//         const allocationYear = date.getFullYear().toString().trim();
//         const selYear = selectedYear.trim();


//         return allocationYear === selYear;
//       });
//     },


//     get totalAllocated() {
//       return get()
//         .filteredAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
//     },

//     get remainedAmount() {
//       const { budgetData, totalAllocated } = get();
//       return budgetData.totalBudget - totalAllocated;
//     },

//     get availableYears() {
//       const { allocations } = get();
//       return Array.from(
//         new Set(
//           allocations.map((allocation) =>
//             new Date(allocation.allocationDate).getFullYear().toString()
//           )
//         )
//       ).sort((a, b) => b.localeCompare(a));
//     },

//     // Actions

//     setSelectedYear: (year) =>
//       set((state) => {
//         state.selectedYear = year;
//       }),

//     setActiveTab: (tab) =>
//       set((state) => {
//         state.activeTab = tab;
//       }),

//     setShowForm: (show) =>
//       set((state) => {
//         state.showForm = show;
//       }),

//     setEditingAllocation: (allocation) =>
//       set((state) => {
//         state.editingAllocation = allocation;
//       }),

//     createAllocation: async (data) => {
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       const tempId = Math.max(0, ...get().allocations.map((a) => a.allocationId)) + 1;
//       const tempAllocation: FinancialAllocationResponseDto = {
//         allocationId: tempId,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         ...data,
//       };

//       set((state) => {
//         state.allocations.unshift(tempAllocation);
//         state.showForm = false;
//       });

//       try {
//         const result = await api.createFinancialAllocation(data);

//         if (result.isSuccess && result.data) {
//           set((state) => {
//             const idx = state.allocations.findIndex((a) => a.allocationId === tempId);
//             if (idx !== -1) {
//               state.allocations[idx] = result.data!;
//             }
//             state.isLoading = false;
//           });
//         } else {
//           throw new Error(result.message || "Failed to create allocation");
//         }
//       } catch (error: any) {
//         console.error("API call failed:", error);
//         set((state) => {
//           state.allocations = state.allocations.filter((a) => a.allocationId !== tempId);
//           state.isLoading = false;
//           state.error = error.message || "Failed to create allocation";
//         });
//       }
//     },

//     updateAllocation: async (data) => {
//       const editing = get().editingAllocation;
//       if (!editing) return;

//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       const backup = { ...editing };
//       set((state) => {
//         const idx = state.allocations.findIndex((a) => a.allocationId === editing.allocationId);
//         if (idx !== -1) {
//           state.allocations[idx] = {
//             ...state.allocations[idx],
//             ...data,
//             updatedAt: new Date().toISOString(),
//           };
//         }
//         state.editingAllocation = null;
//         state.showForm = false;
//       });

//       try {
//         const result = await api.updateFinancialAllocation(editing.allocationId, data);
//         if (result.isSuccess && result.data) {
//           set((state) => {
//             const idx = state.allocations.findIndex((a) => a.allocationId === editing.allocationId);
//             if (idx !== -1) {
//               state.allocations[idx] = result.data!;
//             }
//             state.isLoading = false;
//           });
//         } else {
//           throw new Error(result.message || "Failed to update allocation");
//         }
//       } catch (error: any) {
//         console.error("API call failed:", error);
//         set((state) => {
//           const idx = state.allocations.findIndex((a) => a.allocationId === backup.allocationId);
//           if (idx !== -1) {
//             state.allocations[idx] = backup;
//           }
//           state.isLoading = false;
//           state.error = error.message || "Failed to update allocation";
//         });
//       }
//     },

//     deleteAllocation: async (id) => {
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       const backup = get().allocations.find((a) => a.allocationId === id);

//       set((state) => {
//         state.allocations = state.allocations.filter((a) => a.allocationId !== id);
//       });

//       try {
//         const result = await api.deleteFinancialAllocation(id);
//         if (result.isSuccess) {
//           set((state) => {
//             state.isLoading = false;
//           });
//         } else {
//           throw new Error(result.message || "Failed to delete allocation");
//         }
//       } catch (error: any) {
//         console.error("API call failed:", error);
//         if (backup) {
//           set((state) => {
//             state.allocations.unshift(backup);
//             state.isLoading = false;
//             state.error = error.message || "Failed to delete allocation";
//           });
//         } else {
//           set((state) => {
//             state.isLoading = false;
//             state.error = error.message || "Failed to delete allocation";
//           });
//         }
//       }
//     },

//     /**
//      * Updates here: USE getFinancialAllocationsByYear endpoint to load allocations for the year.
//      */
//     loadAllocations: async (year) => {
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       try {
//         const currentYear = year || get().selectedYear;
//         const yearNum = Number.parseInt(currentYear, 10);

//         const result = await api.getFinancialAllocationsByYear(yearNum);

//         console.log("loadAllocations: API result =", result.data);

//         if (result.isSuccess === true && Array.isArray(result.data)) {
//           set((state) => {
//             state.allocations = result.data;
//             state.isLoading = false;
//             state.error = null;
//           });
//         } else {
//           throw new Error(result.message || "Failed to load allocations");
//         }
//       } catch (error: any) {
//         console.error("API call failed:", error);
//         set((state) => {
//           state.allocations = [];
//           state.isLoading = false;
//           state.error = error.message || "Failed to load allocations";
//         });
//       }
//     },



//     /**
//      * Load allocation summary for charts using allocation type percentages API
//      */
//     loadAllocationSummary: async (year) => {
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       try {
//         const yearNum = Number.parseInt(year);
//         const summary = await api.getAllocationTypePercentages(yearNum);

//         set((state) => {
//           state.allocationSummary = summary;
//           state.isLoading = false;
//         });
//       } catch (error: any) {
//         console.error("Failed to load allocation summary:", error);
//         set((state) => {
//           state.allocationSummary = [];
//           state.isLoading = false;
//           state.error = error.message || "Failed to load allocation summary";
//         });
//       }
//     },

//     /**
//      * New action to load overview totals using the "totals/{year}" endpoint
//      */
//     loadTotalsOverview: async (year) => {
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       try {
//         const yearNum = Number.parseInt(year);
//         const overview = await api.getTotalsOverview(yearNum);
//         set((state) => {
//           state.totalsOverview = overview;
//           state.isLoading = false;
//         });
//       } catch (error: any) {
//         console.error("Failed to load totals overview:", error);
//         set((state) => {
//           state.totalsOverview = null;
//           state.isLoading = false;
//           state.error = error.message || "Failed to load totals overview";
//         });
//       }
//     },

//     importExcelFile: async (file) => {
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       try {
//         const result = await api.importFromExcel(file);
//         if (result.isSuccess) {
//           await get().loadAllocations();
//           set((state) => {
//             state.isLoading = false;
//           });
//         } else {
//           throw new Error(result.message || "Failed to import Excel file");
//         }
//       } catch (error: any) {
//         console.error("Excel import failed:", error);
//         set((state) => {
//           state.isLoading = false;
//           state.error = error.message || "Failed to import Excel file";
//         });
//       }
//     },

//     downloadPdfReport: async (year) => {
//       try {
//         const blob = await api.downloadAnnualReportPdf(year);
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `annual-report-${year}.pdf`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       } catch (error: any) {
//         console.error("PDF download failed:", error);
//         set((state) => {
//           state.error = error.message || "Failed to download PDF report";
//         });
//       }
//     },

//     refreshData: async () => {
//       const { selectedYear } = get();
//       set((state) => {
//         state.isLoading = true;
//         state.error = null;
//       });

//       try {
//         await Promise.all([
//           get().loadAllocations(selectedYear),
//           get().loadAllocationSummary(selectedYear),
//           get().loadTotalsOverview(selectedYear),
//         ]);
//         set((state) => {
//           state.isLoading = false;
//         });
//       } catch {
//         set((state) => {
//           state.isLoading = false;
//           // error handled by individual calls
//         });
//       }
//     },

//     cancelForm: () =>
//       set((state) => {
//         state.showForm = false;
//         state.editingAllocation = null;
//       }),
//   }))
// );


import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  FinancialAllocationResponseDto,
  FinancialAllocationRequestDto,
  AllocationTypeSummary,
} from "@/api/financialAllocationService";
import * as api from "@/api/financialAllocationService";

interface TotalsOverviewResult {
  totalDonations: number | null;
  totalAllocations: number | null;
  totalAllocationsCount: number;
  difference: number | null;
}

interface FinancialAllocationsState {
  // Data
  allocations: FinancialAllocationResponseDto[];
  allocationSummary: AllocationTypeSummary[];
  totalsOverview: TotalsOverviewResult | null;
  budgetData: {
    totalBudget: number;
  };

  // UI State
  selectedYear: string;
  activeTab: string;
  showForm: boolean;
  editingAllocation: FinancialAllocationResponseDto | null;
  isLoading: boolean;
  error: string | null;

  // Computed values (getters)
  filteredAllocations: FinancialAllocationResponseDto[];
  totalAllocated: number;
  remainedAmount: number;
  availableYears: string[];

  // Actions
  setSelectedYear: (year: string) => void;
  setActiveTab: (tab: string) => void;
  setShowForm: (show: boolean) => void;
  setEditingAllocation: (allocation: FinancialAllocationResponseDto | null) => void;

  createAllocation: (data: FinancialAllocationRequestDto) => Promise<void>;
  updateAllocation: (data: FinancialAllocationRequestDto) => Promise<void>;
  deleteAllocation: (id: number) => Promise<void>;

  loadAllocations: (year?: string) => Promise<void>;
  loadAllocationSummary: (year: string) => Promise<void>;
  loadTotalsOverview: (year: string) => Promise<void>;

  importExcelFile: (file: File) => Promise<void>;
  downloadPdfReport: (year: number) => Promise<void>;

  refreshData: () => Promise<void>;
  cancelForm: () => void;
}

export const useFinancialAllocationsStore = create<FinancialAllocationsState>()(
  immer((set, get) => ({
    // Initial data
    allocations: [],
    allocationSummary: [],
    totalsOverview: null,
    budgetData: { totalBudget: 0 },

    // UI state
    selectedYear: new Date().getFullYear().toString(), // <-- dynamic current year default
    activeTab: "overview",
    showForm: false,
    editingAllocation: null,
    isLoading: false,
    error: null,

    // Computed values

    get filteredAllocations() {
      const { allocations, selectedYear } = get();
      return allocations.filter((allocation) => {
        if (!allocation.allocationDate) {
          console.warn(`Allocation ID ${allocation.allocationId} missing allocationDate`);
          return false;
        }
        const date = new Date(allocation.allocationDate);
        if (isNaN(date.getTime())) {
          console.warn(`Allocation ID ${allocation.allocationId} invalid allocationDate: ${allocation.allocationDate}`);
          return false;
        }
        const allocationYear = date.getFullYear().toString().trim();
        const selYear = selectedYear.trim();


        return allocationYear === selYear;
      });
    },


    get totalAllocated() {
      return get()
        .filteredAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    },

    get remainedAmount() {
      const { budgetData, totalAllocated } = get();
      return budgetData.totalBudget - totalAllocated;
    },

    get availableYears() {
      const { allocations } = get();
      return Array.from(
        new Set(
          allocations.map((allocation) =>
            new Date(allocation.allocationDate).getFullYear().toString()
          )
        )
      ).sort((a, b) => b.localeCompare(a));
    },

    // Actions

    setSelectedYear: (year) =>
      set((state) => {
        state.selectedYear = year;
      }),

    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab;
      }),

    setShowForm: (show) =>
      set((state) => {
        state.showForm = show;
      }),

    setEditingAllocation: (allocation) =>
      set((state) => {
        state.editingAllocation = allocation;
      }),

    createAllocation: async (data) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      const tempId = Math.max(0, ...get().allocations.map((a) => a.allocationId)) + 1;
      const tempAllocation: FinancialAllocationResponseDto = {
        allocationId: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };

      // optimistic add
      set((state) => {
        state.allocations.unshift(tempAllocation);
        state.showForm = false;
      });

      try {
        const result = await api.createFinancialAllocation(data);

        if (result.isSuccess && result.data) {
          // replace temp with server response
          set((state) => {
            const idx = state.allocations.findIndex((a) => a.allocationId === tempId);
            if (idx !== -1) {
              state.allocations[idx] = result.data!;
            }
            // do not forcibly set isLoading here — we'll refresh data next
          });

          // Re-sync full data from server (calls loadAllocations, summary, totals)
          await get().refreshData();
        } else {
          throw new Error(result.message || "Failed to create allocation");
        }
      } catch (error: any) {
        console.error("API call failed:", error);
        // rollback optimistic add
        set((state) => {
          state.allocations = state.allocations.filter((a) => a.allocationId !== tempId);
          state.isLoading = false;
          state.error = error.message || "Failed to create allocation";
        });
      } finally {
        // Ensure loading flag is not stuck (refreshData also sets it, but if refreshData wasn't called due to error, turn it off)
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    updateAllocation: async (data) => {
      const editing = get().editingAllocation;
      if (!editing) return;

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      const backup = { ...editing };
      set((state) => {
        const idx = state.allocations.findIndex((a) => a.allocationId === editing.allocationId);
        if (idx !== -1) {
          state.allocations[idx] = {
            ...state.allocations[idx],
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        state.editingAllocation = null;
        state.showForm = false;
      });

      try {
        const result = await api.updateFinancialAllocation(editing.allocationId, data);
        if (result.isSuccess && result.data) {
          // optionally update local item (we'll re-sync anyway)
          set((state) => {
            const idx = state.allocations.findIndex((a) => a.allocationId === editing.allocationId);
            if (idx !== -1) {
              state.allocations[idx] = result.data!;
            }
            // leave isLoading to refreshData
          });

          // Re-sync to ensure charts, totals, and allocations are correct
          await get().refreshData();
        } else {
          throw new Error(result.message || "Failed to update allocation");
        }
      } catch (error: any) {
        console.error("API call failed:", error);
        // rollback
        set((state) => {
          const idx = state.allocations.findIndex((a) => a.allocationId === backup.allocationId);
          if (idx !== -1) {
            state.allocations[idx] = backup;
          }
          state.isLoading = false;
          state.error = error.message || "Failed to update allocation";
        });
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    deleteAllocation: async (id) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      const backup = get().allocations.find((a) => a.allocationId === id);

      // optimistic remove
      set((state) => {
        state.allocations = state.allocations.filter((a) => a.allocationId !== id);
      });

      try {
        const result = await api.deleteFinancialAllocation(id);
        if (result.isSuccess) {
          // Re-sync to refresh totals/charts and confirm deletion
          await get().refreshData();
        } else {
          throw new Error(result.message || "Failed to delete allocation");
        }
      } catch (error: any) {
        console.error("API call failed:", error);
        // restore on failure
        if (backup) {
          set((state) => {
            state.allocations.unshift(backup);
            state.isLoading = false;
            state.error = error.message || "Failed to delete allocation";
          });
        } else {
          set((state) => {
            state.isLoading = false;
            state.error = error.message || "Failed to delete allocation";
          });
        }
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    /**
     * Updates here: USE getFinancialAllocationsByYear endpoint to load allocations for the year.
     */
    loadAllocations: async (year) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const currentYear = year || get().selectedYear;
        const yearNum = Number.parseInt(currentYear, 10);

        const result = await api.getFinancialAllocationsByYear(yearNum);

        console.log("loadAllocations: API result =", result.data);

        if (result.isSuccess === true && Array.isArray(result.data)) {
          set((state) => {
            state.allocations = result.data;
            state.isLoading = false;
            state.error = null;
          });
        } else {
          throw new Error(result.message || "Failed to load allocations");
        }
      } catch (error: any) {
        console.error("API call failed:", error);
        set((state) => {
          state.allocations = [];
          state.isLoading = false;
          state.error = error.message || "Failed to load allocations";
        });
      }
    },



    /**
     * Load allocation summary for charts using allocation type percentages API
     */
    loadAllocationSummary: async (year) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const yearNum = Number.parseInt(year);
        const summary = await api.getAllocationTypePercentages(yearNum);

        set((state) => {
          state.allocationSummary = summary;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.error("Failed to load allocation summary:", error);
        set((state) => {
          state.allocationSummary = [];
          state.isLoading = false;
          state.error = error.message || "Failed to load allocation summary";
        });
      }
    },

    /**
     * New action to load overview totals using the "totals/{year}" endpoint
     */
    loadTotalsOverview: async (year) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const yearNum = Number.parseInt(year);
        const overview = await api.getTotalsOverview(yearNum);
        set((state) => {
          state.totalsOverview = overview;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.error("Failed to load totals overview:", error);
        set((state) => {
          state.totalsOverview = null;
          state.isLoading = false;
          state.error = error.message || "Failed to load totals overview";
        });
      }
    },

    importExcelFile: async (file) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const result = await api.importFromExcel(file);
        if (result.isSuccess) {
          await get().loadAllocations();
          set((state) => {
            state.isLoading = false;
          });
        } else {
          throw new Error(result.message || "Failed to import Excel file");
        }
      } catch (error: any) {
        console.error("Excel import failed:", error);
        set((state) => {
          state.isLoading = false;
          state.error = error.message || "Failed to import Excel file";
        });
      }
    },

    downloadPdfReport: async (year) => {
      try {
        const blob = await api.downloadAnnualReportPdf(year);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `annual-report-${year}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error: any) {
        console.error("PDF download failed:", error);
        set((state) => {
          state.error = error.message || "Failed to download PDF report";
        });
      }
    },

    refreshData: async () => {
      const { selectedYear } = get();
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await Promise.all([
          get().loadAllocations(selectedYear),
          get().loadAllocationSummary(selectedYear),
          get().loadTotalsOverview(selectedYear),
        ]);
        set((state) => {
          state.isLoading = false;
        });
      } catch {
        set((state) => {
          state.isLoading = false;
          // error handled by individual calls
        });
      }
    },

    cancelForm: () =>
      set((state) => {
        state.showForm = false;
        state.editingAllocation = null;
      }),
  }))
);

