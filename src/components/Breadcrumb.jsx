export default function Breadcrumb({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-base font-semibold">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              isLast ? "whitespace-normal" : "whitespace-nowrap"
            }`}
          >
            <span
              className={isLast ? "text-brand-orange" : ""}
            >
              {item}
            </span>

            {!isLast && (
              <span className="text-gray-400 whitespace-nowrap">›</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
