/*
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
    let length = arr[0].length;
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
  return true;
};