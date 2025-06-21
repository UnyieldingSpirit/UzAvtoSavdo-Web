interface CarModels {
    [key: string]: string;
}

interface CarModelsDesc {
    [key: string]: string;
}

interface TranslatedCarModels {
    ru: CarModels;
    uz: CarModels;
}

interface TranslatedCarModelsDesc {
    ru: CarModelsDesc;
    uz: CarModelsDesc;
}

export const carModels: TranslatedCarModels = {
    ru: {
        "516": "https://chevrolet.uz/storage/images/price_catalog_ru/13/gDh36lwS9lrfBPHduTjCyn8O8MID3nRXVPLVpLMA.pdf", // ONIX
        "437": "https://chevrolet.uz/storage/images/price_catalog_ru/2/download-price-liest-chevrolet-damas.pdf", // DAMAS-2
        "438": "", // LACETTI
        "439": "https://chevrolet.uz/storage/images/price_catalog_ru/14/download-price-liest-chevrolet-malibu-xl.pdf", // MALIBU-2
        "440": "", // SPARK
        "441": "", // TAHOE
        "442": "", // TRAILBLAZER
        "443": "https://chevrolet.uz/storage/images/price_catalog_ru/10/1MxPg630ZWNhIs8jRYXY8CfoZ7tkHAIzh919C0fn.pdf", // TRAVERSE
        "444": "https://chevrolet.uz/storage/images/price_catalog_ru/8/download-price-liest-chevrolet-equinox.pdf", // EQUINOX
        "435": "", // NEXIA-3
        "436": "", // COBALT
        "445": "https://chevrolet.uz/storage/images/price_catalog_ru/6/gF3l1c5ZxZYr0CGEc6Z7SOEGZIMvhTMjg1Z8SPp9.pdf", // TRACKER-2
        "446": "", // TAHOE-2
        "478": "", // TRACKER
        "479": "https://chevrolet.uz/storage/images/price_catalog_ru/15/download-price-liest-chevrolet-captiva.pdf", // CAPTIVA 5T
        "456": "", // ORLANDO
        "455": "", // CAPTIVA - 2 (2.4)
        "666": "https://chevrolet.uz/storage/images/price_catalog_ru/1/download-price-liest-chevrolet-labo.pdf", // LABO
        "536": "", // MATIZ
        "556": ""  // Default
    },
    uz: {
        "516": "https://chevrolet.uz/storage/images/price_catalog_uz/13/d0WOY9lTiEgoDRfMvUDjqQnofOi3TQoRm4muR5Le.pdf",
        "437": "https://chevrolet.uz/storage/images/price_catalog_uz/2/download-price-liest-uz-chevrolet-damas.pdf",
        "438": "",
        "439": "https://chevrolet.uz/storage/images/price_catalog_uz/14/download-price-liest-uz-chevrolet-malibu-xl.pdf",
        "440": "",
        "441": "",
        "442": "",
        "443": "https://chevrolet.uz/storage/images/price_catalog_uz/10/tGAfYHJ7FtuiaEHD0aVqAlvn96Ndh4jiXxwDdwhj.pdf",
        "444": "https://chevrolet.uz/storage/images/price_catalog_uz/8/download-price-liest-uz-chevrolet-equinox.pdf",
        "435": "",
        "436": "",
        "445": "https://chevrolet.uz/storage/images/price_catalog_uz/6/OzBtMVZbcZsH06FJlnbzeY3mzgyob2QnURHLWpC1.pdf",
        "446": "",
        "478": "",
        "479": "https://chevrolet.uz/storage/images/price_catalog_uz/15/download-price-liest-uz-chevrolet-captiva.pdf",
        "456": "",
        "455": "",
        "666": "https://chevrolet.uz/storage/images/price_catalog_uz/1/download-price-liest-uz-chevrolet-labo.pdf",
        "536": "",
        "556": ""
    }
};

export const carNameToId: Record<string, string> = {
    "ONIX": "516",
    "DAMAS-2": "437",
    "LACETTI": "438",
    "MALIBU-2": "439",
    "SPARK": "440",
    "TAHOE": "441",
    "TRAILBLAZER": "442",
    "TRAVERSE": "443",
    "EQUINOX": "444",
    "NEXIA-3": "435",
    "COBALT": "436",
    "TRACKER-2": "445",
    "TAHOE-2": "446",
    "TRACKER": "478",
    "CAPTIVA 5T": "479",
    "ORLANDO": "456",
    "CAPTIVA - 2 (2,4)": "455",
    "LABO": "666",
    "MATIZ": "536",
    "Default": "556"
};

