import { describe, expect, it } from "vitest";
import { GetNumberOfPages } from "./get-number-of-pages.service";

describe("GetNumberOfPages", () => {
	it("should return 0 when totalItems is 0", () => {
		const result = GetNumberOfPages.run(0, 10);
		expect(result).toBe(0);
	});

	it("should return 0 when totalItems is negative", () => {
		const result = GetNumberOfPages.run(-5, 10);
		expect(result).toBe(0);
	});

	it("should return 1 when itemsPerPage is 0", () => {
		const result = GetNumberOfPages.run(10, 0);
		expect(result).toBe(1);
	});

	it("should return 1 when itemsPerPage is negative", () => {
		const result = GetNumberOfPages.run(10, -5);
		expect(result).toBe(1);
	});

	it("should calculate correct pages for exact division", () => {
		const result = GetNumberOfPages.run(100, 10);
		expect(result).toBe(10);
	});

	it("should calculate correct pages for round up division", () => {
		const result = GetNumberOfPages.run(101, 10);
		expect(result).toBe(11);
	});

	it("should use default itemsPerPage when not provided", () => {
		// Testing that it runs without error and returns a number
		const result = GetNumberOfPages.run(100);
		expect(typeof result).toBe("number");
		expect(result).toBeGreaterThan(0);
	});
});
