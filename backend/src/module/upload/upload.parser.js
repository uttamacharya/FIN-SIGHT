import fs from "fs"
import fsPromises from "fs/promises"
import csv from 'csv-parser'
import path from 'path'
import XLSX from 'xlsx'
// import { error } from "console"
// import { date, promise, String } from 'zod'


export const parseFile = async (file) => {
    const ext = path.extname(file.originalname).toLowerCase()
    switch (ext) {
        case ".csv":
            return parseCSV(file.path)

        case ".xlsx":
        case ".xls":
            return parseExcel(file.path)

        case ".json":
            return parseJSON(file.path)

        default:
            throw new Error("unsupported file formet")
    }
}


// csv parser

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const rows = []
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                rows.push(row)
            })
            .on("end", () => {
                resolve(rows)
            })
            .on("error", (err) => {
                reject(err)
            })
    })
}


// excel parser

const parseExcel= (filePath)=>{
    const workBook=XLSX.readFile(filePath)
    const sheetName=workBook.SheetNames[0]
    const sheet= workBook.Sheets[sheetName]

    const rows= XLSX.utils.sheet_to_json(sheet)

    return rows
}


// json parser 
const parseJSON = async (filePath) => {
  let rawData;

  try {
    rawData = await fsPromises.readFile(filePath, "utf-8");
  } catch (err) {
    console.error("JSON READ ERROR:", err);
    throw new Error("Unable to read JSON file");
  }

  let data;
  try {
    data = JSON.parse(rawData);
  } catch (err) {
    console.error("JSON PARSE ERROR:", err.message);
    throw new Error("Invalid JSON format");
  }

  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects");
  }

  return data;
};


// const cleanRow= (row)=>{
//     return {
//         date: row.date ? String(row.date).trim() : null,
//         description: row.description ? String(row.description).trim(): null,
//         amount: row.amount !==undefined && row.amount !== null ? Number(row.amount) : null
//     }
// }