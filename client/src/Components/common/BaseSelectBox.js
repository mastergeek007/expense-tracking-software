import { useEffect, useRef, useState } from "react";

export default function BaseSelectBox({
  isLoading = false,
  isError,
  error,
  lists = [],
  value = "",
  setValue,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef();

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val) => {
    setValue(val);
    setSearch("");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`py-3 px-4 border-2 rounded-lg text-sm bg-white dark:bg-neutral-900 dark:border-neutral-700 cursor-pointer ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        {value || "Choose"}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-neutral-900 border border-gray-400 dark:border-neutral-700 rounded-lg mt-1 z-10">
          {isLoading ? (
            <div className="p-2 text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="p-2 text-red-500">
              {error?.data?.message || "An error occurred"}
            </div>
          ) : lists.length === 0 ? (
            <div className="p-2 text-gray-500">No data found</div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border-b border-gray-500 dark:border-neutral-700 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ul className="max-h-60 overflow-auto">
                {filteredLists.map((list) => (
                  <li
                    key={list._id || list.name}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-primary dark:text-white"
                    onClick={() => handleSelect(list.name)}
                  >
                    {list.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
