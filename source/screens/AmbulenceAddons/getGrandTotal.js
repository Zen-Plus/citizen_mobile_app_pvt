export function addOnsTotalAmount(data) {
    let totalAmount = 0;
  
    data.forEach((obj) => {
      totalAmount += obj.totalPrice;
    });
  
    return totalAmount;
  }
  
  export function grandTotalAmount(baseFare, addOns, feeAndGST) {
    let totalAmount = 0;
  
    totalAmount += addOnsTotalAmount(addOns);
      if (baseFare) totalAmount += baseFare;
      if (feeAndGST) totalAmount += feeAndGST;
  
    return totalAmount;
  }
  
  export default {
    addOnsTotalAmount,
    grandTotalAmount,
  };
  