// src/app/services/services.localization.ts

const translations = {
    "uz": {
        "service": {
            "title": "Servis xizmatiga yozilish",
            "subtitle": "Avtomobilingizga texnik xizmat ko'rsatish uchun yozilish",
            "requiresAuth": {
                "title": "Avtorizatsiya talab qilinadi",
                "message": "Servis xizmatiga yozilish uchun tizimga kirish kerak",
                "login": "Tizimga kirish"
            },
            "success": {
                "submitted": "Buyurtmangiz muvaffaqiyatli ro'yxatga olindi!"
            },
            "errors": {
                "loadCars": "Avtomobillarni yuklashda xatolik",
                "loadDealers": "Dilerlarni yuklashda xatolik",
                "loadSlots": "Vaqtlarni yuklashda xatolik",
                "submitFailed": "Arizani yuborishda xatolik",
                "invalidDate": "Noto'g'ri sana"
            },
            "steps": {
                "car": "Avtomobilni tanlash",
                "service": "Xizmatni tanlash",
                "dealer": "Dilerni tanlash",
                "dateTime": "Vaqtni tanlash",
                "confirmation": "Tasdiqlash",
                "carAndService": "Avtomobil va xizmat",
                "timeAndPlace": "Vaqt va joy"
            },
            "buttons": {
                "next": "Keyingi",
                "back": "Orqaga"
            },
            "regions": {
                "title": "Hudud",
                "select": "Hududni tanlang",
                "all": "Barcha hududlar"
            },
            "selected": {
                "car": "Avtomobil",
                "service": "Xizmat"
            },
            "carSelection": {
                "title": "Avtomobilingizni tanlang",
                "noCars": "Sizda avtomobillar yo'q",
                "exploreCars": "Avtomobillarni ko'rish"
            },
            "serviceSelection": {
                "title": "Xizmat turini tanlang",
                "regularMaintenance": "Rejali texnik xizmat",
                "diagnostics": "Diagnostika",
                "repair": "Ta'mirlash",
                "expressService": "Tezkor xizmat",
                "descriptions": {
                    "regularMaintenance": "Ishlab chiqaruvchi jadvaliga muvofiq muntazam texnik xizmat",
                    "diagnostics": "Avtomobil tizimlarini kompleks tekshirish",
                    "repair": "Nosozliklarni bartaraf etish va qismlarni almashtirish",
                    "expressService": "Oldindan yozilmasdan tezkor xizmat ko'rsatish"
                }
            },
            "dealerSelection": {
                "title": "Dilerlik markazini tanlang",
                "found": "Topildi",
                "noDealers": "Tanlangan hududda dilerlik markazlari topilmadi"
            },
            "dateTimeSelection": {
                "selectDate": "Sanani tanlang",
                "selectTime": "Vaqtni tanlang",
                "tomorrow": "Ertaga",
                "morning": "Ertalab",
                "afternoon": "Kunduzi",
                "evening": "Kechqurun",
                "noTimeAvailable": "Bo'sh vaqt yo'q",
                "selectDateFirst": "Avval sanani tanlang"
            },
            "confirmation": {
                "yourCar": "Sizning avtomobilingiz",
                "currentYear": "Joriy yil",
                "selectedService": "Tanlangan xizmat",
                "date": "Sana",
                "time": "Vaqt",
                "dealerCenter": "Dilerlik markazi",
                "email": "E-pochta",
                "importantInfo": "Muhim ma'lumot",
                "infoPoint1": "Dilerlik markazi siz bilan ish vaqti kun davomida bog'lanadi",
                "infoPoint2": "Zarur bo'lsa, siz sanani va vaqtni o'zgartirishingiz mumkin",
                "infoPoint3": "Bekor qilish uchun dilerlik markaziga murojaat qiling",
                "almostDone": "Deyarli tayyor!",
                "checkDetails": "Ma'lumotlarni tekshiring va tasdiqlang",
                "service": "Xizmat",
                "dateTime": "Sana va vaqt",
                "dealer": "Dilerlik markazi",
                "clientInfo": "Mijoz ma'lumotlari",
                "name": "F.I.Sh.",
                "phone": "Telefon",
                "notSpecified": "Ko'rsatilmagan",
                "info": "Siz bilan dilerlik markazi yaqin kunlarda bog'lanadi va barcha tafsilotlarni aniqlashtiradi",
                "back": "O'zgartirish",
                "confirm": "Tasdiqlash",
                "submitting": "Yuborilmoqda..."
            },
            "weekdays": {
                "monday": "Dushanba",
                "tuesday": "Seshanba",
                "wednesday": "Chorshanba",
                "thursday": "Payshanba",
                "friday": "Juma",
                "saturday": "Shanba",
                "sunday": "Yakshanba"
            }
        },
        "catalog": {
            "car": {
                "regions": {
                    "tashkent": "Toshkent shahri",
                    "tashkent_region": "Toshkent viloyati",
                    "andijan": "Andijon viloyati",
                    "bukhara": "Buxoro viloyati",
                    "jizzakh": "Jizzax viloyati",
                    "kashkadarya": "Qashqadaryo viloyati",
                    "navoi": "Navoiy viloyati",
                    "namangan": "Namangan viloyati",
                    "samarkand": "Samarqand viloyati",
                    "surkhandarya": "Surxondaryo viloyati",
                    "syrdarya": "Sirdaryo viloyati",
                    "ferghana": "Farg'ona viloyati",
                    "khorezm": "Xorazm viloyati",
                    "karakalpakstan": "Qoraqalpog'iston Respublikasi"
                }
            }
        }
    },
    "ru": {
        "service": {
            "title": "Запись на сервисное обслуживание",
            "subtitle": "Быстрая и удобная запись на обслуживание вашего автомобиля",
            "requiresAuth": {
                "title": "Требуется авторизация",
                "message": "Для записи на сервисное обслуживание необходимо авторизоваться в системе",
                "login": "Авторизоваться"
            },
            "success": {
                "submitted": "Ваша заявка успешно зарегистрирована!"
            },
            "errors": {
                "loadCars": "Ошибка при загрузке автомобилей",
                "loadDealers": "Ошибка при загрузке дилеров",
                "loadSlots": "Ошибка при загрузке времени",
                "submitFailed": "Ошибка при отправке заявки",
                "invalidDate": "Некорректная дата"
            },
            "steps": {
                "car": "Выбор автомобиля",
                "service": "Выбор услуги",
                "dealer": "Выбор дилера",
                "dateTime": "Выбор времени",
                "confirmation": "Подтверждение",
                "carAndService": "Автомобиль и услуга",
                "timeAndPlace": "Время и место"
            },
            "buttons": {
                "next": "Далее",
                "back": "Назад"
            },
            "regions": {
                "title": "Регион",
                "select": "Выберите регион",
                "all": "Все регионы"
            },
            "selected": {
                "car": "Автомобиль",
                "service": "Услуга"
            },
            "carSelection": {
                "title": "Выберите ваш автомобиль",
                "noCars": "У вас нет автомобилей",
                "exploreCars": "Посмотреть автомобили"
            },
            "serviceSelection": {
                "title": "Выберите тип услуги",
                "regularMaintenance": "Плановое ТО",
                "diagnostics": "Диагностика",
                "repair": "Ремонт",
                "expressService": "Экспресс-обслуживание",
                "descriptions": {
                    "regularMaintenance": "Регулярное техническое обслуживание согласно графику производителя",
                    "diagnostics": "Комплексная проверка систем автомобиля",
                    "repair": "Устранение неисправностей и замена деталей",
                    "expressService": "Быстрое обслуживание без предварительной записи"
                }
            },
            "dealerSelection": {
                "title": "Выберите дилерский центр",
                "found": "Найдено",
                "noDealers": "В выбранном регионе нет дилерских центров"
            },
            "dateTimeSelection": {
                "selectDate": "Выберите дату",
                "selectTime": "Выберите время",
                "tomorrow": "Завтра",
                "morning": "Утро",
                "afternoon": "День",
                "evening": "Вечер",
                "noTimeAvailable": "Нет доступного времени",
                "selectDateFirst": "Сначала выберите дату"
            },
            "confirmation": {
                "yourCar": "Ваш автомобиль",
                "currentYear": "Текущий год",
                "selectedService": "Выбранная услуга",
                "date": "Дата",
                "time": "Время",
                "dealerCenter": "Дилерский центр",
                "email": "E-mail",
                "importantInfo": "Важная информация",
                "infoPoint1": "Дилерский центр свяжется с вами в течение 24 часов",
                "infoPoint2": "При необходимости вы сможете изменить дату и время",
                "infoPoint3": "Для отмены обратитесь в дилерский центр",
                "almostDone": "Почти готово!",
                "checkDetails": "Проверьте данные и подтвердите запись",
                "service": "Услуга",
                "dateTime": "Дата и время",
                "dealer": "Дилерский центр",
                "clientInfo": "Данные клиента",
                "name": "ФИО",
                "phone": "Телефон",
                "notSpecified": "Не указано",
                "info": "Дилерский центр свяжется с вами в ближайшее время для уточнения всех деталей",
                "back": "Изменить",
                "confirm": "Подтвердить",
                "submitting": "Отправка..."
            },
            "weekdays": {
                "monday": "Понедельник",
                "tuesday": "Вторник",
                "wednesday": "Среда",
                "thursday": "Четверг",
                "friday": "Пятница",
                "saturday": "Суббота",
                "sunday": "Воскресенье"
            }
        },
        "catalog": {
            "car": {
                "regions": {
                    "tashkent": "город Ташкент",
                    "tashkent_region": "Ташкентская область",
                    "andijan": "Андижанская область",
                    "bukhara": "Бухарская область",
                    "jizzakh": "Джизакская область",
                    "kashkadarya": "Кашкадарьинская область",
                    "navoi": "Навоийская область",
                    "namangan": "Наманганская область",
                    "samarkand": "Самаркандская область",
                    "surkhandarya": "Сурхандарьинская область",
                    "syrdarya": "Сырдарьинская область",
                    "ferghana": "Ферганская область",
                    "khorezm": "Хорезмская область",
                    "karakalpakstan": "Республика Каракалпакстан"
                }
            }
        }
    }
} as const;

export default translations;