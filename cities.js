/* ====================================================
   SMART ROUTE FINDER — CITY DATA MODULE (EXPANDED)
   Separated from main HTML for scalability.
==================================================== */

const cities = {
    Lahore: [31.5204, 74.3587],
    Faisalabad: [31.4504, 73.1350],
    Multan: [30.1575, 71.5249],
    Gujranwala: [32.1877, 74.1945],
    Sialkot: [32.4945, 74.5229],
    Rawalpindi: [33.5651, 73.0169],
    Bahawalpur: [29.3956, 71.6836],
    Sargodha: [32.0740, 72.6861],
    Sahiwal: [30.6682, 73.1114],
    RahimYarKhan: [28.4212, 70.2989],
    Karachi: [24.8607, 67.0011],
    Sukkur: [27.7052, 68.8574],
    Hyderabad: [25.3960, 68.3578],
    Larkana: [27.5570, 68.2028],
    Peshawar: [34.0151, 71.5249],
    Abbottabad: [34.1688, 73.2215],
    Swat: [35.2227, 72.4258],
    Mardan: [34.1986, 72.0404],
    Islamabad: [33.6844, 73.0479],
    Quetta: [30.1798, 66.9750],
    Gwadar: [25.1264, 62.3225],
    Turbat: [26.0031, 63.0544],
    Gilgit: [35.8819, 74.4643],
    Skardu: [35.2971, 75.6333],
    Muzaffarabad: [34.3700, 73.4711],
    Gujrat: [32.5736, 74.0789],
    Sheikhupura: [31.7167, 73.9850],
    Jhang: [31.2781, 72.3317],
    DeraGhaziKhan: [30.0489, 70.6455],
    Kasur: [31.1154, 74.4436],
    Okara: [30.8138, 73.4534],
    Chiniot: [31.7200, 72.9789],
    Kamoke: [31.9752, 74.2230],
    Hafizabad: [32.0679, 73.6858],
    Sadiqabad: [28.3062, 70.1307],
    Burewala: [30.1667, 72.6500],
    Mianwali: [32.5839, 71.5370],
    Khanewal: [30.3017, 71.9321],
    Jhelum: [32.9405, 73.7276],
    Attock: [33.7667, 72.3667],
    Bhalwal: [32.2654, 72.8981],
    MandiBahauddin: [32.5861, 73.4917],
    Wazirabad: [32.4414, 74.1232],
    Kharian: [32.8110, 73.8650],
    Vehari: [30.0333, 72.3500],
    MianChannu: [30.4390, 72.3533],
    Chichawatni: [30.5333, 72.7000],
    MirpurKhas: [25.5251, 69.0159],
    Nawabshah: [26.2483, 68.4096],
    Jacobabad: [28.2769, 68.4382],
    Shikarpur: [27.9571, 68.6382],
    Dadu: [26.7303, 67.7769],
    TandoAdam: [25.7682, 68.6620],
    Khairpur: [27.5295, 68.7592],
    Thatta: [24.7475, 67.9258],
    Kohat: [33.5889, 71.4428],
    DeraIsmailKhan: [31.8327, 70.9015],
    Bannu: [32.9854, 70.6027],
    Charsadda: [34.1453, 71.7308],
    Nowshera: [34.0158, 71.9812],
    Mansehra: [34.3333, 73.2000],
    Chitral: [35.8511, 71.7864],
    Timargara: [34.8281, 71.8408],
    Khuzdar: [27.8110, 66.6114],
    Chaman: [30.9177, 66.4526],
    Zhob: [31.3411, 69.4481],
    Sibi: [29.5448, 67.8764],
    Loralai: [30.3705, 68.5980],
    Ormara: [25.2088, 64.6357],
    Pasni: [25.2630, 63.4810],
    Mirpur: [33.1428, 73.7710],
    Rawalakot: [33.8569, 73.7634],
    Kotli: [33.5184, 73.9023],
    Chilas: [35.4206, 74.0967],
    Hunza: [36.3167, 74.6500]
};

