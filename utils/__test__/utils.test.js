const ut = require('../UtilityFunctions');

describe('isJagged method', () => {
  test('1D array', () => {
    const ret = ut.isJagged([1, 3, 5]);
    expect(ret).toBeFalsy();
  });

  test('non jagged 2D array', () => {
    let arr = [[1, 3, 4], [4, 5, 6], [7, 8, 9]];
    const ret = ut.isJagged(arr);
    expect(ret).toBeFalsy();
  });

  test('jagged 2D array', () => {
    let arr = [[3, 4], [4, 5, 6], [7, 8, 9]];
    let ret = ut.isJagged(arr);
    expect(ret).toBeTruthy();

    arr = [[2, 3, 4], [4, 5], [7, 8, 9]];
    ret = ut.isJagged(arr);
    expect(ret).toBeTruthy();
  });

  test('2D array with non-array element', () => {
    let arr = [5, [3, 4], [1, 2]];
    let ret = ut.isJagged(arr);
    expect(ret).toBeTruthy();

    arr = [[3, 4], 5, [1, 2]];
    ret = ut.isJagged(arr);
    expect(ret).toBeTruthy();
  });
});

describe('haveSameLength method', () => {
  test('1D arrays, same length', () => {
    let arr1 = [1, 3, 4];
    let arr2 = [2, 5, 9];
    expect(ut.haveSameLength(arr1, arr2, false)).toBeTruthy();
    //also test default argument
    expect(ut.haveSameLength(arr1, arr2)).toBeTruthy();
    //shouldnt matter if we check for 2D
    expect(ut.haveSameLength(arr1, arr2, true)).toBeTruthy();
  });

  test('1D arrays, not same length', () => {
    let arr1 = [1, 3];
    let arr2 = [2, 5, 9];
    expect(ut.haveSameLength(arr1, arr2)).toBeFalsy();
    expect(ut.haveSameLength(arr2, arr1)).toBeFalsy();
  });

  test('One non-array parameter', () => {
    let arr1 = 5;
    let arr2 = [2];
    expect(ut.haveSameLength(arr1, arr2)).toBeFalsy();
    expect(ut.haveSameLength(arr2, arr1)).toBeFalsy();
  });

  test('2D arrays, same length', () => {
    let arr1 = [[1, 3, 4], [5, 9, 0], [15, 59, 100]];
    let arr2 = [[10, 2, 40], [50, 13, 7], [17, -3, 12]];
    expect(ut.haveSameLength(arr1, arr2)).toBeTruthy();
    expect(ut.haveSameLength(arr1, arr2, true)).toBeTruthy();

    arr1 = [1, [5, 9, 0], 80, [15, 59, 100], [3, 4]];
    arr2 = [7, [50, 13, 7], 14, [17, -3, 12], [-31, 0]];
    expect(ut.haveSameLength(arr1, arr2)).toBeTruthy();
    expect(ut.haveSameLength(arr1, arr2, true)).toBeTruthy();
  });

  test('2D arrays, not same length', () => {
    let arr1 = [[1, 3, 4], [5, 9, 0]];
    let arr2 = [[10, 2, 40], [50, 13, 7], [17, -3, 12]];
    expect(ut.haveSameLength(arr1, arr2, true)).toBeFalsy();

    arr1 = [[1, 3, 4], [5, 9, 0], [3, -12, 40, 89]];
    arr2 = [[10, 2, 40], [50, 13, 7], [17, -3, 12]];
    expect(ut.haveSameLength(arr1, arr2, true)).toBeFalsy();

    arr1 = [[3, 4], [1], [5, 9, 0], [3, -12, 40]];
    arr2 = [[98, -6], 7, [50, 13, 7], [17, -3, 12]];
    expect(ut.haveSameLength(arr1, arr2, true)).toBeFalsy();
  });
});
