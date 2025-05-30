export const translations = {
    "uz": {
        "cars": {
            "loading": "Yuklanmoqda...",
            "getContract": "Shartnomani olish",
            "back": "Ro'yxatga qaytish",
            "title": "Modifikatsiya va rangni tanlang",
            "modification": "Modifikatsiya",
            "color": "Rangni tanlang",
            "tabs": {
                "configuration": "Konfiguratsiya",
                "installment": "Muddatli to'lov kalkulyatori"
            },
            "specs": {
                "title": "Xarakteristikalar",
                "power": "Dvigatel quvvati",
                "acceleration": "100 km/soatgacha tezlanish",
                "fuel": "100 km masofa uchun yoqilg'i sarfi",
                "fuel2": "l",
                "acceleration2": "sek",
                "transmission": "Uzatmalar qutisi"
            },
            "availability": {
                "title": "Sotuvda mavjudligi to‘g‘risida",
                "status": "Holati",
                "inStock": "Mavjud ({count} dona)",
                "inQueue": "Navbatda",
                "deliveryDate": "Taxminiy yetkazib berish muddati",
                "queuePosition": "Navbatdagi o'rni",
                "noData": "Ma'lumot yo'q"
            },
            "features": {
                "title": "Texnik xususiyatlar",
                "description": "Texnik xususiyatlar, komplektatsiya va hujjatlar",
                "download": "Xarakteristikani yuklash"
            },
            "createContract": "Shartnoma tuzish",
            "carNotFound": "Avtomobil topilmadi",
            "returnHome": "Bosh sahifaga qaytish",

        }
    },
    "ru": {
        "cars": {
            "loading": "Загрузка...",
            "getContract": "Получить договор",
            "back": "Вернуться к списку",
            "title": "Выберите модификацию и цвет",
            "modification": "Модификация",
            "color": "Выберите цвет",
            "tabs": {
                "configuration": "Конфигурация",
                "installment": "Калькулятор рассрочки"
            },
            "specs": {
                "title": "Характеристики",
                "power": "Мощность",
                "acceleration": "Разгон до 100 км/ч",
                "acceleration2": "сек",
                "fuel": "Расход топлива на 100 км",
                "fuel2": "л",
                "transmission": "Трансмиссия"
            },
            "availability": {
                "title": "Информация о наличии",
                "status": "Статус",
                "inStock": "В наличии ({count} шт)",
                "inQueue": "В очереди",
                "deliveryDate": "Ориентировочные срок поставки",
                "queuePosition": "Позиция в очереди",
                "noData": "Нет данных"
            },
            "features": {
                "title": "Технические характеристики",
                "description": "Технические характеристики, комплектация и документация",
                "download": "Скачать характеристики"
            },
            "createContract": "Создать контракт",
            "carNotFound": "Автомобиль не найден",
            "returnHome": "Вернуться на главную"
        }
    }
} as const;