const graph = {
    Lahore: {
        Sheikhupura: 51,
        Kasur: 57,
        Kamoke: 65,
        Gujranwala: 94
    },
    Faisalabad: {
        Chiniot: 41,
        Okara: 96,
        Jhang: 98,
        Sargodha: 101
    },
    Multan: {
        Khanewal: 52,
        Vehari: 100,
        DeraGhaziKhan: 106,
        MianChannu: 106,
        Bahawalpur: 107
    },
    Gujranwala: {
        Lahore: 94,
        Kamoke: 29,
        Wazirabad: 36,
        Gujrat: 55,
        Sialkot: 57,
        Sheikhupura: 69,
        Hafizabad: 62
    },
    Sialkot: {
        Gujranwala: 57,
        Wazirabad: 47,
        Gujrat: 53,
        Kamoke: 80
    },
    Rawalpindi: {
        Islamabad: 16,
        Attock: 80,
        Abbottabad: 87,
        Rawalakot: 95
    },
    Bahawalpur: {
        Multan: 107,
        Vehari: 119,
        Khanewal: 129,
        DeraGhaziKhan: 154,
        RahimYarKhan: 216
    },
    Sargodha: {
        Faisalabad: 101,
        Bhalwal: 36,
        Chiniot: 60,
        Hafizabad: 117,
        Mianwali: 152
    },
    Sahiwal: {
        Okara: 45,
        Chichawatni: 52,
        Burewala: 88,
        MianChannu: 96
    },
    RahimYarKhan: {
        Sadiqabad: 26,
        Sukkur: 202,
        Shikarpur: 213,
        Bahawalpur: 216
    },
    Karachi: {
        Thatta: 117,
        Hyderabad: 186,
        TandoAdam: 243,
        Nawabshah: 261,
        Gwadar: 590,
        Ormara: 301,
        Pasni: 446
    },
    Sukkur: {
        RahimYarKhan: 202,
        Khairpur: 27,
        Shikarpur: 44,
        Larkana: 83,
        Jacobabad: 94,
        Sadiqabad: 177
    },
    Hyderabad: {
        Karachi: 186,
        TandoAdam: 64,
        MirpurKhas: 84,
        Thatta: 105,
        Nawabshah: 118
    },
    Larkana: {
        Sukkur: 83,
        Khairpur: 68,
        Shikarpur: 77,
        Jacobabad: 104,
        Dadu: 126,
        Khuzdar: 199
    },
    Peshawar: {
        Charsadda: 29,
        Nowshera: 52,
        Kohat: 59,
        Mardan: 64,
        Bannu: 178
    },
    Abbottabad: {
        Rawalpindi: 87,
        Mansehra: 22,
        Muzaffarabad: 40,
        Islamabad: 70,
        Rawalakot: 76
    },
    Swat: {
        Timargara: 86,
        Chitral: 113,
        Mardan: 148,
        Mansehra: 151,
        Hunza: 293
    },
    Mardan: {
        Peshawar: 64,
        Swat: 148,
        Nowshera: 26,
        Charsadda: 36,
        Attock: 70,
        Kohat: 109,
        Chitral: 231,
        Timargara: 90
    },
    Islamabad: {
        Rawalpindi: 16,
        Abbottabad: 70,
        Attock: 79,
        Rawalakot: 86,
        Muzaffarabad: 107,
        Mansehra: 91
    },
    Quetta: {
        Chaman: 120,
        Sibi: 139,
        Loralai: 196,
        Jacobabad: 318
    },
    Gwadar: {
        Pasni: 146,
        Turbat: 152,
        Ormara: 291,
        Karachi: 590
    },
    Turbat: {
        Gwadar: 152,
        Pasni: 115,
        Ormara: 226,
        Khuzdar: 507
    },
    Gilgit: {
        Hunza: 63,
        Chilas: 76,
        Skardu: 155,
        Muzaffarabad: 238
    },
    Skardu: {
        Gilgit: 155,
        Chilas: 175,
        Hunza: 179,
        Muzaffarabad: 278
    },
    Muzaffarabad: {
        Abbottabad: 40,
        Gilgit: 238,
        Skardu: 278,
        Mansehra: 31,
        Rawalakot: 78,
        Islamabad: 107,
        Chilas: 162
    },
    Gujrat: {
        Gujranwala: 55,
        Sialkot: 53,
        Wazirabad: 19,
        Kharian: 41,
        Jhelum: 65,
        MandiBahauddin: 68
    },
    Sheikhupura: {
        Lahore: 51,
        Kamoke: 45,
        Hafizabad: 60,
        Gujranwala: 69,
        Kasur: 99
    },
    Jhang: {
        Faisalabad: 98,
        Chiniot: 98,
        Chichawatni: 112,
        MianChannu: 116,
        DeraIsmailKhan: 186
    },
    DeraGhaziKhan: {
        Multan: 106,
        Bahawalpur: 154,
        Khanewal: 158,
        Vehari: 205,
        Zhob: 229,
        Loralai: 249
    },
    Kasur: {
        Lahore: 57,
        Sheikhupura: 99,
        Kamoke: 122,
        Okara: 125
    },
    Okara: {
        Faisalabad: 96,
        Sahiwal: 45,
        Kasur: 125,
        Chichawatni: 98
    },
    Chiniot: {
        Faisalabad: 41,
        Sargodha: 60,
        Jhang: 98,
        Bhalwal: 76,
        Hafizabad: 96
    },
    Kamoke: {
        Lahore: 65,
        Gujranwala: 29,
        Sialkot: 80,
        Sheikhupura: 45,
        Kasur: 122,
        Hafizabad: 64
    },
    Hafizabad: {
        Sargodha: 117,
        Sheikhupura: 60,
        Chiniot: 96,
        Kamoke: 64,
        Gujranwala: 62,
        Wazirabad: 73,
        Bhalwal: 96,
        MandiBahauddin: 75
    },
    Sadiqabad: {
        RahimYarKhan: 26,
        Sukkur: 177,
        Shikarpur: 189,
        Khairpur: 200
    },
    Burewala: {
        Sahiwal: 88,
        Vehari: 40,
        Chichawatni: 51,
        MianChannu: 51,
        Khanewal: 88
    },
    Mianwali: {
        Bannu: 122,
        DeraIsmailKhan: 128,
        Kohat: 140,
        Sargodha: 152
    },
    Khanewal: {
        Multan: 52,
        Bahawalpur: 129,
        DeraGhaziKhan: 158,
        Burewala: 88,
        MianChannu: 53,
        Vehari: 62
    },
    Jhelum: {
        Kharian: 24,
        Mirpur: 28,
        MandiBahauddin: 56,
        Gujrat: 65,
        Kotli: 82
    },
    Attock: {
        Rawalpindi: 80,
        Mardan: 70,
        Islamabad: 79,
        Nowshera: 56
    },
    Bhalwal: {
        Sargodha: 36,
        Chiniot: 76,
        MandiBahauddin: 82,
        Hafizabad: 96
    },
    MandiBahauddin: {
        Jhelum: 56,
        Bhalwal: 82,
        Kharian: 53,
        Gujrat: 68,
        Hafizabad: 75,
        Mirpur: 83
    },
    Wazirabad: {
        Gujranwala: 36,
        Sialkot: 47,
        Gujrat: 19,
        Hafizabad: 73,
        Kharian: 59
    },
    Kharian: {
        Gujrat: 41,
        Jhelum: 24,
        MandiBahauddin: 53,
        Wazirabad: 59,
        Mirpur: 47,
        Kotli: 98
    },
    Vehari: {
        Multan: 100,
        Bahawalpur: 119,
        DeraGhaziKhan: 205,
        Burewala: 40,
        Khanewal: 62,
        MianChannu: 56,
        Chichawatni: 81
    },
    MianChannu: {
        Multan: 106,
        Sahiwal: 96,
        Jhang: 116,
        Burewala: 51,
        Khanewal: 53,
        Vehari: 56,
        Chichawatni: 43
    },
    Chichawatni: {
        Sahiwal: 52,
        Jhang: 112,
        Okara: 98,
        Burewala: 51,
        Vehari: 81,
        MianChannu: 43
    },
    MirpurKhas: {
        Hyderabad: 84,
        TandoAdam: 55,
        Nawabshah: 125,
        Thatta: 174
    },
    Nawabshah: {
        Karachi: 261,
        Hyderabad: 118,
        MirpurKhas: 125,
        TandoAdam: 73,
        Dadu: 103
    },
    Jacobabad: {
        Sukkur: 94,
        Larkana: 104,
        Quetta: 318,
        Shikarpur: 50,
        Khairpur: 111,
        Khuzdar: 233,
        Sibi: 189
    },
    Shikarpur: {
        RahimYarKhan: 213,
        Sukkur: 44,
        Larkana: 77,
        Sadiqabad: 189,
        Jacobabad: 50,
        Khairpur: 61,
        Khuzdar: 249,
        Sibi: 239
    },
    Dadu: {
        Nawabshah: 103,
        Larkana: 126,
        Khairpur: 164,
        TandoAdam: 173,
        Khuzdar: 208
    },
    TandoAdam: {
        Karachi: 243,
        Hyderabad: 64,
        MirpurKhas: 55,
        Nawabshah: 73,
        Dadu: 173,
        Thatta: 169
    },
    Khairpur: {
        Sukkur: 27,
        Larkana: 68,
        Sadiqabad: 200,
        Jacobabad: 111,
        Shikarpur: 61,
        Dadu: 164
    },
    Thatta: {
        Karachi: 117,
        Hyderabad: 105,
        MirpurKhas: 174,
        TandoAdam: 169
    },
    Kohat: {
        Peshawar: 59,
        Mianwali: 140,
        Charsadda: 84,
        Nowshera: 85,
        Mardan: 109,
        Bannu: 128
    },
    DeraIsmailKhan: {
        Mianwali: 128,
        Bannu: 164,
        Zhob: 185,
        Jhang: 186
    },
    Bannu: {
        Mianwali: 122,
        DeraIsmailKhan: 164,
        Kohat: 128,
        Peshawar: 178,
        Zhob: 265
    },
    Charsadda: {
        Peshawar: 29,
        Mardan: 36,
        Kohat: 84,
        Nowshera: 33,
        Chitral: 237,
        Timargara: 95
    },
    Nowshera: {
        Peshawar: 52,
        Mardan: 26,
        Attock: 56,
        Kohat: 85,
        Charsadda: 33,
        Timargara: 114
    },
    Mansehra: {
        Abbottabad: 22,
        Swat: 151,
        Muzaffarabad: 31,
        Islamabad: 91,
        Rawalakot: 92
    },
    Chitral: {
        Swat: 113,
        Timargara: 142,
        Mardan: 231,
        Charsadda: 237
    },
    Timargara: {
        Swat: 86,
        Chitral: 142,
        Mardan: 90,
        Charsadda: 95,
        Nowshera: 114
    },
    Khuzdar: {
        Turbat: 507,
        Larkana: 199,
        Dadu: 208,
        Jacobabad: 233,
        Shikarpur: 249
    },
    Chaman: {
        Quetta: 120,
        Sibi: 256,
        Loralai: 267,
        Zhob: 361
    },
    Zhob: {
        DeraIsmailKhan: 185,
        Chaman: 361,
        Loralai: 168,
        DeraGhaziKhan: 229,
        Bannu: 265
    },
    Sibi: {
        Quetta: 139,
        Chaman: 256,
        Loralai: 143,
        Jacobabad: 189,
        Shikarpur: 239
    },
    Loralai: {
        Quetta: 196,
        Chaman: 267,
        Zhob: 168,
        Sibi: 143,
        DeraGhaziKhan: 249
    },
    Ormara: {
        Gwadar: 291,
        Turbat: 226,
        Pasni: 145,
        Karachi: 301
    },
    Pasni: {
        Gwadar: 146,
        Turbat: 115,
        Ormara: 145,
        Karachi: 446
    },
    Mirpur: {
        Jhelum: 28,
        Kharian: 47,
        Kotli: 54,
        MandiBahauddin: 83
    },
    Rawalakot: {
        Rawalpindi: 95,
        Abbottabad: 76,
        Islamabad: 86,
        Muzaffarabad: 78,
        Mansehra: 92,
        Kotli: 49
    },
    Kotli: {
        Mirpur: 54,
        Rawalakot: 49,
        Jhelum: 82,
        Kharian: 98
    },
    Chilas: {
        Gilgit: 76,
        Skardu: 175,
        Hunza: 139,
        Muzaffarabad: 162
    },
    Hunza: {
        Gilgit: 63,
        Skardu: 179,
        Chilas: 139,
        Swat: 293
    }
};

