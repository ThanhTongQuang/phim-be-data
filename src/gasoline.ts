import { DOMParser } from '@xmldom/xmldom'
import { GasolineSchema } from './mongoose/gasoline';
import { Gasoline } from './models/gasoline';


export const parseGasoline = async () => {
  console.log("[Gasoline]: Start fetch gasoline");
  const price: Gasoline = {
    RON95III: undefined,
    RON95V: undefined,
    E5RON92: undefined,
    DO0001SV: undefined,
    DO005SII: undefined,
    Oil: undefined,
    lastModified: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  const idx = 2;
  const result = await (await fetch('https://vnexpress.net/chu-de/gia-xang-dau-3026')).text();
  const tableText = result.slice(result.indexOf("<table"), result.indexOf("</table") + 8);
  const doc = new DOMParser().parseFromString(tableText, 'text/html');
  const table = doc.childNodes[0];
  const tbody = table.childNodes[0];
  const trs = tbody.childNodes;
  for (let i = 0; i < trs.length; i++) {
    const tds = trs[i].childNodes;
    const title = tds[0].textContent;
    const value = tds[idx].textContent;
    if (title && value) {
      if (title.includes('RON 95-III')) {
        price.RON95III = +value;
      } else if (title.includes('E5 RON')) {
        price.E5RON92 = +value;
      } else if (title.includes('diesel')) {
        price.DO005SII = +value;
      } else if (title.includes('hỏa')) {
        price.Oil = +value;
      }
    }
  }
  const gasolineSchema = new GasolineSchema(price);
  gasolineSchema.save();
  console.log("[Gasoline]: End fetch gasoline");
  return price;
}

export const getGasoline = async () => {
  const day = new Date();
  const result = await GasolineSchema.find({year: day.getFullYear() });
  console.log(result);
  return result;
}
