export default function Breadcrumb({ items }) {
    return (
        <div className="text-base font-semibold flex items-center gap-2">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className={index === items.length - 1 ? "text-brand-orange" : ""}>
                        {item}
                    </span>

                    {index < items.length - 1 && (
                        <span className="text-gray-400">›</span>
                    )}
                </div>
            ))}
        </div>
    );
}