const cityProvinces = {
    Gujrat: "Punjab",
    Sheikhupura: "Punjab",
    Jhang: "Punjab",
    DeraGhaziKhan: "Punjab",
    Kasur: "Punjab",
    Okara: "Punjab",
    Chiniot: "Punjab",
    Kamoke: "Punjab",
    Hafizabad: "Punjab",
    Sadiqabad: "Punjab",
    Burewala: "Punjab",
    Mianwali: "Punjab",
    Khanewal: "Punjab",
    Jhelum: "Punjab",
    Attock: "Punjab",
    Bhalwal: "Punjab",
    MandiBahauddin: "Punjab",
    Wazirabad: "Punjab",
    Kharian: "Punjab",
    Vehari: "Punjab",
    MianChannu: "Punjab",
    Chichawatni: "Punjab",
    MirpurKhas: "Sindh",
    Nawabshah: "Sindh",
    Jacobabad: "Sindh",
    Shikarpur: "Sindh",
    Dadu: "Sindh",
    TandoAdam: "Sindh",
    Khairpur: "Sindh",
    Thatta: "Sindh",
    Kohat: "KPK",
    DeraIsmailKhan: "KPK",
    Bannu: "KPK",
    Charsadda: "KPK",
    Nowshera: "KPK",
    Mansehra: "KPK",
    Chitral: "KPK",
    Timargara: "KPK",
    Khuzdar: "Balochistan",
    Chaman: "Balochistan",
    Zhob: "Balochistan",
    Sibi: "Balochistan",
    Loralai: "Balochistan",
    Ormara: "Balochistan",
    Pasni: "Balochistan",
    Mirpur: "AJK",
    Rawalakot: "AJK",
    Kotli: "AJK",
    Chilas: "Gilgit-Baltistan",
    Hunza: "Gilgit-Baltistan",
    Lahore: "Punjab",
    Faisalabad: "Punjab",
    Multan: "Punjab",
    Gujranwala: "Punjab",
    Sialkot: "Punjab",
    Rawalpindi: "Punjab",
    Bahawalpur: "Punjab",
    Sargodha: "Punjab",
    Sahiwal: "Punjab",
    RahimYarKhan: "Punjab",
    Karachi: "Sindh",
    Sukkur: "Sindh",
    Hyderabad: "Sindh",
    Larkana: "Sindh",
    Peshawar: "KPK",
    Abbottabad: "KPK",
    Swat: "KPK",
    Mardan: "KPK",
    Islamabad: "ICT",
    Quetta: "Balochistan",
    Gwadar: "Balochistan",
    Turbat: "Balochistan",
    Gilgit: "Gilgit-Baltistan",
    Skardu: "Gilgit-Baltistan",
    Muzaffarabad: "AJK"
};
