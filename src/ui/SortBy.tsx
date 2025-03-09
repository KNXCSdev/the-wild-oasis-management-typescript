import Select from "./Select";
import { useSearchParams } from "react-router";

type SortTypes = {
  options: { value: string; label: string }[];
};

export default function SortBy({ options }: SortTypes) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return <Select options={options} type="white" value={sortBy} onChange={handleChange} />;
}
