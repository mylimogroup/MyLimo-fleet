import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCostFromNetAndRate,
  calculateVatFromNet,
  moneyToCents,
  parseItalianVatRate,
  resolveVatRateFromAmounts,
  roundMoney,
  sumMoneyAmounts,
} from "./money.ts";

describe("money", () => {
  it("sums net 100 and VAT 22 to exactly 122", () => {
    const result = calculateCostFromNetAndRate(100, 22);
    assert.equal(result.vatAmount, 22);
    assert.equal(result.totalAmount, 122);
    assert.equal(sumMoneyAmounts(100, 22), 122);
    assert.equal(moneyToCents(122), 12200);
  });

  it("calculates VAT for all Italian rates", () => {
    assert.deepEqual(calculateCostFromNetAndRate(100, 22), {
      netAmount: 100,
      vatAmount: 22,
      totalAmount: 122,
    });
    assert.deepEqual(calculateCostFromNetAndRate(100, 10), {
      netAmount: 100,
      vatAmount: 10,
      totalAmount: 110,
    });
    assert.deepEqual(calculateCostFromNetAndRate(100, 5), {
      netAmount: 100,
      vatAmount: 5,
      totalAmount: 105,
    });
    assert.deepEqual(calculateCostFromNetAndRate(100, 4), {
      netAmount: 100,
      vatAmount: 4,
      totalAmount: 104,
    });
    assert.deepEqual(calculateCostFromNetAndRate(100, 0), {
      netAmount: 100,
      vatAmount: 0,
      totalAmount: 100,
    });
  });

  it("keeps sample record totals internally consistent", () => {
    assert.equal(sumMoneyAmounts(729.51, 160.49), 890);
    assert.equal(sumMoneyAmounts(344.26, 75.74), 420);
    assert.equal(sumMoneyAmounts(286.89, 63.11), 350);
    assert.equal(sumMoneyAmounts(942.62, 207.38), 1150);
    assert.equal(sumMoneyAmounts(311.48, 68.52), 380);
  });
});

describe("Italian VAT rate", () => {
  it("defaults invalid or empty rates to 22%", () => {
    assert.equal(parseItalianVatRate(""), 22);
    assert.equal(parseItalianVatRate(21), 22);
    assert.equal(parseItalianVatRate(15), 22);
    assert.equal(calculateVatFromNet(roundMoney(100), parseItalianVatRate("")), 22);
  });

  it("accepts only allowed Italian VAT rates", () => {
    for (const rate of [22, 10, 5, 4, 0]) {
      assert.equal(parseItalianVatRate(rate), rate);
    }
  });

  it("infers 22% from legacy sample records without stored vatRate", () => {
    assert.equal(resolveVatRateFromAmounts(729.51, 160.49), 22);
    assert.equal(resolveVatRateFromAmounts(344.26, 75.74), 22);
  });
});
