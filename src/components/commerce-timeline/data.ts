import type { TimelinePhase } from "./types";

export const commerceTimelineData: TimelinePhase[] = [
  {
    id: "pre-commerce",
    title: "PRE COMMERCE",
    description: "The advent of GSM technology and mobile internet.",
    startYear: 2000,
    endYear: 2007,
    theme: "orange",
    years: [
      {
        id: "pre-commerce-2000",
        year: 2000,
        yearLabel: "Early 90s/2000s",
        events: [
          {
            id: "event-1",
            title: "Kenya",
            description: [
              "The telecom industry was liberalised in",
              "the 2000, creating a demand for fixed",
              "line connections",
            ],
            vector: "vector-a",
            contentPosition: "upper-left",
          },
        ],
      },
      {
        id: "pre-commerce-2002",
        year: 2002,
        yearLabel: "2002",
        events: [
          {
            id: "event-2",
            title: "South Africa",
            description: [
              "TThe Global System for Mobile, the global",
              "standard for mobile communication",
              "was implemented in 1993.",
            ],
            vector: "vector-b",
            contentPosition: "flush-top-left",
          },
        ],
      },
      {
        id: "pre-commerce-2006",
        year: 2006,
        yearLabel: "2006",
        events: [
          {
            id: "event-3",
            title: "Nigeria",
            description: [
              "GSM service rolls out after the NCC",
              "hands out Digital Mobile Licences to",
              "Econet, MTN and NITEL in March 2001.",
            ],
            vector: "vector-c",
            contentPosition: "top-left",
          },
        ],
      },
      {
        id: "pre-commerce-2007",
        year: 2007,
        yearLabel: "2007",
        events: [
          {
            id: "event-66",
            title: "PriceCheck",
            description: [
              "Online product and price comparison platform,",
              "PriceCheck kicked off in South Africa in 2006",
              "and launched in Nigeria in 2012.",
            ],
            vector: "vector-a",
            contentPosition: "lower-left",
          },
        ],
      },
      {
        id: "pre-commerce-20444",
        year: 2007,
        yearLabel: "2007",
        events: [
          {
            id: "event-611",
            title: "M-PESA",
            description: [
              "M-PESA, a mobile money platform from",
              "Safaricom, launches in Kenya kickstarting a mobile",
              "money revolution across the continent powering",
              "237 million transactions monthly in 2019.",
            ],
            vector: "vector-b",
            contentPosition: "flush-top-left",
          },
        ],
      },
    ],
  },
  {
    id: "explosion",
    title: "EXPLOSION",
    description: "Jumia and Konga Launch",
    startYear: 2009,
    endYear: 2016,
    theme: "red",
    years: [
      {
        id: "explosion-2009-a",
        year: 2009,
        yearLabel: "2009",
        events: [
          {
            id: "event-2009-4",
            title: "Kalahari",
            description: [
              "GSM service rolls out after the NCC",
              "hands out Digital Mobile Licences to ",
              "Econet, MTN and NITEL in March 2001.",
            ],
            vector: "vector-c",
            contentPosition: "top-left",
          },
        ],
      },

      {
        id: "explosion-2010",
        year: 2010,
        yearLabel: "2010",
        events: [
          {
            id: "event-4",
            title: "Jumia",
            description: [
              "Founded by Rocket Internet, Africa Internet",
              "Group (AIG) launched Jumia in Nigeria in 2012",
              "and soon expands to Morocco, South Africa,",
              "and Egypt",
            ],
            vector: "vector-a",
            contentPosition: "center-left",
          },
        ],
      },
      {
        id: "explosion-2010-b",
        year: 2012,
        yearLabel: "2012",
        events: [
          {
            id: "event-5",
            title: "Konga",
            description: [
              "Launched in Nigeria in July 2012 by Havard",
              "MBA grad and serial entrepreneur, Sim Shagaya",
              "as an online platform that specialised",
              "in baby and personal care products",
            ],
            vector: "vector-e",
            contentPosition: "lower-left",
          },
        ],
      },
      {
        id: "explosion-2016",
        year: 2016,
        yearLabel: "2016",
        events: [
          {
            id: "event-6",
            title: "Kalahari",
            description: [
              "Naspers-owned Kalahari a South Africa based ",
              "online platform merges with its toughest competitor",
              "Takealot. Kalahari was nixed in 2016 and",
              "in 2018 Naspers acquired a 96% stake in Takealot",
            ],
            vector: "vector-c",
            contentPosition: "high-left",
          },
        ],
      },
    ],
  },
  {
    id: "growth",
    title: "GROWTH PHASE",
    description: "Safaricom launches eCommerce store",
    startYear: 2017,
    endYear: 2020,
    theme: "green",
    years: [
      {
        id: "growth-2017",
        year: 2017,
        yearLabel: "2017",
        events: [
          {
            id: "event-10",
            title: "Safaricom",
            description: [
              "Founded by Rocket Internet, Africa Internet",
              "Group (AIG) launched Jumia in Nigeria in 2012",
              "and soon expands to Morocco, South Africa,",
              "and Egypt",
            ],
            vector: "vector-a",
            contentPosition: "upper-left",
          },
        ],
      },
      {
        id: "growth-2018",
        year: 2018,
        yearLabel: "2018",
        events: [
          {
            id: "event-15",
            title: "DHL & Mall for Africa",
            description: [
              "DHL partners with MallforAfrica to launch",
              "a new online shopping app, AfricaeShop, and",
              "expands to 34 African countries.",
            ],
            vector: "vector-e",
            contentPosition: "lower-left",
          },
        ],
      },
      {
        id: "growth-2019",
        year: 2019,
        yearLabel: "2019",

        events: [
          {
            id: "event-16",
            title: "Jumia",
            description: [
              "Touted as Africa's first unicorn and active",
              "in 14 countries, Jumia becomes the first African",
              "startup to be listed on the New York",
              "Stock Exchange",
            ],
            vector: "vector-c",
            contentPosition: "high-left",
          },
        ],
      },
    ],
  },
];

// One phase per theme — a theme lookup doubles as a phase lookup.
export const phaseByTheme = new Map(
  commerceTimelineData.map((phase) => [phase.theme, phase] as const),
);

// Every event, flattened in chronological order — what the track scrubs through.
export const trackItems = commerceTimelineData.flatMap((phase) =>
  phase.years.flatMap((year) =>
    year.events.map((event) => ({ phase, year, event })),
  ),
);
