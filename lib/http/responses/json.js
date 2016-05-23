"use strict";

module.exports = function(res, status, data, additional_meta) {
  let doc = {};
  
  doc.meta = {
    time: new Date().getTime()
  };

  if(data)
    doc.data = data;

  for(let key in (additional_meta || {})) {
    let has_own = additional_meta.hasOwnProperty(key);
    if(!has_own) continue;
    doc.meta[key] = additional_meta[key];
  }

  return res.status(status).json(doc);
};
