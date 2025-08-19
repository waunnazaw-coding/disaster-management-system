export interface DisasterEvent {
  id: number;
  name?: string;
  locationName?: string;
  severity?: string;
  description?: string;
}

interface DisasterEventSelectProps {
  disasterEvents: DisasterEvent[];
  value: number | null;
  onChange: (val: number | null) => void;
}

export default function DisasterEventSelect({
  disasterEvents,
  value,
  onChange,
}: DisasterEventSelectProps) {
  return (
    <select
      name="DisasterEventId"
      value={value ?? ""}
      onChange={(e) => {
        const selectedId = e.target.value ? Number(e.target.value) : null;
        onChange(selectedId);
      }}
      className="border rounded p-2 w-full"
    >
      <option value="">None</option>
      {disasterEvents.map((ev) => {
        const name = ev.name || "Unnamed";
        const location = ev.locationName || "N/A";
        const severity = ev.severity || "N/A";
        const description = ev.description ?? "N/A";
        const shortDescription =
          description.length > 10 ? `${description.slice(0, 10)}...` : description;

        return (
          <option key={ev.id} value={ev.id}>
            {`Name: ${name}, Location: ${location}, Severity: ${severity}, Description: ${shortDescription}`}
          </option>
        );
      })}
    </select>
  );
}
