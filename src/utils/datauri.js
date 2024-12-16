const DataUriParser = require("datauri/parser.js")
const path = require("path");

const parser = new DataUriParser();
const fs = require("fs/promises");

const getDataUri = (file) => {
    try {
      // Validate the file object
      if (!file || !file.buffer || !file.mimetype) {
        throw new Error("Invalid file object. Ensure it contains 'buffer' and 'mimetype'.");
      }
  
      // Convert the buffer to Base64
      const base64File = file.buffer.toString("base64");
  
      // Generate and return the Data URI
      return `data:${file.mimetype};base64,${base64File}`;
    } catch (error) {
      console.error("Error generating Data URI:", error.message);
      throw error; // Rethrow the error to handle it in calling code
    }
  };
  
  module.exports = getDataUri;
  


  
