import axios from "./axios";

// summary
export const getSummary = (uploadId) => {
    return axios.get(`/analysis/${uploadId}/summary`);
};

// category all time
export const getCategory = (uploadId) => {
    return axios.get(`/analysis/${uploadId}/category`);
};

// multi category without date
export const getMultiCategory = (uploadId, categories) => {
    return axios.post(`/analysis/${uploadId}/multi-category`, {
        categories
    });
};

// single date category
export const getDateCategory = (uploadId, date) => {
    return axios.get(`/analysis/${uploadId}/date-category`, {
        params: { date }
    });
};

// date range
export const getDateRange = (uploadId, from, to) => {
    return axios.get(`/analysis/${uploadId}/date-range`, {
        params: { from, to }
    });
};

// date range category
export const getDateRangeCategory = (uploadId, from, to) => {
    return axios.get(`/analysis/${uploadId}/date-range-category`, {
        params: { from, to }
    });
};

// date range multi category
export const getDateRangeMultiCategory = (
    uploadId,
    from,
    to,
    categories
) => {
    return axios.post(
        `/analysis/${uploadId}/date-range-multi-category`,
        { from, to, categories }
    );
};

// date multi category
export const getDateMultiCategory = (
    uploadId,
    date,
    categories
) => {
    return axios.post(
        `/analysis/${uploadId}/date-multi-category`,
        { date, categories }
    );
};

// metadata
export const getMetadata = (uploadId) => {
    return axios.get(`/analysis/${uploadId}/metadata`);
};
