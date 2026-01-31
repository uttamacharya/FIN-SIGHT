
export const ANALYSIS_TYPE= Object.freeze({
    SUMMARY: "SUMMARY",

    CATEGORY: "CATEGORY",
    MULTI_CATEGORY: "MULTI_CATEGORY",

    DATE_CATEGORY: "DATE_CATEGORY",
    DATE_RANGE: "DATE_RANGE",     
    DATE_RANGE_CATEGORY:"DATE_RANGE_CATEGORY",
    DATE_RANGE_MULTI_CATEGORY: "DATE_RANGE_MULTI_CATEGORY",
    DATE_MULTI_CATEGORY: "DATE_MULTI_CATEGORY",  //single date multi category

    META_DATA: "META_DATA",

    
    INVALID: "INVALID"
})

export const DATE_MODE= Object.freeze({
    NONE:"NONE",
    SINGLE:"SINGLE",
    RANGE:"RANGE"
});

export const CHART_TYPE = Object.freeze({
  BAR: "BAR",
  LINE: "LINE",
  PIE: "PIE",
  DOUGHNUT: "DOUGHNUT"
});

export const DEFAULT_ANALYSIS_FILTER=Object.freeze({
    dateMode: DATE_MODE.NONE,
    from:null,
    to:null,
    date:null,
    categories:[],
    chartType: CHART_TYPE.BAR
})