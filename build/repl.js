"use strict";import i from"readline";import n from"./eval";const a=">> ",u=i.createInterface({input:process.stdin,output:process.stdout});let e,o,l=new n(e,o);function s(){u.question(a,r=>{p(r)||console.log(l.eval(r)),s()})}function p(r){const t=r.split(`
`)[0];if(t==="exit")return console.log("Thanks for playing!"),process.exit(0);if(t.includes("repl.data = "))return e=t.split("repl.data = ")[1],console.log("Setting repl data to",e),l=new n(e,o),!0;if(t.includes("repl.rules = "))return o=t.split("repl.rules = ")[1],console.log("Setting repl rules to",o),l=new n(e,o),!0}s();
