
import clsx from "clsx";
import { ModificationButtonProps } from "./interface";

const unitTranslations = {
  "uz": {
    "powerUnit": "o.k.",
    "secondUnit": "sekund",
    "litreUnit": "litr",
    "currency": "so'm"
  },
  "ru": {
    "powerUnit": "л.с.",
    "secondUnit": "сек",
    "litreUnit": "л",
    "currency": "сум"
  }
};

const ModificationButton = ({ mod, isSelected, onClick, price, locale }: ModificationButtonProps) => {
  const validLocale = locale === 'uz' || locale === 'ru' ? locale : 'ru';
  const currencySymbol = unitTranslations[validLocale].currency;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full px-3 py-2.5 text-left rounded-xl transition-all",
        "hover:shadow-md hover:border-primary/60",
        "md:px-4 md:py-3",
        isSelected
          ? "bg-primary/5 border-2 border-primary shadow-sm"
          : "bg-gray-50 border-2 border-transparent"
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm md:text-base uppercase truncate">{mod.name}</p>
        </div>
        <p className="font-bold text-sm md:text-lg  text-gray-900 whitespace-nowrap">
          {`${parseInt(price).toLocaleString()} ${currencySymbol}`}
        </p>
      </div>
    </button>
  );
};

export default ModificationButton;