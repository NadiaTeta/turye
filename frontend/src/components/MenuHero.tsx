import FilterPills, { type MenuFilter } from "./FilterPills";
import { type SortOption, sortOptions } from "../lib/menu";

interface Props {
  activeCategory: MenuFilter;
  onCategoryChange: (id: MenuFilter) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function MenuHero({ activeCategory, onCategoryChange, sort, onSortChange }: Props) {
  return (
    <section
      id="menu"
      className="flex items-start justify-between gap-6 flex-wrap py-3.5 pb-[30px]"
    >
      <div>
        <h1 className="font-display font-extrabold text-[2.6rem] leading-none mb-5 tracking-tight">
          <span className="text-green-deep">The</span>{" "}
          <span className="text-gold-deep">menu</span>
        </h1>
        <FilterPills active={activeCategory} onChange={onCategoryChange} />
      </div>

      <div className="flex items-center gap-[18px] mt-1">
        <svg
          className="hidden md:block"
          width="140"
          height="60"
          viewBox="0 0 140 60"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 40C20 10 40 55 60 30C80 5 95 45 115 20C122 12 128 15 132 22"
            stroke="#C9BFA6"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <label className="relative flex items-center gap-2.5 bg-white border border-card-line rounded-full pl-4 pr-10 py-2.5 text-sm whitespace-nowrap focus-within:border-green-deep">
          <span>Sort by:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-transparent font-bold outline-none cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
            className="absolute right-4 pointer-events-none"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      </div>
    </section>
  );
}
