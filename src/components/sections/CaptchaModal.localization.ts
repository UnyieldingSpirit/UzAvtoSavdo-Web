const translations = {
    "uz": {
        "captcha": {
            "title": {
                "auth": "OneID orqali kirish",
                "contract": "Shartnomani tasdiqlash"
            },
            "enterCode": "Kodni kiriting",
            "loading": "Yuklanmoqda...",
            "loadError": "Yuklab bo'lmadi",
            "verification": "Tekshirish",
            "continue": "Davom etish",
            "cancel": "Bekor qilish",
            "agreement": "Men shaxsiy ma'lumotlarimni uzatishga roziman",
            "errors": {
                "required": "Rasmdan kodni kiriting",
                "invalid": "Noto'g'ri kod. Qayta urinib ko'ring",
                "loading": "Kaptchani yuklashda xatolik",
                "agreement": "Davom etish uchun shartlarga rozilik bildiring",
                "length": "Kod 6 ta belgidan iborat bo'lishi kerak",
                "maxAttempts": "Urinishlar soni oshib ketdi. Keyinroq qayta urinib ko'ring",
                "missingData": "Shartnoma ma'lumotlari to'liq emas",
                "wait": "{{seconds}} soniyadan keyin qayta urinib ko'ring"
            },
            "success": {
                "auth": "Muvaffaqiyatli avtorizatsiya",
                "contract": "Shartnoma muvaffaqiyatli yaratildi"
            }
        }
    },
    "ru": {
        "captcha": {
            "title": {
                "auth": "Вход через OneID",
                "contract": "Подтверждение контракта"
            },
            "enterCode": "Введите код",
            "loading": "Загрузка...",
            "loadError": "Не удалось загрузить",
            "verification": "Проверка",
            "continue": "Продолжить",
            "cancel": "Отмена",
            "agreement": "Я согласен с передачей моих персональных данных",
            "errors": {
                "required": "Введите код с картинки",
                "invalid": "Неверный код. Попробуйте еще раз",
                "loading": "Ошибка загрузки капчи",
                "agreement": "Для продолжения необходимо согласие с условиями",
                "length": "Код должен состоять из 6 символов",
                "maxAttempts": "Превышено количество попыток. Попробуйте позже",
                "missingData": "Неполные данные контракта",
                "wait": "Повторите попытку через {{seconds}} секунд"
            },
            "success": {
                "auth": "Успешная авторизация",
                "contract": "Контракт успешно создан"
            }
        }
    }
} as const;

export default translations;