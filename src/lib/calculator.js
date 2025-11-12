const getDaysDiff = (dateStr1, dateStr2) => {
  const date1 = new Date(dateStr1 + 'T00:00:00');
  const date2 = new Date(dateStr2 + 'T00:00:00');

  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    throw new Error("Datas inválidas.");
  }
  
  let day1 = date1.getDate();
  let month1 = date1.getMonth();
  let day2 = date2.getDate();
  let month2 = date2.getMonth();
  
  // Always consider a month as 30 days
  const daysInMonth1 = 30; 

  if (month1 === month2) {
      if (day1 > day2) { // Handle cases like opening 21 and closing 20 of the next month
          return (daysInMonth1 - day1 + 1) + day2;
      }
      return (day2 - day1) + 1;
  }
  
  // Handle case where dates span across months
  return (daysInMonth1 - day1 + 1) + day2;
};

export const calculateProportionalValue = (
  monthlyValue,
  openingDateStr,
  closingDateStr,
) => {
  if (!monthlyValue || !openingDateStr || !closingDateStr) return null;
  
  const daysUsed = getDaysDiff(openingDateStr, closingDateStr);
  if (daysUsed <= 0) throw new Error("A data de fechamento deve ser posterior à de abertura.");


  const effectiveDays = Math.min(daysUsed, 30);
  
  const dailyValue = monthlyValue / 30;
  const proportionalValue = dailyValue * effectiveDays;

  return {
    type: 'PROPORTIONAL',
    monthlyValue,
    openingDate: openingDateStr,
    closingDate: closingDateStr,
    daysUsed: effectiveDays,
    totalDaysInMonth: 30,
    proportionalValue,
  };
};

export const calculateOwnershipChange = (
  monthlyValue,
  openingDateStr,
  changeDateStr
) => {
  if (!monthlyValue || !openingDateStr || !changeDateStr) return null;

  const daysUsed = getDaysDiff(openingDateStr, changeDateStr);
  if (daysUsed <= 0) throw new Error("A data da troca deve ser igual ou posterior à de abertura.");

  const effectiveDays = Math.min(daysUsed, 30);

  const dailyValue = monthlyValue / 30;
  const proportionalValue = dailyValue * effectiveDays;

  return {
    type: 'OWNERSHIP',
    monthlyValue,
    openingDate: openingDateStr,
    changeDate: changeDateStr,
    daysUsed: effectiveDays,
    totalDaysInMonth: 30,
    proportionalValue,
  };
};

export const calculatePlanChange = (
  planFromValue,
  planToValue,
  openingDateStr,
  closingDateStr,
  changeDateStr
) => {
  if (!planFromValue || !planToValue || !openingDateStr || !closingDateStr || !changeDateStr) return null;

  const changeDate = new Date(changeDateStr + "T00:00:00");
  const tempClosingBefore = new Date(changeDate);
  tempClosingBefore.setDate(tempClosingBefore.getDate() - 1);
  const closingBeforeStr = tempClosingBefore.toISOString().split('T')[0];

  const daysBeforeChange = getDaysDiff(openingDateStr, closingBeforeStr);
  const daysAfterChange = getDaysDiff(changeDateStr, closingDateStr);

  if (daysBeforeChange < 0 || daysAfterChange <= 0) {
    throw new Error("A data da troca deve estar dentro do período da fatura.");
  }
  
  const dailyValueBefore = planFromValue / 30;
  const dailyValueAfter = planToValue / 30;
  
  const proportionalBefore = dailyValueBefore * daysBeforeChange;
  const proportionalAfter = dailyValueAfter * daysAfterChange;

  const totalProportionalValue = proportionalBefore + proportionalAfter;

  return {
    type: 'PLAN_CHANGE',
    planFromValue,
    planToValue,
    openingDate: openingDateStr,
    closingDate: closingDateStr,
    changeDate: changeDateStr,
    daysBeforeChange,
    daysAfterChange,
    proportionalBefore,
    proportionalAfter,
    totalProportionalValue,
  };
};

export const calculateDiscount = (planValue, daysWithoutConnection) => {
    if (!planValue || !daysWithoutConnection || planValue <= 0 || daysWithoutConnection <= 0) {
        return null;
    }

    const discountValue = (planValue / 30) * daysWithoutConnection;
    const finalValueAfterDiscount = planValue - discountValue;

    return {
        type: 'DISCOUNT',
        planValue,
        daysWithoutConnection,
        discount: discountValue,
        finalValue: finalValueAfterDiscount < 0 ? 0 : finalValueAfterDiscount,
    };
}
