import { Input } from "@/components/ui/input";

type SearchProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export function Search({ searchTerm, setSearchTerm }: SearchProps) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="flex items-center py-4 ml-1">
      <Input
        placeholder="Search for ..."
        value={searchTerm}
        onChange={onChange}
        className="max-w-sm"
      />
    </div>
  );
}
