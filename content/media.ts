/**
 * Central image registry. Every photo on the site is referenced from here,
 * so swapping stock photography for real clinic photos is a one-file change.
 * Local files can be dropped in /public/images and referenced as "/images/…".
 */
// Capped at 2000px so the optimizer never has to download full camera originals.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

export const media = {
  heroCover: unsplash("1550831107-1553da8c8464"),
  doctorPortrait: unsplash("1612531386530-97286d97c2d2"),
  doctorPortraitAlt: unsplash("1612349317150-e413f6a5b16d"),
  doctorWithPatient: unsplash("1581056771107-24ca5f033842"),
  surgeryTeam: unsplash("1579684385127-1ef15d508118"),
  operatingRoom: unsplash("1516549655169-df83a0774514"),
  reception: unsplash("1519494026892-80bbd2d6fd0d"),
  consultation: unsplash("1666214280391-8ff5bd3c0bf0"),
  xray: unsplash("1581595219315-a187dd40c322"),
  arthroscopy: unsplash("1571772996211-2f02c9727629"),
  running: unsplash("1607962837359-5e7e89f86776"),
  spineScan: unsplash("1666214280557-f1b5022eb634"),
  prp: unsplash("1576671081837-49000212a370"),
  rehab: unsplash("1571019613454-1cb2f99b2d8b"),
  treatmentRoom: unsplash("1551076805-e1869033e561"),
  brace: unsplash("1597764690523-15bea4c581c9"),
  stethoscope: unsplash("1505751172876-fa1923c5c528"),
  coat: unsplash("1532938911079-1b06ac7ceec7"),
  laptop: unsplash("1576091160550-2173dba999ef"),
  exercise: unsplash("1518611012118-696072aa579a"),
  yoga: unsplash("1544367567-0f2fcb009e0b"),
  care: unsplash("1584515933487-779824d29309"),
  phone: unsplash("1576091160399-112ba8d25d1d"),
  scrubs: unsplash("1622253692010-333f2da6031d"),
  masked: unsplash("1582750433449-648ed127bb54"),
  checkup: unsplash("1631815589968-fdb09a223b1e"),
  lab: unsplash("1579154204601-01588f351e67"),
} as const;
