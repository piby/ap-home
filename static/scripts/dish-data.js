/*
    [0, 'butelka', 'butelki', 'butelki', 'butelek', ''],
    [1, 'sloik', 'sloika', 'sloiki', 'sloikow', ''],
    [2, 'sztuka', 'sztuki', 'sztuki', 'sztuk', ''],
    [3, 'szklanka', 'szklanki', 'szklanki', 'szklanek', ''],
    [4, 'litr', 'litra', 'litry', 'litrow', ''],
    [5, 'lyzka', 'lyzki', 'lyzki', 'lyzek', ''],
    [6, 'lyzeczka', 'lyzeczki', 'lyzeczki', 'lyzeczek', ''],
    [7, 'paczka', 'paczki', 'paczki', 'paczek', ''],
    [8, 'puszka', 'puszki', 'puszki', 'puszek', ''],
    [9, 'opakowanie', 'opakowania', 'opakowania', 'opakowan', ''],
    [10, 'worek', 'worka', 'worki', 'workow', ''],
    [11, 'kilogram', 'kilograma', 'kilogramy', 'kilogramow', ''],
    [12, 'karton', 'kartonu', 'kartony', 'kartonow', '']

    [1, 'ogorek gruntowy', 1, 'sztuka', ''],
    [2, 'ogorek szklarniowy', 1, 'sztuka', ''],
    [3, 'cebula', 1, 'sztuka', ''],
    [4, 'papryka czerwona', 1, 'sztuka', ''],
    [5, 'papryka zielona', 1, 'sztuka', ''],
    [6, 'papryka zolta', 1, 'sztuka', ''],
    [7, 'makaron swiderki', 0.5, 'paczka', '']

    [1, 'smazone', ''],
    [2, 'pieczone', ''],
    [3, 'gotowane', ''],
    [4, 'dobry sos', ''],
    [5, 'proste', ''],
    [6, 'skaplikowane', ''],
    [7, 'szybkie', '']
*/

var dishData = [
  {
    id: 1,
    name:'Omlet',
	meal:'breakfast',
    photo: 'http://www.mojegotowanie.pl/var/self/storage/images/media/images/przepisy/miesa/omlet_z_cukinia_i_szynka/3758778-1-pol-PL/omlet_z_cukinia_i_szynka_popup_watermark.jpg',
    ingredients: [
        {
            name: 'jajka',
            quantity: 4,
            unit: 'sztuki'
        },
        {
            name: 'papryka',
            quantity: 0.5,
            unit: 'sztuki'
        },
        {
            name: 'oliwki',
            quantity: 15,
            unit: 'sztuk'
        }
    ],
    optional_ingredients: [
    ],
    reciepe: [
        'Posiekać dodatki',
        'Roztrzepać jajka',
        'Wylać jajka na rozgrzaną patelnie',
        'Po chwili dosypać dodatki',
        'Smarzyć na małym ogniu pod przykryciem',
        'Po 10 minutach obrócić omlet na drugą stronę'
    ],
    keywords: [
        'jajka',
        'papryka',
        'smażone'
    ]
  },
  {
    id: 2,
    name:'Kanapki z żółtym serem',
	meal:'breakfast',
    photo: '',
    ingredients: [
        {
            name: 'chleb',
            quantity: 8,
            unit: 'kromek'
        },
        {
            name: 'masło',
            quantity: 8,
            unit: 'nożyków'
        },
        {
            name: 'żółty ser',
            quantity: 8,
            unit: 'plasterków'
        },
        {
            name: 'pomidor',
            quantity: 2,
            unit: 'sztuki'
        }
    ],
    optional_ingredients: [
    ],
    reciepe: [
        'Posmarować kanapki masłem',
        'Ułożyć dodatki na chlebie'
    ],
    keywords: [
        'kanapki'
    ]
  }
];
