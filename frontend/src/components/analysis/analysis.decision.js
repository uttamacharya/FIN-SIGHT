import {
    ANALYSIS_TYPE,
    DATE_MODE
} from './analysis.constant.js'


/**
 * Decide which analysis type should be executed
 *
 * @param {Object} params
 * @param {string} params.dateMode  - DATE_MODE.NONE | SINGLE | RANGE
 * @param {string|null} params.from
 * @param {string|null} params.to
 * @param {string|null} params.date
 * @param {Array<string>} params.categories
 *
 * @returns {string} ANALYSIS_TYPE
 */

export function decideAnalysisType({
    dateMode,
    from,
    to,
    date,
    categories=[]
}){
    if(dateMode === DATE_MODE.NONE){
        if(categories.length ===0){
            return  ANALYSIS_TYPE.SUMMARY
        }
        if(categories.length===1){
            return ANALYSIS_TYPE.CATEGORY
        }
        return  ANALYSIS_TYPE.MULTI_CATEGORY;
    }

    // SINGLE DATE MODE

    if(dateMode=== DATE_MODE.SINGLE){
        if(!date){
            return ANALYSIS_TYPE.INVALID
        }
        if(categories.length===0){
            return ANALYSIS_TYPE.INVALID
        }
        if(categories.length===1){
            return ANALYSIS_TYPE.SINGLE_DATE_CATEGORY;
        }
        return ANALYSIS_TYPE.SINGLE_DATE_MULTI_CATEGORY;
    }

    // DATE RANGE MODE

    if(dateMode===DATE_MODE.RANGE){
        if(!from|| !to){
            return ANALYSIS_TYPE.INVALID;
        }
        if(categories.length===0){
            return ANALYSIS_TYPE.DATE_RANGE;
        }
        if(categories.length===1){
            return ANALYSIS_TYPE.DATE_RANGE_CATEGORY
        }
        return ANALYSIS_TYPE.DATE_RANGE_MULTI_CATEGORY
    }
    return ANALYSIS_TYPE.INVALID
}