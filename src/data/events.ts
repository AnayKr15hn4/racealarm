import { RaceEvent } from './types';

export const FLAGS: Record<string, string> = {
  AU:'🇦🇺',CN:'🇨🇳',JP:'🇯🇵',BH:'🇧🇭',SA:'🇸🇦',US:'🇺🇸',CA:'🇨🇦',MC:'🇲🇨',ES:'🇪🇸',AT:'🇦🇹',GB:'🇬🇧',BE:'🇧🇪',HU:'🇭🇺',NL:'🇳🇱',IT:'🇮🇹',AZ:'🇦🇿',SG:'🇸🇬',MX:'🇲🇽',BR:'🇧🇷',QA:'🇶🇦',AE:'🇦🇪',FR:'🇫🇷',DE:'🇩🇪',SM:'🇸🇲',ID:'🇮🇩',MY:'🇲🇾',PT:'🇵🇹',TH:'🇹🇭'
};

// Landmark races get gold treatment
export const LANDMARK_EVENTS = new Set([
  'f1-mon','f1-abu','f1-lvg','f1-gbr','f1-ita', // Monaco, season finale, Las Vegas, Silverstone, Monza
  'wec-lem', // 24H of Le Mans
  'imsa-day', // Rolex 24 at Daytona
  'imsa-seb', // 12H of Sebring
]);

const s = (t:string,d:string,m:number) => ({t,d,m});
const e = (id:string,sid:string,n:string,c:string,cc:string,ci:string,ss:{t:string,d:string,m:number}[]):RaceEvent=>({
  id,seriesId:sid,name:n,country:c,countryCode:cc,circuit:ci,
  sessions:ss.map((x,i)=>({id:`${id}-${i}`,eventId:id,seriesId:sid,type:x.t,dateUTC:x.d,durationMinutes:x.m}))
});

