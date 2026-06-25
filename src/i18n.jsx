import React, { createContext, useState, useContext } from 'react';

const noPrizeUk = [
  "{name}, цього разу без подарунка, проте сьогодні ваш день для нових пригод.",
  "{name}, цього разу без подарунка, але музика знайде вас раніше, ніж ви знайдете сцену.",
  "{name}, цього разу без подарунка, зате баланс вашої удачі сьогодні несподівано зріс.",
  "{name}, цього разу без подарунка, але наступний безцінний момент уже десь поруч.",
  "{name}, цього разу без подарунка, проте цей вечір може стати одним із найкращих спогадів літа.",
  "{name}, цього разу без подарунка, але Всесвіт схоже має для вас інші плани.",
  "{name}, цього разу без подарунка, зате сьогодні офіційно дозволено говорити «так» новим враженням.",
  "Схоже, сьогодні приз обрав когось іншого. Зате цей вечір запам’ятає не лише ваша галерея.",
  "Цього разу приз дістався іншому гостю. Але ваша нова улюблена пісня вже десь поруч.",
  "Сьогодні приз пішов іншим шляхом. А ваш шлях веде до нових пригод.",
  "Приз уже знайшов свого власника. Тепер час знайти свій безцінний момент.",
  "Сьогодні приз обрав іншого. А для вас залишив передбачення: попереду хороша історія.",
  "Цього разу подарунок вирушив до іншого гостя. Але удача ще не сказала останнього слова.",
  "Схоже, головний приз сьогодні має інші плани. А ваш вечір — свої.",
  "Безцінний момент не завжди виглядає як подарунок. Іноді він починається прямо зараз.",
  "Ваш приз зачекає. А ось безцінний момент уже зовсім поруч.",
  "Сьогодні без подарунка. Зате з шансом на історію, яку захочеться розповідати друзям.",
  "Не кожен виграш вимірюється подарунками. Найкращі моменти ще попереду.",
  "Безцінні моменти приходять без попередження. Схоже, один із них уже наближається.",
  "Подарунок можна виграти лише раз. А безцінні моменти — хоч щовечора.",
  "Іноді найкращий приз — це спогад, який залишиться з вами надовго.",
  "Цей момент ще не став безцінним. Але в нього є всі шанси.",
  "Сьогодні удача залишила вам дещо цікавіше за подарунок — нову історію.",
  "Безцінний момент уже в дорозі. Не перемикайтесь."
];

const noPrizeEn = [
  "{name}, no gift this time, but today is your day for new adventures.",
  "{name}, no gift this time, but the music will find you before you find the stage.",
  "{name}, no gift this time, but your luck balance suddenly increased today.",
  "{name}, no gift this time, but the next priceless moment is already somewhere nearby.",
  "{name}, no gift this time, but this evening can become one of the best memories of summer.",
  "{name}, no gift this time, but the Universe seems to have other plans for you.",
  "{name}, no gift this time, but today it is officially allowed to say 'yes' to new impressions.",
  "It seems today the prize chose someone else. But this evening will be remembered not only by your gallery.",
  "This time the prize went to another guest. But your new favorite song is already somewhere nearby.",
  "Today the prize took a different path. And your path leads to new adventures.",
  "The prize has already found its owner. Now it's time to find your priceless moment.",
  "Today the prize chose someone else. But for you, it left a prediction: a good story is ahead.",
  "This time the gift went to another guest. But luck hasn't said its last word.",
  "It seems the main prize has other plans today. And your evening has its own.",
  "A priceless moment doesn't always look like a gift. Sometimes it starts right now.",
  "Your prize will wait. But the priceless moment is already nearby.",
  "No gift today. But a chance for a story you'll want to tell your friends.",
  "Not every win is measured in gifts. The best moments are still ahead.",
  "Priceless moments come without warning. It seems one is already approaching.",
  "A gift can be won only once. But priceless moments - every evening.",
  "Sometimes the best prize is a memory that will stay with you for a long time.",
  "This moment hasn't become priceless yet. But it has every chance.",
  "Today luck left you something more interesting than a gift - a new story.",
  "The priceless moment is already on its way. Don't switch off."
];

