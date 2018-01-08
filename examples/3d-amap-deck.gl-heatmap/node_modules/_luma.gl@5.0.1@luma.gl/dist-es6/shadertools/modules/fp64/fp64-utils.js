export function fp64ify(a) {
  var hiPart = Math.fround(a);
  var loPart = a - hiPart;
  return [hiPart, loPart];
}
//# sourceMappingURL=fp64-utils.js.map