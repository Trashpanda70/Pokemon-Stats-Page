/**
  returns true if the array is jagged
  returns false otherwise. 
  If the array is 1D it returns false
*/
exports.isJagged = (arr) => {
  let one_d = false;
  let length = 1;
  if (!Array.isArray(arr[0]))
    one_d = true;
  else {
    length = arr[0].length;
  }
  for (const e of arr) {
    if (one_d) {
      //check if element is not an array (Array should be 1D)
      if (Array.isArray(e))
        return true;
    } else if (e.length != length) {
      //check length. For 1D array elements e.length is undefined so this will be false
      return true;
    }
  }
  return false;
};

/**
  returns true if the two given variables are arrays and have the same length. 
  Will also check if they are 2D arrays if check2D is set. If this is the case it will check each index.
  For each case example assume check2D is set:
  TRUE CASES:
  x = [3, 4, 5]         y = [6, 7, 9]
  x = ["yeah"]          y =["yo"]
  x = [[3, 4], [5, 8]]  y = [[9, 7], [8, 9]]
  x = [5, [7, 8, 9]]    y = [3, [2, 1, 1]]

  FALSE CASES:
  x = [4, 3, 5]         y = [3, 2]
  x = 4                 y = [4]     //x is not an array
  x = [[1, 2], [3, 4]]  y = [1, 2]  //if check2D is not set this returns true
  x = [[1, 2], [3, 4]]  y = [[1], [3, 4]]
*/
exports.haveSameLength = (x, y, check2D = false) => {
  //not arrays
  if (!(Array.isArray(x) && Array.isArray(y))) {
    return false;
  }
  //lengths are not the same
  if (x.length != y.length) {
    return false;
  }
  //only do 2D check is prompted
  if (!check2D) {
    return true;
  }
  //2D check
  for (let i = 0; i < x.length; i++) {
    if (Array.isArray(x[i]) != Array.isArray(y[i])) {
      return false; //one element is an array, the other is not
    }
    if (Array.isArray(x[i]) && x[i].length != y[i].length) {
      return false; //both elements are an array and not the same length
    }
  }
  return true;
};
