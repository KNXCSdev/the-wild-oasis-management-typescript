import { useQuery } from "@tanstack/react-query";

import { getCabins } from "../../services/apiCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";

import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import { useSearchParams } from "react-router";
import { CabinsData } from "../../utils/types";

type SortField = keyof Pick<CabinsData, "maxCapacity" | "regularPrice" | "discount" | "created_at">;

export default function CabinTable() {
  const [searchParams] = useSearchParams();

  const { isLoading, data: cabins } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  if (isLoading) return <Spinner />;

  //1)FILTER
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  if (filterValue === "all") {
    filteredCabins = cabins;
  }

  if (filterValue === "no-discount") {
    filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
  }

  if (filterValue === "with-discount") {
    filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);
  }

  //2)SORT
  const sortBy = searchParams.get("sortBy") || "startDate-asc";

  const [field, direction] = sortBy.split("-") as [SortField, "asc" | "desc"];
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins?.sort((a, b) => {
    const aValue = Number(a[field]);
    const bValue = Number(b[field]);

    return (aValue - bValue) * modifier;
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}