export const carModelsDesc: TranslatedCarModelsDesc = {
    ru: {
        "445": "Стильный и просторный внутри. Спортивный и уверенный на дороге. Этот компактный кроссовер предлагает комфорт и возможности, необходимые для Вашего следующего городского приключения", // TRACKER-2
        "479": "Аэродинамический дизайн, просторный салон с 3 рядами сидений, турбодвигатель и отличная универсальность адаптируются ко всем вашим потребностям и потребностям вашей семьи", // CAPTIVA 5T
        "444": "Самым главным преимуществом Chevrolet Equinox является его новая гибридная система. Работает с мягкой гибридной системой START-STOP", // EQUINOX
        "443": "Это надежный кроссовер, который станет полноценным членом вашей семьи. Chevrolet Traverse, созданный с использованием передовых технологий, поможет воплотить в жизнь ваши самые амбициозные замыслы", // TRAVERSE
        "439": "Разработан для городских условий и сочетает в себе лучший в своем классе дизайн, технологии, качество и безопасность", // MALIBU-2
        "437": "Пятидверный коммерческий автомобиль с двигателем 0,8 литров мощностью 38 л.с.", // DAMAS-2
        "516": "Новая модель сочетает в себе яркий дизайн, современный интерьер и все необходимые опции для комфорта и безопасности", // ONIX
        "438": "", // LACETTI
        "440": "", // SPARK
        "441": "", // TAHOE
        "442": "", // TRAILBLAZER
        "435": "", // NEXIA-3
        "436": "", // COBALT
        "446": "", // TAHOE-2
        "478": "", // TRACKER
        "456": "", // ORLANDO
        "455": "", // CAPTIVA - 2 (2,4)
        "666": "", // LABO
        "536": "", // MATIZ
        "556": ""  // Default
    },
    uz: {
        "445": "Zamonaviy va ichki qismi keng. Yo'lda sportcha va ishonchli harakatlanadi. Ushbu ixcham krossover shahardagi sarguzashtlaringiz uchun kerakli qulaylik va imkoniyatlarni taqdim etadi", // TRACKER-2
        "479": "Aerodinamik dizayn, 3 qator o'rindiqlarga ega keng salon, turbomotor va yuqori moslashuvchanlik siz va oilangizning barcha ehtiyojlariga javob beradi", // CAPTIVA 5T
        "444": "Eng asosiy ustunligi uning yangi gibrid tizimi hisoblanadi. U yumshoq gibrid START-STOP tizimi bilan ishlaydi", // EQUINOX
        "443": "Ishonchli krossover bo'lib, oilangizning to'laqonli a'zosi bo'la oladi. Chevrolet Traverse ilg'or texnologiyalar yordamida ishlab chiqilgan bo'lib, eng jasur rejalaringizni amalga oshirishda yordam beradi", // TRAVERSE
        "439": "Shahar sharoiti uchun ishlab chiqilgan bo'lib, o'zida eng yuqori darajadagi dizayn, texnologiyalar, sifat va xavfsizlikni mujassamlashtiradi", // MALIBU-2
        "437": "Besh eshikli tijorat avtomobili bo'lib, 0,8 litr hajmga ega 38 ot kuchidagi dvigatel bilan jihozlangan", // DAMAS-2
        "516": "Yangi model o'zida yorqin dizayn, zamonaviy interyer va qulaylik hamda xavfsizlik uchun barcha zarur opsiyalarni mujassamlashtiradi", // ONIX
        "438": "", // LACETTI
        "440": "", // SPARK
        "441": "", // TAHOE
        "442": "", // TRAILBLAZER
        "435": "", // NEXIA-3
        "436": "", // COBALT
        "446": "", // TAHOE-2
        "478": "", // TRACKER
        "456": "", // ORLANDO
        "455": "", // CAPTIVA - 2 (2,4)
        "666": "", // LABO
        "536": "", // MATIZ
        "556": ""  // Default
    }
};


export const carYouTubeVideos: Record<string, string> = {
    "516": "AEZKtsBGvRU", // ONIX 
    "437": "", // DAMAS-2
    "438": "", // LACETTI
    "439": "zH_EGqbsymE", // MALIBU-2
    "440": "", // SPARK
    "441": "", // TAHOE
    "442": "", // TRAILBLAZER
    "443": "BBY5PSTyirY", // TRAVERSE
    "444": "", // EQUINOX
    "435": "", // NEXIA-3
    "436": "", // COBALT
    "445": "aFMpXrOrEmc", // TRACKER-2
    "446": "", // TAHOE-2
    "478": "_OcatkukEt0", // TRACKER
    "479": "EaW5QgGYfWg", // CAPTIVA 5T
    "456": "", // ORLANDO
    "455": "", // CAPTIVA - 2 (2,4)
    "666": "", // LABO
    "536": "", // MATIZ
};