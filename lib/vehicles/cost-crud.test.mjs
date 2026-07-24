import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCostFromNetAndRate,
  sumMoneyAmounts,
} from "./money.ts";

const sampleCosts = [
  {
    id: "c-001",
    date: "2026-04-10",
    category: "maintenance",
    description: "Scheduled engine service",
    supplier: "Mercedes-Benz Milano",
    netAmount: 729.51,
    vatAmount: 160.49,
    vatRate: 22,
    totalAmount: 890,
    mileage: 45200,
    notes: "",
    invoicePdfUrl: null,
    invoicePdfName: null,
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
  },
  {
    id: "c-002",
    date: "2026-02-20",
    category: "repairs",
    description: "Brake pad replacement",
    supplier: "Autofficina Rossi",
    netAmount: 344.26,
    vatAmount: 75.74,
    vatRate: 22,
    totalAmount: 420,
    mileage: 43100,
    notes: "",
    invoicePdfUrl: null,
    invoicePdfName: null,
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-02-20T08:00:00Z",
  },
];

function updateCostInList(costs, costId, updatedEntry) {
  if (!costs.some((cost) => cost.id === costId)) {
    throw new Error(`Cost ${costId} not found`);
  }
  return costs.map((cost) => (cost.id === costId ? updatedEntry : cost));
}

function deleteCostFromList(costs, costId) {
  if (!costs.some((cost) => cost.id === costId)) {
    throw new Error(`Cost ${costId} not found`);
  }
  return costs.filter((cost) => cost.id !== costId);
}

function computeYearCostTotal(costs, year) {
  const yearCosts = costs.filter(
    (cost) => new Date(cost.date).getFullYear() === year
  );
  return sumMoneyAmounts(...yearCosts.map((cost) => cost.totalAmount));
}

function buildUpdatedEntry(existing, overrides) {
  const netAmount = overrides.netAmount ?? existing.netAmount;
  const vatRate = overrides.vatRate ?? existing.vatRate;
  const { vatAmount, totalAmount } = calculateCostFromNetAndRate(
    netAmount,
    vatRate
  );

  return {
    ...existing,
    ...overrides,
    netAmount,
    vatRate,
    vatAmount,
    totalAmount,
    updatedAt: "2026-07-24T12:00:00Z",
  };
}

describe("cost CRUD", () => {
  it("updates an existing cost instead of inserting a duplicate", () => {
    const updatedEntry = buildUpdatedEntry(sampleCosts[0], {
      description: "Updated engine service",
      netAmount: 100,
      vatRate: 10,
      notes: "Updated notes",
    });
    const updatedCosts = updateCostInList(sampleCosts, "c-001", updatedEntry);

    assert.equal(updatedCosts.length, 2);
    assert.equal(updatedCosts.filter((cost) => cost.id === "c-001").length, 1);

    const updated = updatedCosts.find((cost) => cost.id === "c-001");
    assert.equal(updated?.description, "Updated engine service");
    assert.equal(updated?.createdAt, "2026-04-10T09:00:00Z");
    assert.notEqual(updated?.updatedAt, "2026-04-10T09:00:00Z");
  });

  it("recalculates edited amounts from net amount and VAT rate", () => {
    const updatedEntry = buildUpdatedEntry(sampleCosts[0], {
      netAmount: 100,
      vatRate: 10,
    });
    const updated = updateCostInList(sampleCosts, "c-001", updatedEntry).find(
      (cost) => cost.id === "c-001"
    );

    assert.equal(updated?.netAmount, 100);
    assert.equal(updated?.vatAmount, 10);
    assert.equal(updated?.totalAmount, 110);
  });

  it("preserves the saved VAT rate on update", () => {
    const updatedEntry = buildUpdatedEntry(sampleCosts[0], {
      netAmount: 100,
      vatRate: 5,
    });

    assert.equal(updatedEntry.vatRate, 5);
    assert.equal(updatedEntry.vatAmount, 5);
    assert.equal(updatedEntry.totalAmount, 105);
  });

  it("deletes only the selected cost record", () => {
    const remaining = deleteCostFromList(sampleCosts, "c-002");

    assert.equal(remaining.length, 1);
    assert.equal(remaining[0]?.id, "c-001");
    assert.equal(
      remaining.some((cost) => cost.id === "c-002"),
      false
    );
  });

  it("updates year KPI totals after edit and delete", () => {
    const year = 2026;
    const initialTotal = computeYearCostTotal(sampleCosts, year);
    assert.equal(initialTotal, 1310);

    const updatedEntry = buildUpdatedEntry(sampleCosts[0], {
      netAmount: 100,
      vatRate: 10,
    });
    const afterEdit = updateCostInList(sampleCosts, "c-001", updatedEntry);
    assert.equal(computeYearCostTotal(afterEdit, year), 530);

    const afterDelete = deleteCostFromList(afterEdit, "c-002");
    assert.equal(computeYearCostTotal(afterDelete, year), 110);
  });
});