export const paymentTranslations = {
    "uz": {
        "payment": {
            "options": "To'lov usuli",
            "cash": "Naqd pul",
            "installment": "Muddatli to'lov kalkulyatori",
            "period": "Nasiya muddati",
            "rate": "Yillik stavka",
            "downPayment": "Boshlang'ich to'lov",
            "monthlyPayment": "Oylik to'lov",
            "totalPayment": "Umumiy to'lov summasi",
            "months": "oy",
            "percent": "%",
            "calculate": "Hisoblash",
            "orderWithInstallment": "Nasiya bo'yicha rasmiylashtirish",
            "initialFeeRequired": "50% boshlang'ich to'lov talab qilinadi",
            "installmentTerms": "Nasiya shartlari",
            "paymentSchedule": "To'lov jadvali",
            "documents": "Hujjatlar va shartlar",
            "viewDetails": "Batafsil",
            "paymentOptions": "To'lov variantlari",
            "configurator": "Muddatli to'lov kalkulyatori",
            "installmentNotAvailable": "Ushbu modifikatsiya uchun nasiya mavjud emas",
            "chooseAnotherModification": "Nasiya uchun boshqa modifikatsiyani tanlang",
            "loading": "Nasiya ma'lumotlarini yuklash...",
            "priceDifference": "narxga",
            "initialFee": "To'lov",
            "carPrice": "Avtomobil narxi",
            "toBasePrice": "asosiy narxga",
            "showSchedule": "Jadval",
            "hideSchedule": "Yashirish",
            "scheduleDate": "Sana",
            "scheduleAmount": "Miqdori",
            "scheduleNumber": "№",
            "firstPayment": "Birinchi to'lov",
            "nextPayment": "Keyingi to'lov",
            "paymentNumber": "To'lov raqami",
            "paymentDate": "To'lov sanasi",
            "paymentAmount": "To'lov miqdori",
            "remainingAmount": "Qolgan summa",
            "morePayments": "va yana to'lov",
            "contractPeriod": "Shartnoma muddati",
            "paymentPlan": "To'lov rejasi",
            "monthNumber": "Oy raqami",
            "nextPayments": "Keyingi to'lovlar",
            "scheduleTitle": "To'lov jadvali",
            "viewFullSchedule": "To'liq jadvalini ko'rish",
            "closeSchedule": "Jadvalini yopish",
            "scheduleSummary": "Jadval xulosasi",
            "totalMonths": "Jami oylar",
            "remainingMonths": "Qolgan oylar",
            "completedPayments": "Bajarilgan to'lovlar",
            "totalInstallmentCost": "Umumiy nasiya qiymati",
            "monthlyPaymentInfo": "Oylik to'lov haqida ma'lumot",
            "paymentDay": "To'lov kuni",
            "finalPaymentDate": "Yakuniy to'lov sanasi"
        }
    },
    "ru": {
        "payment": {
            "options": "Способ оплаты",
            "cash": "Полная оплата",
            "installment": "Калькулятор рассрочки",
            "period": "Срок рассрочки",
            "rate": "Годовая ставка",
            "downPayment": "Первоначальный взнос",
            "monthlyPayment": "Ежемесячный платеж",
            "totalPayment": "Общая сумма выплат",
            "months": "месяцев.",
            "percent": "%",
            "calculate": "Рассчитать",
            "orderWithInstallment": "Оформить в рассрочку",
            "initialFeeRequired": "Требуется 50% первоначальный взнос",
            "installmentTerms": "Условия рассрочки",
            "paymentSchedule": "График платежей",
            "documents": "Документы и условия",
            "viewDetails": "Подробнее",
            "paymentOptions": "Варианты оплаты",
            "configurator": "Конфигуратор рассрочки",
            "installmentNotAvailable": "Рассрочка недоступна для этой модификации",
            "chooseAnotherModification": "Выберите другую модификацию для возможности рассрочки",
            "loading": "Загрузка данных о рассрочке...",
            "priceDifference": "к цене",
            "initialFee": "взнос",
            "carPrice": "Стоимость автомобиля",
            "toBasePrice": "к базовой цене",
            "showSchedule": "График",
            "hideSchedule": "Скрыть",
            "scheduleDate": "Дата",
            "scheduleAmount": "Сумма",
            "scheduleNumber": "№",
            "firstPayment": "Первый платеж",
            "nextPayment": "Следующий платеж",
            "paymentNumber": "Номер платежа",
            "paymentDate": "Дата платежа",
            "paymentAmount": "Сумма платежа",
            "remainingAmount": "Остаток",
            "morePayments": "и еще платежей",
            "contractPeriod": "Срок договора",
            "paymentPlan": "План платежей",
            "monthNumber": "Номер месяца",
            "nextPayments": "Следующие платежи",
            "scheduleTitle": "График платежей",
            "viewFullSchedule": "Посмотреть полный график",
            "closeSchedule": "Закрыть график",
            "scheduleSummary": "Сводка по графику",
            "totalMonths": "Всего месяцев",
            "remainingMonths": "Осталось месяцев",
            "completedPayments": "Выполнено платежей",
            "totalInstallmentCost": "Общая стоимость рассрочки",
            "monthlyPaymentInfo": "Информация о ежемесячном платеже",
            "paymentDay": "День платежа",
            "finalPaymentDate": "Дата последнего платежа"
        }
    }
};