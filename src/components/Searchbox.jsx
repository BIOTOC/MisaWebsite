import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function SearchBox({
  filters,
  setFilters,
  onSearch,
  onReset,
  dropdownData,
  searchInputs,
  setSearchInputs
}) {
  // Dropdown config
  const dropdowns = [
    {
      label: "Kênh", key: "channel", options: [
        { label: "Misa Lending", value: "MISA" }
      ]
    },
    {
      label: "Trạng thái xử lý",
      key: "handlingStatus",
      options:
        dropdownData?.reStatus?.map((d) => ({
          label: d.Name,
          value: d.Code
        })) || []
    },
    {
      label: "Trạng thái đơn",
      key: "orderStatus",
      options:
        dropdownData?.insurStatus?.map((d) => ({
          label: d.Name,
          value: d.Code
        })) || []
    },
    {
      label: "Kết quả thẩm định",
      key: "result",
      options:
        dropdownData?.uwStatus?.map((d) => ({
          label: d.Name,
          value: d.Code
        })) || []
    }
  ];

  const renderDropdown = (dropdown) => {
    const value = filters[dropdown.key];

    // Nếu là dropdown đơn giản (string), xử lý riêng
    const isSimpleString = typeof dropdown.options[0] === "string";

    return (
      <div key={dropdown.key}>
        <label className="block mb-1">{dropdown.label}</label>

        <Listbox
          value={value}
          onChange={(val) => setFilters({ ...filters, [dropdown.key]: val })}
        >
          <div className="relative">
            <ListboxButton className="border w-full px-2 py-[3px] rounded text-xs text-left flex justify-between items-center">

              {/* Hiển thị label đúng cách */}
              <span className="truncate">
                {isSimpleString
                  ? value || dropdown.options[0]
                  : dropdown.options.find((o) => o.value === value)?.label ||
                  ""}
              </span>

              <ChevronDown className="w-4 h-4 text-gray-500" />
            </ListboxButton>

            <ListboxOptions className="absolute mt-1 w-full bg-white border rounded shadow text-xs max-h-40 overflow-auto z-10">
              {dropdown.options.map((option) =>
                isSimpleString ? (
                  // Trường hợp dropdown đơn giản (string)
                  <ListboxOption
                    key={option}
                    value={option}
                    className={({ focus, selected }) =>
                      `px-2 py-1 cursor-pointer ${focus ? "bg-brand-orange text-white" : ""
                      } ${selected ? "font-semibold" : ""}`
                    }
                  >
                    {option}
                  </ListboxOption>
                ) : (
                  // Trường hợp dropdown object {label,value}
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    className={({ focus, selected }) =>
                      `px-2 py-1 cursor-pointer ${focus ? "bg-brand-orange text-white" : ""
                      } ${selected ? "font-semibold" : ""}`
                    }
                  >
                    {option.label}
                  </ListboxOption>
                )
              )}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    );
  };

  return (
    <div className="border rounded-xl p-4 mb-4 bg-white shadow text-xs">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Ngày tạo từ / đến */}
        {["fromDate", "toDate"].map((key, idx) => (
          <div key={key}>
            <label className="block mb-1">
              {idx === 0 ? "Ngày tạo từ" : "Ngày tạo đến"}
            </label>
            <input
              type="date"
              value={filters[key]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: e.target.value })
              }
              className="border w-full px-2 py-[3px] rounded text-xs"
            />
          </div>
        ))}

        {/* Dropdowns */}
        {dropdowns.map(renderDropdown)}

        {/* Text inputs */}
        <div>
          <label className="block mb-1">Tên khách hàng</label>
          <input
            value={searchInputs.customer}
            onChange={(e) =>
              setSearchInputs({ ...searchInputs, customer: e.target.value })
            }
            className="border w-full px-2 py-[3px] rounded text-xs"
          />
        </div>

        <div>
          <label className="block mb-1">Biển số xe / Số khung / Số máy</label>
          <input
            value={searchInputs.vehicle}
            onChange={(e) =>
              setSearchInputs({ ...searchInputs, vehicle: e.target.value })
            }
            className="border w-full px-2 py-[3px] rounded text-xs"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-3 py-[3px] rounded shadow text-xs"
          onClick={onSearch}
        >
          Tìm kiếm
        </button>
        <button className="bg-gray-300 px-4 py-1 rounded" onClick={onReset}>
          Làm mới
        </button>
      </div>
    </div>
  );
}