export const EVENTS: RaceEvent[] = [
  // === F1 2026 ===
  e('f1-aus','f1','Australian Grand Prix','Australia','AU','Albert Park',[s('FP1','2026-03-06T01:30:00Z',60),s('FP2','2026-03-06T05:00:00Z',60),s('FP3','2026-03-07T01:30:00Z',60),s('Qualifying','2026-03-07T05:00:00Z',60),s('Race','2026-03-08T04:00:00Z',120)]),
  e('f1-chn','f1','Chinese Grand Prix','China','CN','Shanghai',[s('FP1','2026-03-13T03:30:00Z',60),s('Sprint Qualifying','2026-03-13T07:30:00Z',45),s('Sprint','2026-03-14T03:00:00Z',30),s('Qualifying','2026-03-14T07:00:00Z',60),s('Race','2026-03-15T06:00:00Z',120)]),
  e('f1-jpn','f1','Japanese Grand Prix','Japan','JP','Suzuka',[s('FP1','2026-03-27T02:30:00Z',60),s('FP2','2026-03-27T06:00:00Z',60),s('FP3','2026-03-28T02:30:00Z',60),s('Qualifying','2026-03-28T06:00:00Z',60),s('Race','2026-03-29T05:00:00Z',120)]),
  e('f1-bhr','f1','Bahrain Grand Prix','Bahrain','BH','Sakhir',[s('FP1','2026-04-10T11:30:00Z',60),s('FP2','2026-04-10T15:00:00Z',60),s('FP3','2026-04-11T11:30:00Z',60),s('Qualifying','2026-04-11T15:00:00Z',60),s('Race','2026-04-12T15:00:00Z',120)]),
  e('f1-sau','f1','Saudi Arabian Grand Prix','Saudi Arabia','SA','Jeddah',[s('FP1','2026-04-17T13:30:00Z',60),s('FP2','2026-04-17T17:00:00Z',60),s('FP3','2026-04-18T13:30:00Z',60),s('Qualifying','2026-04-18T17:00:00Z',60),s('Race','2026-04-19T17:00:00Z',120)]),
  e('f1-mia','f1','Miami Grand Prix','USA','US','Miami',[s('FP1','2026-05-01T17:30:00Z',60),s('Sprint Qualifying','2026-05-01T21:30:00Z',45),s('Sprint','2026-05-02T16:00:00Z',30),s('Qualifying','2026-05-02T20:00:00Z',60),s('Race','2026-05-03T20:00:00Z',120)]),
  e('f1-can','f1','Canadian Grand Prix','Canada','CA','Montréal',[s('FP1','2026-05-22T17:30:00Z',60),s('FP2','2026-05-22T21:00:00Z',60),s('FP3','2026-05-23T17:30:00Z',60),s('Qualifying','2026-05-23T21:00:00Z',60),s('Race','2026-05-24T18:00:00Z',120)]),
  e('f1-mon','f1','Monaco Grand Prix','Monaco','MC','Monte Carlo',[s('FP1','2026-06-05T11:30:00Z',60),s('FP2','2026-06-05T15:00:00Z',60),s('FP3','2026-06-06T10:30:00Z',60),s('Qualifying','2026-06-06T14:00:00Z',60),s('Race','2026-06-07T13:00:00Z',120)]),
  e('f1-esp','f1','Spanish Grand Prix','Spain','ES','Barcelona',[s('FP1','2026-06-12T11:30:00Z',60),s('FP2','2026-06-12T15:00:00Z',60),s('FP3','2026-06-13T10:30:00Z',60),s('Qualifying','2026-06-13T14:00:00Z',60),s('Race','2026-06-14T13:00:00Z',120)]),
  e('f1-aut','f1','Austrian Grand Prix','Austria','AT','Red Bull Ring',[s('FP1','2026-06-26T11:30:00Z',60),s('Sprint Qualifying','2026-06-26T15:30:00Z',45),s('Sprint','2026-06-27T10:00:00Z',30),s('Qualifying','2026-06-27T14:00:00Z',60),s('Race','2026-06-28T13:00:00Z',120)]),
  e('f1-gbr','f1','British Grand Prix','United Kingdom','GB','Silverstone',[s('FP1','2026-07-03T11:30:00Z',60),s('FP2','2026-07-03T15:00:00Z',60),s('FP3','2026-07-04T10:30:00Z',60),s('Qualifying','2026-07-04T14:00:00Z',60),s('Race','2026-07-05T14:00:00Z',120)]),
  e('f1-bel','f1','Belgian Grand Prix','Belgium','BE','Spa-Francorchamps',[s('FP1','2026-07-17T11:30:00Z',60),s('Sprint Qualifying','2026-07-17T15:30:00Z',45),s('Sprint','2026-07-18T10:30:00Z',30),s('Qualifying','2026-07-18T14:00:00Z',60),s('Race','2026-07-19T13:00:00Z',120)]),
  e('f1-hun','f1','Hungarian Grand Prix','Hungary','HU','Hungaroring',[s('FP1','2026-07-24T11:30:00Z',60),s('FP2','2026-07-24T15:00:00Z',60),s('FP3','2026-07-25T10:30:00Z',60),s('Qualifying','2026-07-25T14:00:00Z',60),s('Race','2026-07-26T13:00:00Z',120)]),
  e('f1-ned','f1','Dutch Grand Prix','Netherlands','NL','Zandvoort',[s('FP1','2026-08-21T10:30:00Z',60),s('FP2','2026-08-21T14:00:00Z',60),s('FP3','2026-08-22T09:30:00Z',60),s('Qualifying','2026-08-22T13:00:00Z',60),s('Race','2026-08-23T13:00:00Z',120)]),
  e('f1-ita','f1','Italian Grand Prix','Italy','IT','Monza',[s('FP1','2026-09-04T11:30:00Z',60),s('FP2','2026-09-04T15:00:00Z',60),s('FP3','2026-09-05T10:30:00Z',60),s('Qualifying','2026-09-05T14:00:00Z',60),s('Race','2026-09-06T13:00:00Z',120)]),
  e('f1-mad','f1','Madrid Grand Prix','Spain','ES','Madrid',[s('FP1','2026-09-11T11:30:00Z',60),s('FP2','2026-09-11T15:00:00Z',60),s('FP3','2026-09-12T10:30:00Z',60),s('Qualifying','2026-09-12T14:00:00Z',60),s('Race','2026-09-13T13:00:00Z',120)]),
  e('f1-aze','f1','Azerbaijan Grand Prix','Azerbaijan','AZ','Baku',[s('FP1','2026-09-24T07:30:00Z',60),s('FP2','2026-09-24T11:00:00Z',60),s('FP3','2026-09-25T07:30:00Z',60),s('Qualifying','2026-09-25T11:00:00Z',60),s('Race','2026-09-26T11:00:00Z',120)]),
  e('f1-sin','f1','Singapore Grand Prix','Singapore','SG','Marina Bay',[s('FP1','2026-10-09T09:30:00Z',60),s('FP2','2026-10-09T13:00:00Z',60),s('FP3','2026-10-10T09:30:00Z',60),s('Qualifying','2026-10-10T13:00:00Z',60),s('Race','2026-10-11T12:00:00Z',120)]),
  e('f1-usa','f1','United States Grand Prix','USA','US','Austin',[s('FP1','2026-10-23T17:30:00Z',60),s('Sprint Qualifying','2026-10-23T21:30:00Z',45),s('Sprint','2026-10-24T18:00:00Z',30),s('Qualifying','2026-10-24T22:00:00Z',60),s('Race','2026-10-25T19:00:00Z',120)]),
  e('f1-mex','f1','Mexican Grand Prix','Mexico','MX','Autódromo Hermanos Rodríguez',[s('FP1','2026-10-30T18:30:00Z',60),s('FP2','2026-10-30T22:00:00Z',60),s('FP3','2026-10-31T17:30:00Z',60),s('Qualifying','2026-10-31T21:00:00Z',60),s('Race','2026-11-01T20:00:00Z',120)]),
  e('f1-bra','f1','Brazilian Grand Prix','Brazil','BR','Interlagos',[s('FP1','2026-11-06T14:30:00Z',60),s('Sprint Qualifying','2026-11-06T18:30:00Z',45),s('Sprint','2026-11-07T14:00:00Z',30),s('Qualifying','2026-11-07T18:00:00Z',60),s('Race','2026-11-08T17:00:00Z',120)]),
  e('f1-lvg','f1','Las Vegas Grand Prix','USA','US','Las Vegas Strip',[s('FP1','2026-11-20T02:30:00Z',60),s('FP2','2026-11-20T06:00:00Z',60),s('FP3','2026-11-21T02:30:00Z',60),s('Qualifying','2026-11-21T06:00:00Z',60),s('Race','2026-11-22T06:00:00Z',120)]),
  e('f1-qat','f1','Qatar Grand Prix','Qatar','QA','Lusail',[s('FP1','2026-11-27T11:30:00Z',60),s('FP2','2026-11-27T15:00:00Z',60),s('FP3','2026-11-28T12:30:00Z',60),s('Qualifying','2026-11-28T16:00:00Z',60),s('Race','2026-11-29T14:00:00Z',120)]),
  e('f1-abu','f1','Abu Dhabi Grand Prix','UAE','AE','Yas Marina',[s('FP1','2026-12-04T09:30:00Z',60),s('FP2','2026-12-04T13:00:00Z',60),s('FP3','2026-12-05T10:30:00Z',60),s('Qualifying','2026-12-05T14:00:00Z',60),s('Race','2026-12-06T13:00:00Z',120)]),
  // === WEC 2026 ===
  e('wec-imo','wec','6 Hours of Imola','Italy','IT','Imola',[s('Practice','2026-04-17T08:00:00Z',90),s('Qualifying','2026-04-17T14:00:00Z',30),s('Hyperpole','2026-04-17T14:45:00Z',15),s('Race','2026-04-18T10:00:00Z',360)]),
  e('wec-spa','wec','6 Hours of Spa','Belgium','BE','Spa-Francorchamps',[s('Practice','2026-05-07T09:00:00Z',90),s('Qualifying','2026-05-08T10:30:00Z',30),s('Race','2026-05-09T10:30:00Z',360)]),
  e('wec-lem','wec','24 Hours of Le Mans','France','FR','Circuit de la Sarthe',[s('Practice','2026-06-10T14:00:00Z',180),s('Qualifying','2026-06-11T19:00:00Z',60),s('Hyperpole','2026-06-12T19:00:00Z',30),s('Race','2026-06-13T14:00:00Z',1440)]),
  e('wec-bra','wec','6 Hours of São Paulo','Brazil','BR','Interlagos',[s('Practice','2026-07-10T13:00:00Z',90),s('Qualifying','2026-07-11T13:00:00Z',30),s('Race','2026-07-12T12:00:00Z',360)]),
  e('wec-cot','wec','Lone Star Le Mans','USA','US','COTA',[s('Practice','2026-09-04T15:00:00Z',90),s('Qualifying','2026-09-05T16:00:00Z',30),s('Race','2026-09-06T11:00:00Z',360)]),
  e('wec-fuj','wec','6 Hours of Fuji','Japan','JP','Fuji Speedway',[s('Practice','2026-09-25T01:00:00Z',90),s('Qualifying','2026-09-26T01:00:00Z',30),s('Race','2026-09-27T01:00:00Z',360)]),
  e('wec-bcn','wec','6 Hours of Barcelona','Spain','ES','Circuit de Barcelona-Catalunya',[s('Practice','2026-10-16T08:00:00Z',90),s('Qualifying','2026-10-17T10:30:00Z',30),s('Race','2026-10-18T10:00:00Z',360)]),
  e('wec-mon','wec','6 Hours of Monza','Italy','IT','Monza',[s('Practice','2026-11-06T08:00:00Z',90),s('Qualifying','2026-11-07T10:30:00Z',30),s('Race','2026-11-08T10:00:00Z',360)]),
  // === IMSA 2026 ===
  e('imsa-day','imsa','Rolex 24 at Daytona','USA','US','Daytona International Speedway',[s('Practice','2026-01-21T14:00:00Z',90),s('Qualifying','2026-01-23T18:00:00Z',30),s('Race','2026-01-24T18:40:00Z',1440)]),
  e('imsa-seb','imsa','12 Hours of Sebring','USA','US','Sebring International Raceway',[s('Practice','2026-03-19T14:00:00Z',90),s('Qualifying','2026-03-20T15:00:00Z',30),s('Race','2026-03-21T14:40:00Z',720)]),
  e('imsa-wgl','imsa',"Sahlen's 6H at The Glen",'USA','US','Watkins Glen',[s('Practice','2026-06-25T14:00:00Z',90),s('Qualifying','2026-06-26T12:00:00Z',20),s('Race','2026-06-27T14:40:00Z',360)]),
  e('imsa-plm','imsa','Petit Le Mans','USA','US','Road Atlanta',[s('Practice','2026-10-01T14:00:00Z',90),s('Qualifying','2026-10-02T14:00:00Z',20),s('Race','2026-10-03T15:10:00Z',600)]),
  // === MotoGP 2026 (remaining) ===
  e('mgp-ara','motogp','Gran Premio de Aragón','Spain','ES','MotorLand Aragón',[s('FP1','2026-08-28T07:45:00Z',45),s('Practice','2026-08-28T12:00:00Z',60),s('Qualifying','2026-08-29T08:50:00Z',30),s('Sprint','2026-08-29T13:00:00Z',25),s('Race','2026-08-30T12:00:00Z',45)]),
  e('mgp-smr','motogp','Gran Premio di San Marino','San Marino','SM','Misano World Circuit',[s('FP1','2026-09-11T07:45:00Z',45),s('Practice','2026-09-11T12:00:00Z',60),s('Qualifying','2026-09-12T08:50:00Z',30),s('Sprint','2026-09-12T13:00:00Z',25),s('Race','2026-09-13T12:00:00Z',45)]),
  e('mgp-jpn','motogp','Japanese Grand Prix','Japan','JP','Mobility Resort Motegi',[s('FP1','2026-10-02T01:45:00Z',45),s('Practice','2026-10-02T06:00:00Z',60),s('Qualifying','2026-10-03T02:50:00Z',30),s('Sprint','2026-10-03T07:00:00Z',25),s('Race','2026-10-04T04:00:00Z',45)]),
  e('mgp-aus','motogp','Australian Grand Prix','Australia','AU','Phillip Island',[s('FP1','2026-10-22T23:45:00Z',45),s('Practice','2026-10-23T04:00:00Z',60),s('Qualifying','2026-10-24T00:50:00Z',30),s('Sprint','2026-10-24T05:00:00Z',25),s('Race','2026-10-25T03:00:00Z',45)]),
  e('mgp-qat','motogp','Qatar Grand Prix','Qatar','QA','Lusail International Circuit',[s('FP1','2026-11-06T12:45:00Z',45),s('Practice','2026-11-06T17:00:00Z',60),s('Qualifying','2026-11-07T13:50:00Z',30),s('Sprint','2026-11-07T18:00:00Z',25),s('Race','2026-11-08T16:00:00Z',45)]),
  // === DTM 2026 ===
  e('dtm-rbr','dtm','Red Bull Ring','Austria','AT','Red Bull Ring',[s('Practice','2026-04-24T08:00:00Z',45),s('Qualifying','2026-04-24T12:00:00Z',20),s('Race 1','2026-04-25T13:30:00Z',60),s('Race 2','2026-04-26T13:30:00Z',60)]),
  e('dtm-zan','dtm','Zandvoort','Netherlands','NL','Circuit Zandvoort',[s('Practice','2026-05-22T08:00:00Z',45),s('Qualifying','2026-05-22T12:00:00Z',20),s('Race 1','2026-05-23T13:30:00Z',60),s('Race 2','2026-05-24T13:30:00Z',60)]),
  e('dtm-nor','dtm','Norisring','Germany','DE','Norisring',[s('Practice','2026-07-03T08:00:00Z',45),s('Qualifying','2026-07-03T12:00:00Z',20),s('Race 1','2026-07-04T13:30:00Z',60),s('Race 2','2026-07-05T13:30:00Z',60)]),
  e('dtm-hoc','dtm','Hockenheimring','Germany','DE','Hockenheimring',[s('Practice','2026-10-09T08:00:00Z',45),s('Qualifying','2026-10-09T12:00:00Z',20),s('Race 1','2026-10-10T13:30:00Z',60),s('Race 2','2026-10-11T13:30:00Z',60)]),
];
