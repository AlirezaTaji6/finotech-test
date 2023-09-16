export class ValidationTester {
  constructor(public errors: { property: string }[]) {}

  isFirstLayer(fields: string[]) {
    expect(fields.length).toBe(this.errors.length);

    for (const field of fields) {
      const error = this.errors.find((e) => {
        return e.property == field;
      });

      expect(error).toBeDefined();
    }
  }
}
