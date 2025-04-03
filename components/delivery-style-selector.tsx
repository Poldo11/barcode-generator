import { CODIGOS_SERVICO_REGISTRADO } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeliveryStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DELIVERY_STYLES = [
  { code: "03220", name: "SEDEX" },
  { code: "03204", name: "SEDEX HOJE" },
  { code: "40215", name: "SEDEX 10" },
  { code: "40290", name: "SEDEX Hoje" },
  { code: "04162", name: "SEDEX Internacional" },
  { code: "04669", name: "PAC com registro" },
  { code: "04510", name: "PAC com registro" },
  { code: "04014", name: "SEDEX com registro" },
] as const;

export function DeliveryStyleSelector({
  value,
  onChange,
}: DeliveryStyleSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o estilo de entrega" />
      </SelectTrigger>
      <SelectContent>
        {DELIVERY_STYLES.map((style) => (
          <SelectItem key={style.code} value={style.code}>
            {style.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
