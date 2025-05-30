const translations = {
    "uz": {
        "processing": {
            "steps": {
                "documents": "Avtomobilingiz uchun hujjatlarni tayyorlamoqdamiz...",
                "verification": "Ma'lumotlaringizni tekshirmoqdamiz...",
                "database": "Ma'lumotlar bazasini yangilamoqdamiz...",
                "server": "Server bilan ma'lumotlarni sinxronizatsiya qilmoqdamiz...",
                "contract": "Shartnomani rasmiylashtirmoqdamiz...",
                "details": "Shartnoma tafsilotlarini yakunlamoqdamiz...",
                "signing": "Shartnomani imzolashga yubormoqdamiz..."
            },
            "status": {
                "wait": "Iltimos, kuting..."
            }
        }
    },
    "ru": {
        "processing": {
            "steps": {
                "documents": "Подготавливаем документы для вашего автомобиля...",
                "verification": "Проверяем ваши данные...",
                "database": "Обновляем базу данных...",
                "server": "Синхронизируем данные с сервером...",
                "contract": "Формируем контракт...",
                "details": "Финализируем детали контракта...",
                "signing": "Отправляем контракт на подпись..."
            },
            "status": {
                "wait": "Пожалуйста, подождите..."
            }
        }
    }
} as const;

export default translations;