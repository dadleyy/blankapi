"use strict";

const tokens = /YYYY|MM|DD|hh|mm|ss/g;

function pad(x, c) {
  let s = `${x ? x : 0}`;
  while(s.length < c)
    s = `0${s}`;
  return s;
}

const fns = {
  YYYY: function(date) {
    return date.getFullYear();
  },

  MM: function(date) {
    let mins = date.getMonth() + 1;
    return pad(mins, 2);
  },

  DD: function(date) {
    let dd = date.getDate();
    return pad(dd, 2);
  },

  hh: function(date) {
    let hours = date.getHours();
    return pad(hours, 2);
  },

  mm: function(date) {
    let mins = date.getMinutes();
    return pad(mins, 2);
  },

  ss: function(date) {
    let secs = date.getSeconds();
    return pad(secs, 2);
  }
};

function parse(x) {
}

function format(x, format_str) {
  let date = x === null ? new Date() : parse(x);

  if(!date)
    return -1;

  function sub(match) {
    if(typeof fns[match] !== "function") return match;
    return fns[match](date);
  }

  return format_str.replace(tokens, sub);
}

module.exports = {format};