const translations = {
  en: {
    // Admin
    admin_title: "Prize Pool Configuration",
    admin_save: "Save Changes",
    admin_reset: "Emergency Reset",
    admin_network: "Network Clients",
    admin_cooldown: "Cooldown between wins (minutes)",
    
    // iPad
    ipad_locked: "",
    ipad_side_left_1: "MAKE A PAYMENT",
    ipad_side_left_2: "WITH MASTERCARD",
    ipad_side_left_3: "AND ACTIVATE TERMINAL",
    ipad_side_right_1: "CATCH",
    ipad_side_right_2: "THE VIBE",
    ipad_center_title_1: "Made a payment",
    ipad_center_title_2: "with Mastercard?",
    ipad_center_subtitle: "Activate your moment",
    ipad_btn_start: "START",
    ipad_enter_name: "Enter your name",
    ipad_btn_continue: "CONTINUE",
    ipad_ready_title_1: "PRESS START",
    ipad_ready_title_2: "TO BEGIN",
    ipad_btn_play: "START",
    ipad_btn_restart: "START OVER",
    ipad_years_1: "30",
    ipad_years_2: "years with Ukraine",
    ipad_greeting: "{name}, welcome. You are in the game",
    ipad_waiting: "Look at the main screen...",

    // TV
    tv_idle: "Made a Mastercard payment? Activate your moment",
    tv_main_title_1: "CATCH YOUR",
    tv_main_title_2: "PRICELESS MOMENT",
    tv_welcome_1: "{name},\nwelcome,\n",
    tv_welcome_1_highlight: "you are in the game",
    tv_welcome_2: "PRESS START TO BEGIN",
    tv_footer: "Every concert is a new priceless moment",
    tv_years_1: "30",
    tv_years_2: "YEARS\nwith Ukraine",
    
    // Result
    result_prize: "{name}, congratulations. You won {prize}",
    result_win_1: "{name}, congratulations,",
    result_win_2: "you won",
    result_lose_1: "{name},",
    result_lose_2: "no gift this time,",
    result_lose_3: "but..."
  },
  uk: {
    // Admin
    admin_title: "Налаштування пулу призів",
    admin_save: "Зберегти зміни",
    admin_reset: "Екстрене скидання",
    admin_network: "Клієнтів у мережі",
    admin_cooldown: "Інтервал між виграшами (хв)",
    
    // iPad
    ipad_locked: "",
    ipad_side_left_1: "ЗРОБИ ОПЛАТУ",
    ipad_side_left_2: "КАРТКОЮ MASTERCARD",
    ipad_side_left_3: "ТА АКТИВУЙ ТЕРМІНАЛ",
    ipad_side_right_1: "ЛОВИ",
    ipad_side_right_2: "ВРАЖЕННЯ",
    ipad_center_title_1: "Здійснили оплату",
    ipad_center_title_2: "Mastercard?",
    ipad_center_subtitle: "Активуйте свій момент",
    ipad_btn_start: "ПОЧАТИ",
    ipad_enter_name: "Введіть ваше ім'я",
    ipad_btn_continue: "ПРОДОВЖИТИ",
    ipad_ready_title_1: "НАТИСНІТЬ СТАРТ",
    ipad_ready_title_2: "ЩОБ ПОЧАТИ ГРУ",
    ipad_btn_play: "СТАРТ",
    ipad_btn_restart: "ПОЧАТИ СПОЧАТКУ",
    ipad_years_1: "30",
    ipad_years_2: "років з Україною",
    ipad_greeting: "{name}, вітаємо. Ви у грі",
    ipad_waiting: "Анімація на головному екрані...",

    // TV
    tv_idle: "Здійснили оплату Mastercard? Активуйте свій момент",
    tv_main_title_1: "СПІЙМАЙ СВІЙ",
    tv_main_title_2: "МОМЕНТ",
    tv_main_title_3: "БЕЗЦІННИЙ МОМЕНТ",
    tv_welcome_1: "{name},\nвітаємо,\n",
    tv_welcome_1_highlight: "ви у грі",
    tv_welcome_2: "НАТИСНІТЬ START ЩОБ ПОЧАТИ ГРУ",
    tv_footer: "Кожен концерт — це новий безцінний момент",
    tv_years_1: "30",
    tv_years_2: "РОКІВ\nз Україною",
    
    // Result
    result_prize: "{name}, вітаємо. Ви виграли {prize}",
    result_win_1: "{name}, вітаємо,",
    result_win_2: "ви виграли",
    result_lose_1: "{name},",
    result_lose_2: "цього разу без подарунку,",
    result_lose_3: "проте..."
  }
};

// Add dynamically
noPrizeUk.forEach((msg, idx) => { translations.uk[`result_no_prize_${idx}`] = msg; });
noPrizeEn.forEach((msg, idx) => { translations.en[`result_no_prize_${idx}`] = msg; });

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('uk');
  const t = (key, params = {}) => {
    let text = translations[lang][key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
    return text;
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
